"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ensureBootstrap } from "@/lib/bootstrap";
import { criarSessao, encerrarSessao, limparTentativas, podeTentarLogin, requireAdmin } from "@/lib/auth";
import { SETTING_FIELDS } from "@/lib/settings";
import { lines, onlyDigits, parseBRL, parseVideo, slugify } from "@/lib/format";
import { removerMidia } from "@/lib/media";

export type Estado = { ok?: boolean; erro?: string; msg?: string } | undefined;

// Hash de comparação usado quando o e-mail não existe (evita revelar e-mails válidos pelo tempo de resposta)
let hashFalso: string | null = null;
const getHashFalso = async () => (hashFalso ??= await bcrypt.hash("senha-inexistente", 12));

const txt = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "1" || f.get(k) === "true";

/** Aceita caminhos internos (/seed/..., /api/media/...) ou https://. */
function urlImagem(v: string) {
  if (!v) return "";
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  try {
    const u = new URL(v);
    return u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

/* ======================= LOGIN ======================= */

export async function login(_: Estado, f: FormData): Promise<Estado> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (!podeTentarLogin(ip)) return { erro: "Muitas tentativas. Aguarde 15 minutos e tente novamente." };

  await ensureBootstrap();
  const email = txt(f, "email", 200).toLowerCase();
  const senha = String(f.get("senha") ?? "");
  const admin = await db.admin.findUnique({ where: { email } });
  // Compara mesmo quando o e-mail não existe, para não revelar quais e-mails são válidos
  const valido = await bcrypt.compare(senha, admin?.passwordHash ?? (await getHashFalso()));
  if (!admin || !valido) {
    if ((await db.admin.count()) === 0) {
      return { erro: "Nenhum administrador cadastrado. Defina ADMIN_EMAIL e ADMIN_PASSWORD nas variáveis do servidor e reinicie." };
    }
    return { erro: "E-mail ou senha incorretos." };
  }
  limparTentativas(ip);
  await db.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  await criarSessao(admin.id, admin.sessionVersion);
  redirect("/admin");
}

export async function logout() {
  await encerrarSessao();
  redirect("/admin/login");
}

/* ======================= CONTA ======================= */

export async function trocarSenha(_: Estado, f: FormData): Promise<Estado> {
  const eu = await requireAdmin();
  const atual = String(f.get("atual") ?? "");
  const nova = String(f.get("nova") ?? "");
  const conf = String(f.get("confirmacao") ?? "");
  if (nova.length < 10) return { erro: "A nova senha precisa ter pelo menos 10 caracteres." };
  if (nova !== conf) return { erro: "A confirmação não confere com a nova senha." };
  if (nova === atual) return { erro: "A nova senha precisa ser diferente da atual." };
  const admin = await db.admin.findUniqueOrThrow({ where: { id: eu.id } });
  if (!(await bcrypt.compare(atual, admin.passwordHash))) return { erro: "A senha atual está incorreta." };
  const atualizado = await db.admin.update({
    where: { id: eu.id },
    data: { passwordHash: await bcrypt.hash(nova, 12), sessionVersion: { increment: 1 } },
  });
  await criarSessao(atualizado.id, atualizado.sessionVersion); // mantém você logado; outras sessões caem
  return { ok: true, msg: "Senha alterada. Outras sessões abertas foram encerradas." };
}

export async function salvarPerfil(_: Estado, f: FormData): Promise<Estado> {
  const eu = await requireAdmin();
  const nome = txt(f, "nome", 80);
  const email = txt(f, "email", 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { erro: "Informe um e-mail válido." };
  const outro = await db.admin.findUnique({ where: { email } });
  if (outro && outro.id !== eu.id) return { erro: "Este e-mail já está em uso." };
  await db.admin.update({ where: { id: eu.id }, data: { name: nome || "Administrador", email } });
  refresh();
  return { ok: true, msg: "Dados atualizados." };
}

/* ======================= TEXTOS / CONFIGURAÇÕES ======================= */

export async function salvarTextos(_: Estado, f: FormData): Promise<Estado> {
  await requireAdmin();
  const grupo = txt(f, "_grupo", 40);
  const campos = SETTING_FIELDS.filter((c) => f.has(c.key) || (c.type === "toggle" && f.has(`_toggle_${c.key}`)));
  if (!campos.length) return { erro: "Nada para salvar." };

  const valores: { key: string; value: string }[] = [];
  for (const c of campos) {
    let v = c.type === "toggle" ? (bool(f, c.key) ? "1" : "0") : txt(f, c.key, 5000);
    if (c.key === "whatsapp_number" && v) {
      v = onlyDigits(v);
      if (v.length < 12 || v.length > 13) return { erro: "WhatsApp: use 55 + DDD + número (12 ou 13 dígitos). Ex.: 5511987654321" };
    }
    if ((c.key === "instagram" || c.key === "linkedin") && v && !/^https:\/\//.test(v)) {
      return { erro: `${c.label}: informe o link completo começando com https://` };
    }
    if (c.type === "image") v = urlImagem(v);
    valores.push({ key: c.key, value: v });
  }
  await db.$transaction(
    valores.map((v) => db.setting.upsert({ where: { key: v.key }, create: v, update: { value: v.value } })),
  );
  refresh();
  return { ok: true, msg: grupo ? `“${grupo}” salvo. Já está no site.` : "Salvo. Já está no site." };
}

/* ======================= ORDENAÇÃO (genérica) ======================= */

type Ordenavel = "equipment" | "category" | "banner" | "video";

async function mover(tipo: Ordenavel, id: string, direcao: "cima" | "baixo") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (db as any)[tipo];
  const lista: { id: string }[] = await model.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { id: true } });
  const i = lista.findIndex((x) => x.id === id);
  const j = direcao === "cima" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= lista.length) return;
  [lista[i], lista[j]] = [lista[j], lista[i]];
  await db.$transaction(lista.map((x, k) => model.update({ where: { id: x.id }, data: { order: k + 1 } })));
}

async function proximaOrdem(tipo: Ordenavel) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = await (db as any)[tipo].aggregate({ _max: { order: true } });
  return (r._max.order ?? 0) + 1;
}

export async function moverItem(tipo: Ordenavel, id: string, direcao: "cima" | "baixo") {
  await requireAdmin();
  if (!["equipment", "category", "banner", "video"].includes(tipo)) return;
  await mover(tipo, id, direcao);
  refresh();
}

export async function alternarAtivo(tipo: "equipment" | "banner" | "video", id: string) {
  await requireAdmin();
  if (!["equipment", "banner", "video"].includes(tipo)) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = (db as any)[tipo];
  const atual = await model.findUnique({ where: { id }, select: { active: true } });
  if (atual) await model.update({ where: { id }, data: { active: !atual.active } });
  refresh();
}

/* ======================= EQUIPAMENTOS ======================= */

export async function salvarEquipamento(_: Estado, f: FormData): Promise<Estado> {
  await requireAdmin();
  const id = txt(f, "id", 40);
  const name = txt(f, "name", 120);
  if (!name) return { erro: "Informe o nome do equipamento." };
  const precoTxt = txt(f, "price", 30);
  const priceCents = parseBRL(precoTxt);
  if (precoTxt && priceCents == null) return { erro: "Preço inválido. Use, por exemplo, 249,90 — ou deixe vazio para “sob consulta”." };
  const categoryId = txt(f, "categoryId", 40) || null;
  if (categoryId && !(await db.category.findUnique({ where: { id: categoryId } }))) return { erro: "Categoria não encontrada." };

  const data = {
    name,
    description: txt(f, "description", 600),
    features: lines(txt(f, "features", 1500)).slice(0, 8),
    priceCents,
    pricePrefix: txt(f, "pricePrefix", 40),
    priceSuffix: txt(f, "priceSuffix", 20),
    priceNote: txt(f, "priceNote", 300),
    ctaLabel: txt(f, "ctaLabel", 60) || "Solicitar cotação",
    whatsappMsg: txt(f, "whatsappMsg", 600),
    imageUrl: urlImagem(txt(f, "imageUrl", 600)),
    featured: bool(f, "featured"),
    active: bool(f, "active"),
    categoryId,
  };

  if (id) {
    await db.equipment.update({ where: { id }, data });
    refresh();
    return { ok: true, msg: "Equipamento salvo. Já está no site." };
  }
  await db.equipment.create({ data: { ...data, order: await proximaOrdem("equipment") } });
  redirect("/admin/equipamentos?salvo=1");
}

export async function excluirEquipamento(id: string) {
  await requireAdmin();
  await db.equipment.delete({ where: { id } }).catch(() => null);
  redirect("/admin/equipamentos?excluido=1");
}

/* ======================= CATEGORIAS ======================= */

export async function salvarCategoria(_: Estado, f: FormData): Promise<Estado> {
  await requireAdmin();
  const id = txt(f, "id", 40);
  const name = txt(f, "name", 60);
  if (!name) return { erro: "Informe o nome da categoria." };
  let slug = slugify(name) || "categoria";
  const existente = await db.category.findUnique({ where: { slug } });
  if (existente && existente.id !== id) slug = `${slug}-${Date.now().toString(36)}`;
  if (id) await db.category.update({ where: { id }, data: { name, slug } });
  else await db.category.create({ data: { name, slug, order: await proximaOrdem("category") } });
  refresh();
  return { ok: true, msg: "Categoria salva." };
}

export async function excluirCategoria(id: string) {
  await requireAdmin();
  await db.category.delete({ where: { id } }).catch(() => null); // equipamentos ficam "sem categoria"
  refresh();
}

/* ======================= BANNERS ======================= */

export async function salvarBanner(_: Estado, f: FormData): Promise<Estado> {
  await requireAdmin();
  const id = txt(f, "id", 40);
  const imageUrl = urlImagem(txt(f, "imageUrl", 600));
  if (!imageUrl) return { erro: "Escolha ou envie uma imagem para o banner." };
  const data = { title: txt(f, "title", 120), subtitle: txt(f, "subtitle", 200), imageUrl, active: bool(f, "active") };
  if (id) await db.banner.update({ where: { id }, data });
  else await db.banner.create({ data: { ...data, order: await proximaOrdem("banner") } });
  refresh();
  return { ok: true, msg: id ? "Banner atualizado." : "Banner adicionado." };
}

export async function excluirBanner(id: string) {
  await requireAdmin();
  await db.banner.delete({ where: { id } }).catch(() => null);
  refresh();
}

/* ======================= VÍDEOS ======================= */

export async function salvarVideo(_: Estado, f: FormData): Promise<Estado> {
  await requireAdmin();
  const id = txt(f, "id", 40);
  const title = txt(f, "title", 120);
  const url = txt(f, "url", 400);
  if (!title) return { erro: "Informe um título para o vídeo." };
  if (!parseVideo(url)) return { erro: "Link não reconhecido. Use um link do YouTube ou do Vimeo." };
  const data = { title, url, active: bool(f, "active") };
  if (id) await db.video.update({ where: { id }, data });
  else await db.video.create({ data: { ...data, order: await proximaOrdem("video") } });
  refresh();
  return { ok: true, msg: id ? "Vídeo atualizado." : "Vídeo adicionado." };
}

export async function excluirVideo(id: string) {
  await requireAdmin();
  await db.video.delete({ where: { id } }).catch(() => null);
  refresh();
}

/* ======================= IMAGENS ======================= */

export async function excluirImagem(id: string): Promise<Estado> {
  await requireAdmin();
  const m = await db.media.findUnique({ where: { id }, select: { url: true } });
  if (!m) return { erro: "Imagem não encontrada." };
  const [eq, bn, st] = await Promise.all([
    db.equipment.count({ where: { imageUrl: m.url } }),
    db.banner.count({ where: { imageUrl: m.url } }),
    db.setting.count({ where: { value: m.url } }),
  ]);
  if (eq + bn + st > 0) return { erro: "Esta imagem está em uso no site. Troque-a antes de excluir." };
  await removerMidia(id);
  refresh();
  return { ok: true, msg: "Imagem excluída." };
}

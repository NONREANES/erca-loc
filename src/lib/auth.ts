import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import { ensureBootstrap } from "./bootstrap";

export const SESSION_COOKIE = "erca_admin";
const DURACAO_HORAS = 8;

function chave() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET ausente ou curta (mínimo 32 caracteres). Veja o .env.example.");
  }
  return new TextEncoder().encode(s);
}

type Payload = { sub: string; v: number };

export async function criarSessao(adminId: string, versao: number) {
  const token = await new SignJWT({ v: versao } satisfies Omit<Payload, "sub">)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_HORAS}h`)
    .sign(chave());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_HORAS * 3600,
  });
}

export async function encerrarSessao() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Lê e valida a sessão no servidor. Retorna o admin ou null. */
export async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chave(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    await ensureBootstrap();
    const admin = await db.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, sessionVersion: true },
    });
    // Senha trocada depois do login => sessão antiga deixa de valer
    if (!admin || admin.sessionVersion !== payload.v) return null;
    return { id: admin.id, email: admin.email, name: admin.name };
  } catch {
    return null;
  }
}

/** Use no início de toda página e ação do painel. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/* ---- Limite de tentativas de login (por IP, em memória) ---- */
const tentativas = new Map<string, number[]>();
export function podeTentarLogin(ip: string) {
  const agora = Date.now();
  const janela = 15 * 60 * 1000;
  const lista = (tentativas.get(ip) ?? []).filter((t) => t > agora - janela);
  if (lista.length >= 8) {
    tentativas.set(ip, lista);
    return false;
  }
  lista.push(agora);
  tentativas.set(ip, lista);
  return true;
}
export function limparTentativas(ip: string) {
  tentativas.delete(ip);
}

import "server-only";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { DEFAULT_SETTINGS } from "./settings";

/**
 * Prepara o banco na primeira execução (idempotente):
 * 1. cria os textos padrão que ainda não existem;
 * 2. cadastra os equipamentos iniciais do briefing (só uma vez);
 * 3. cria o primeiro administrador a partir de ADMIN_EMAIL / ADMIN_PASSWORD, se ainda não houver nenhum.
 */
let pronto: Promise<void> | null = null;

export function ensureBootstrap(): Promise<void> {
  if (!pronto) {
    pronto = executar().catch((err) => {
      pronto = null; // tenta de novo na próxima requisição
      throw err;
    });
  }
  return pronto;
}

async function executar() {
  await db.setting.createMany({
    data: Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value })),
    skipDuplicates: true,
  });

  const jaSemeado = await db.setting.findUnique({ where: { key: "_seeded" } });
  if (!jaSemeado) {
    await semearConteudo();
    await db.setting.upsert({ where: { key: "_seeded" }, create: { key: "_seeded", value: "1" }, update: {} });
  }

  await criarPrimeiroAdmin();
}

async function semearConteudo() {
  const [equipCount, bannerCount] = await Promise.all([db.equipment.count(), db.banner.count()]);

  if (equipCount === 0) {
    const cats = [
      { name: "Notebooks", slug: "notebooks", order: 1 },
      { name: "Monitores", slug: "monitores", order: 2 },
      { name: "Celulares", slug: "celulares", order: 3 },
      { name: "Impressoras", slug: "impressoras", order: 4 },
    ];
    const criadas = new Map<string, string>();
    for (const c of cats) {
      const cat = await db.category.upsert({ where: { slug: c.slug }, create: c, update: {} });
      criadas.set(c.slug, cat.id);
    }

    await db.equipment.createMany({
      data: [
        {
          name: "Notebook Dell Core i5",
          categoryId: criadas.get("notebooks"),
          description:
            "Notebooks Dell com processadores Intel Core i5 da 8ª à 13ª geração, ideais para rotinas de escritório, sistemas corporativos e trabalho híbrido.",
          features: ["Intel Core i5 — 8ª à 13ª geração", "Configurações para diferentes perfis de uso", "Entregue pronto para uso"],
          priceCents: 24990,
          pricePrefix: "A partir de",
          priceSuffix: "/mês",
          priceNote: "Valor inicial. O preço varia conforme configuração, geração e disponibilidade.",
          ctaLabel: "Consultar disponibilidade",
          imageUrl: "/seed/notebooks.webp",
          featured: true,
          order: 1,
        },
        {
          name: "Monitores",
          categoryId: criadas.get("monitores"),
          description: "Monitores para ampliar a área de trabalho e a produtividade das estações da sua equipe.",
          features: ["Locação corporativa", "Diversos tamanhos", "Ideal para estações fixas"],
          ctaLabel: "Solicitar cotação",
          imageUrl: "/seed/monitor.webp",
          order: 2,
        },
        {
          name: "Celulares",
          categoryId: criadas.get("celulares"),
          description: "Smartphones corporativos para equipes externas, vendas e comunicação do time.",
          features: ["Locação corporativa", "Para equipes em campo", "Controle por colaborador"],
          ctaLabel: "Solicitar cotação",
          imageUrl: "/seed/celulares.svg",
          order: 3,
        },
        {
          name: "Impressoras",
          categoryId: criadas.get("impressoras"),
          description: "Impressoras e multifuncionais para o dia a dia do escritório, sem custo de compra e manutenção.",
          features: ["Locação empresarial", "Multifuncionais", "Para escritórios de todos os tamanhos"],
          ctaLabel: "Solicitar cotação",
          imageUrl: "/seed/impressora.webp",
          order: 4,
        },
      ],
    });
  }

  if (bannerCount === 0) {
    await db.banner.create({
      data: {
        title: "Notebooks Dell para a sua equipe",
        subtitle: "Intel Core i5 · a partir de R$ 249,90/mês",
        imageUrl: "/seed/notebooks.webp",
        order: 1,
      },
    });
  }
}

async function criarPrimeiroAdmin() {
  const total = await db.admin.count();
  if (total > 0) return;

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;
  if (!email || !senha) {
    console.warn("[ERCA LOC] Nenhum administrador cadastrado. Defina ADMIN_EMAIL e ADMIN_PASSWORD para criar o primeiro acesso.");
    return;
  }
  if (senha.length < 10) {
    console.warn("[ERCA LOC] ADMIN_PASSWORD precisa ter pelo menos 10 caracteres. Administrador não criado.");
    return;
  }
  await db.admin.create({
    data: { email, passwordHash: await bcrypt.hash(senha, 12), name: "Administrador" },
  });
  console.info(`[ERCA LOC] Primeiro administrador criado: ${email}. Troque a senha no painel após o primeiro acesso.`);
}

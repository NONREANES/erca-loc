import "server-only";
import { db } from "./db";
import { ensureBootstrap } from "./bootstrap";
import { DEFAULT_SETTINGS, type Settings } from "./settings";

export async function getSettings(): Promise<Settings> {
  await ensureBootstrap();
  const rows = await db.setting.findMany();
  const s: Settings = { ...DEFAULT_SETTINGS };
  for (const r of rows) s[r.key] = r.value;
  return s;
}

/** Tudo o que o site público precisa, numa leitura só. */
export async function getSiteData() {
  await ensureBootstrap();
  const [settings, equipments, banners, videos] = await Promise.all([
    getSettings(),
    db.equipment.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: { category: true },
    }),
    db.banner.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    db.video.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
  ]);

  const categorias = new Map<string, { id: string; name: string; slug: string; order: number }>();
  for (const e of equipments) if (e.category) categorias.set(e.category.id, e.category);

  return {
    settings,
    equipments: equipments.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      features: e.features,
      priceCents: e.priceCents,
      pricePrefix: e.pricePrefix,
      priceSuffix: e.priceSuffix,
      priceNote: e.priceNote,
      ctaLabel: e.ctaLabel,
      whatsappMsg: e.whatsappMsg,
      imageUrl: e.imageUrl,
      featured: e.featured,
      category: e.category ? { id: e.category.id, name: e.category.name, slug: e.category.slug } : null,
    })),
    categories: [...categorias.values()].sort((a, b) => a.order - b.order).map(({ id, name, slug }) => ({ id, name, slug })),
    banners: banners.map((b) => ({ id: b.id, title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl })),
    videos: videos.map((v) => ({ id: v.id, title: v.title, url: v.url })),
  };
}

export type SiteData = Awaited<ReturnType<typeof getSiteData>>;
export type PublicEquipment = SiteData["equipments"][number];

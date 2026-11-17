import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

/** Lista as imagens da biblioteca (para o seletor do painel). */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return Response.json({ erro: "Não autorizado." }, { status: 401 });
  const itens = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, url: true, filename: true, width: true, height: true, size: true },
  });
  const seeds = ["/seed/notebooks.webp", "/seed/monitor.webp", "/seed/celulares.svg", "/seed/impressora.webp"].map((url) => ({
    id: url,
    url,
    filename: url.split("/").pop(),
    width: null,
    height: null,
    size: null,
  }));
  return Response.json({ itens: [...itens, ...seeds] }, { headers: { "Cache-Control": "no-store" } });
}

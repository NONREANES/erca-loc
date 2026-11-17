import { connection } from "next/server";
import { db } from "@/lib/db";

/** Entrega imagens guardadas no banco (quando o Cloudinary não está configurado). */
export async function GET(_req: Request, ctx: RouteContext<"/api/media/[id]">) {
  await connection();
  const { id } = await ctx.params;
  if (!/^[a-z0-9]{10,40}$/i.test(id)) return new Response("Não encontrado", { status: 404 });
  const m = await db.media.findUnique({ where: { id }, select: { data: true, mime: true, storage: true, url: true } });
  if (!m) return new Response("Não encontrado", { status: 404 });
  if (m.storage !== "database" || !m.data) return Response.redirect(m.url, 302);
  return new Response(Buffer.from(m.data), {
    headers: {
      "Content-Type": m.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}

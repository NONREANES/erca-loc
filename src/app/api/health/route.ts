import { connection } from "next/server";
import { db } from "@/lib/db";

/** Usado pela Railway para saber se o site está no ar. */
export async function GET() {
  await connection();
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, banco: "ok" });
  } catch {
    return Response.json({ ok: false, banco: "indisponível" }, { status: 503 });
  }
}

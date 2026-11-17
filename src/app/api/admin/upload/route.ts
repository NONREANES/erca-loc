import { getAdmin } from "@/lib/auth";
import { salvarUpload } from "@/lib/media";

/** Recebe uma imagem do painel (campo "arquivo") e devolve a URL pública. */
export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return Response.json({ erro: "Sessão expirada. Entre novamente." }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ erro: "Envio inválido." }, { status: 400 });
  }
  const arquivo = form.get("arquivo");
  if (!(arquivo instanceof File)) return Response.json({ erro: "Nenhum arquivo enviado." }, { status: 400 });

  try {
    const m = await salvarUpload(arquivo);
    return Response.json({ id: m.id, url: m.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Falha ao salvar a imagem.";
    console.error("[upload]", e);
    return Response.json({ erro: msg }, { status: 400 });
  }
}

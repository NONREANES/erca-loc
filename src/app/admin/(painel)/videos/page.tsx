import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { alternarAtivo, excluirVideo, moverItem, salvarVideo } from "../../actions";
import { ActionButton, ActionForm, Field, Toggle, inputCls } from "@/components/admin/ui";

export default async function VideosPage() {
  await requireAdmin();
  const videos = await db.video.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-navy">Vídeos</h1>
      <p className="mt-1 text-slate">
        Cole links do YouTube ou do Vimeo. O vídeo só toca quando o visitante clica (sem som automático). Sem vídeos ativos, a seção não aparece no site.
      </p>

      <div className="mt-6 rounded-2xl border border-navy/8 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Adicionar vídeo</h2>
        <ActionForm action={salvarVideo} submitLabel="Adicionar vídeo" resetOnSuccess className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título"><input name="title" required maxLength={120} className={inputCls} placeholder="Conheça a ERCA LOC" /></Field>
            <Field label="Link do vídeo"><input name="url" required className={inputCls} placeholder="https://www.youtube.com/watch?v=…" /></Field>
          </div>
          <Toggle name="active" label="Ativo no site" defaultChecked />
        </ActionForm>
      </div>

      <ul className="mt-6 space-y-3">
        {videos.map((v, i) => (
          <li key={v.id} className={`rounded-2xl border bg-white p-5 ${v.active ? "border-navy/8" : "border-dashed border-navy/20"}`}>
            <div className="mb-3 flex flex-wrap items-center justify-end gap-1.5">
              {!v.active && <span className="mr-auto rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-slate">Inativo</span>}
              <ActionButton title="Subir" action={moverItem.bind(null, "video", v.id, "cima")} className={i === 0 ? "invisible" : ""}>↑</ActionButton>
              <ActionButton title="Descer" action={moverItem.bind(null, "video", v.id, "baixo")} className={i === videos.length - 1 ? "invisible" : ""}>↓</ActionButton>
              <ActionButton action={alternarAtivo.bind(null, "video", v.id)}>{v.active ? "Desativar" : "Ativar"}</ActionButton>
              <ActionButton action={excluirVideo.bind(null, v.id)} confirmar="Excluir este vídeo?" className="text-red-600 hover:border-red-300">Excluir</ActionButton>
            </div>
            <ActionForm action={salvarVideo} submitLabel="Salvar">
              <input type="hidden" name="id" value={v.id} />
              <input type="hidden" name="active" value={v.active ? "on" : ""} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Título"><input name="title" defaultValue={v.title} required className={inputCls} /></Field>
                <Field label="Link"><input name="url" defaultValue={v.url} required className={inputCls} /></Field>
              </div>
            </ActionForm>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { alternarAtivo, excluirBanner, moverItem, salvarBanner } from "../../actions";
import { ActionButton, ActionForm, Field, Toggle, inputCls } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";

export default async function BannersPage() {
  await requireAdmin();
  const banners = await db.banner.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-extrabold text-navy">Banners (tela do monitor)</h1>
      <p className="mt-1 text-slate">Imagens exibidas na tela do monitor da cena animada, no topo do site. Com mais de uma ativa, elas se alternam sozinhas. Sem nenhuma, aparece o papel de parede da marca.</p>

      <details className="mt-6 rounded-2xl border border-navy/8 bg-white p-6 open:shadow-sm">
        <summary className="cursor-pointer font-display text-lg font-bold text-navy">+ Adicionar banner</summary>
        <ActionForm action={salvarBanner} submitLabel="Adicionar banner" className="mt-5">
          <ImageField name="imageUrl" label="Imagem" help="Ideal: formato de tela 16:9 (ex.: 1600×900)." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título (opcional)"><input name="title" maxLength={120} className={inputCls} /></Field>
            <Field label="Subtítulo (opcional)"><input name="subtitle" maxLength={200} className={inputCls} /></Field>
          </div>
          <Toggle name="active" label="Ativo no site" defaultChecked />
        </ActionForm>
      </details>

      <ul className="mt-6 space-y-4">
        {banners.length === 0 && <li className="rounded-2xl border border-dashed border-navy/20 bg-white p-10 text-center text-slate">Nenhum banner. O monitor do topo mostra o papel de parede da marca.</li>}
        {banners.map((b, i) => (
          <li key={b.id} className={`rounded-2xl border bg-white p-6 ${b.active ? "border-navy/8" : "border-dashed border-navy/20"}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate">
                Banner {i + 1} {!b.active && <span className="ml-2 rounded-full bg-navy/10 px-2 py-0.5 text-[11px]">Inativo</span>}
              </span>
              <div className="flex items-center gap-1.5">
                <ActionButton title="Subir" action={moverItem.bind(null, "banner", b.id, "cima")} className={i === 0 ? "invisible" : ""}>↑</ActionButton>
                <ActionButton title="Descer" action={moverItem.bind(null, "banner", b.id, "baixo")} className={i === banners.length - 1 ? "invisible" : ""}>↓</ActionButton>
                <ActionButton action={alternarAtivo.bind(null, "banner", b.id)}>{b.active ? "Desativar" : "Ativar"}</ActionButton>
                <ActionButton action={excluirBanner.bind(null, b.id)} confirmar="Excluir este banner?" className="text-red-600 hover:border-red-300">Excluir</ActionButton>
              </div>
            </div>
            <ActionForm action={salvarBanner} submitLabel="Salvar banner">
              <input type="hidden" name="id" value={b.id} />
              <input type="hidden" name="active" value={b.active ? "on" : ""} />
              <ImageField name="imageUrl" label="Imagem" defaultValue={b.imageUrl} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Título"><input name="title" defaultValue={b.title} maxLength={120} className={inputCls} /></Field>
                <Field label="Subtítulo"><input name="subtitle" defaultValue={b.subtitle} maxLength={200} className={inputCls} /></Field>
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

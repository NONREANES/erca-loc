import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { excluirCategoria, moverItem, salvarCategoria } from "../../actions";
import { ActionButton, ActionForm, inputCls } from "@/components/admin/ui";

export default async function CategoriasPage() {
  await requireAdmin();
  const cats = await db.category.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }], include: { _count: { select: { equipments: true } } } });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-navy">Categorias</h1>
      <p className="mt-1 text-slate">Viram os filtros acima dos equipamentos no site (Notebooks, Monitores…).</p>

      <div className="mt-6 rounded-2xl border border-navy/8 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Nova categoria</h2>
        <ActionForm action={salvarCategoria} submitLabel="Adicionar" resetOnSuccess className="mt-4">
          <input name="name" required maxLength={60} placeholder="Ex.: Tablets" className={inputCls} aria-label="Nome da categoria" />
        </ActionForm>
      </div>

      <ul className="mt-6 space-y-3">
        {cats.map((c, i) => (
          <li key={c.id} className="rounded-2xl border border-navy/8 bg-white p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <ActionForm action={salvarCategoria} submitLabel="Renomear" className="flex flex-wrap items-center gap-3 space-y-0 [&>div]:shrink-0">
                  <input type="hidden" name="id" value={c.id} />
                  <input name="name" defaultValue={c.name} required maxLength={60} className={`${inputCls} max-w-xs`} aria-label="Nome" />
                </ActionForm>
                <p className="mt-2 text-xs text-slate">{c._count.equipments} equipamento(s)</p>
              </div>
              <div className="flex items-center gap-1.5">
                <ActionButton title="Subir" action={moverItem.bind(null, "category", c.id, "cima")} className={i === 0 ? "invisible" : ""}>↑</ActionButton>
                <ActionButton title="Descer" action={moverItem.bind(null, "category", c.id, "baixo")} className={i === cats.length - 1 ? "invisible" : ""}>↓</ActionButton>
                <ActionButton
                  action={excluirCategoria.bind(null, c.id)}
                  confirmar={`Excluir a categoria “${c.name}”? Os equipamentos dela ficarão sem categoria.`}
                  className="text-red-600 hover:border-red-300 hover:text-red-700"
                >
                  Excluir
                </ActionButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

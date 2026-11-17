/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatBRL } from "@/lib/format";
import { alternarAtivo, moverItem } from "../../actions";
import { ActionButton } from "@/components/admin/ui";

export default async function EquipamentosPage({ searchParams }: PageProps<"/admin/equipamentos">) {
  await requireAdmin();
  const sp = await searchParams;
  const itens = await db.equipment.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }], include: { category: true } });

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy">Equipamentos e preços</h1>
          <p className="mt-1 text-slate">Use as setas para definir a ordem em que aparecem no site.</p>
        </div>
        <Link href="/admin/equipamentos/novo" className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-turquoise">
          + Novo equipamento
        </Link>
      </div>

      {sp.salvo && <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">Equipamento criado.</p>}
      {sp.excluido && <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">Equipamento excluído.</p>}

      <ul className="mt-6 space-y-3">
        {itens.length === 0 && <li className="rounded-2xl border border-dashed border-navy/20 bg-white p-10 text-center text-slate">Nenhum equipamento cadastrado.</li>}
        {itens.map((e, i) => (
          <li key={e.id} className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4 ${e.active ? "border-navy/8" : "border-dashed border-navy/20 opacity-70"}`}>
            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-mist">
              {e.imageUrl && <img src={e.imageUrl} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/equipamentos/${e.id}`} className="font-semibold text-navy hover:text-turquoise-600">
                  {e.name}
                </Link>
                {e.featured && <span className="rounded-full bg-turquoise/15 px-2 py-0.5 text-[11px] font-bold text-turquoise-600">Destaque</span>}
                {!e.active && <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-bold text-slate">Oculto do site</span>}
              </div>
              <p className="text-sm text-slate">
                {e.category?.name ?? "Sem categoria"} ·{" "}
                {e.priceCents != null ? `${e.pricePrefix} ${formatBRL(e.priceCents)}${e.priceSuffix}` : "Sob consulta"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <ActionButton title="Subir" action={moverItem.bind(null, "equipment", e.id, "cima")} className={i === 0 ? "invisible" : ""}>↑</ActionButton>
              <ActionButton title="Descer" action={moverItem.bind(null, "equipment", e.id, "baixo")} className={i === itens.length - 1 ? "invisible" : ""}>↓</ActionButton>
              <ActionButton action={alternarAtivo.bind(null, "equipment", e.id)}>{e.active ? "Ocultar" : "Mostrar"}</ActionButton>
              <Link href={`/admin/equipamentos/${e.id}`} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-turquoise">
                Editar
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

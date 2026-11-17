"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { formatBRL } from "@/lib/format";
import { IconCheck, IconWhatsApp } from "../icons";

export type EquipCard = {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceCents: number | null;
  pricePrefix: string;
  priceSuffix: string;
  priceNote: string;
  ctaLabel: string;
  imageUrl: string;
  featured: boolean;
  category: { id: string; name: string; slug: string } | null;
  waLink: string;
};

export function EquipmentGrid({ items, categories }: { items: EquipCard[]; categories: { id: string; name: string }[] }) {
  const [filtro, setFiltro] = useState<string>("todos");
  const lista = useMemo(
    () => (filtro === "todos" ? items : items.filter((e) => e.category?.id === filtro)),
    [filtro, items],
  );

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filtrar equipamentos">
          {[{ id: "todos", name: "Todos" }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={filtro === c.id}
              onClick={() => setFiltro(c.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                filtro === c.id
                  ? "border-navy bg-navy text-white shadow-md shadow-navy/20"
                  : "border-navy/10 bg-white text-navy hover:border-turquoise hover:text-turquoise-600"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {lista.map((e) => (
          <article
            key={e.id}
            className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy/10 ${
              e.featured ? "border-turquoise/60 ring-1 ring-turquoise/40" : "border-navy/8"
            }`}
          >
            {e.featured && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-turquoise px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Destaque
              </span>
            )}
            <div className="relative aspect-[4/3] overflow-hidden border-b border-navy/5 bg-white">
              {e.imageUrl ? (
                <img
                  src={e.imageUrl}
                  alt={e.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-slate">Imagem em breve</div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-6">
              {e.category && (
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-turquoise-600">{e.category.name}</span>
              )}
              <h3 className="mt-1.5 font-display text-xl font-bold text-navy">{e.name}</h3>
              {e.description && <p className="mt-2 text-sm leading-relaxed text-slate">{e.description}</p>}

              {e.features.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {e.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-ink/80">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-turquoise" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-6">
                <div className="rounded-2xl bg-mist/70 px-4 py-3">
                  {e.priceCents != null ? (
                    <>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-slate">{e.pricePrefix}</span>
                      <span className="font-display text-3xl font-extrabold text-navy">{formatBRL(e.priceCents)}</span>
                      <span className="ml-1 text-sm font-semibold text-slate">{e.priceSuffix}</span>
                      {e.priceNote && <span className="mt-1 block text-xs leading-snug text-slate">{e.priceNote}</span>}
                    </>
                  ) : (
                    <>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-slate">Valor</span>
                      <span className="font-display text-xl font-bold text-navy">Sob consulta</span>
                      {e.priceNote && <span className="mt-1 block text-xs leading-snug text-slate">{e.priceNote}</span>}
                    </>
                  )}
                </div>
                <a
                  href={e.waLink}
                  target={e.waLink.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  className="mt-4 flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-turquoise"
                >
                  <IconWhatsApp className="h-4 w-4" />
                  {e.ctaLabel || "Solicitar cotação"}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

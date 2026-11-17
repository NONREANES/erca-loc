"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

type Banner = { id: string; title: string; subtitle: string; imageUrl: string };

/** Imagens do topo. Com mais de uma, alterna sozinho a cada 5 segundos. */
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const total = banners.length;

  useEffect(() => {
    if (total < 2) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) return;
    const t = setInterval(() => setI((v) => (v + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  if (!total) return null;
  const atual = banners[i];

  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[3rem] bg-turquoise/20 blur-3xl" aria-hidden="true" />
      <div className="flutuar relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-2xl shadow-navy-900/50">
        <div className="relative aspect-[4/3]">
          {banners.map((b, k) => (
            <img
              key={b.id}
              src={b.imageUrl}
              alt={b.title || "Equipamentos ERCA LOC"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}
              fetchPriority={k === 0 ? "high" : "low"}
              loading={k === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
        {(atual.title || atual.subtitle) && (
          <div className="flex items-center justify-between gap-4 border-t border-mist bg-white px-5 py-4">
            <div className="min-w-0">
              {atual.title && <p className="truncate font-display text-base font-bold text-navy">{atual.title}</p>}
              {atual.subtitle && <p className="truncate text-sm text-slate">{atual.subtitle}</p>}
            </div>
            {total > 1 && (
              <div className="flex shrink-0 gap-1.5" role="tablist" aria-label="Imagens">
                {banners.map((b, k) => (
                  <button
                    key={b.id}
                    type="button"
                    role="tab"
                    aria-selected={k === i}
                    aria-label={`Imagem ${k + 1}`}
                    onClick={() => setI(k)}
                    className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-turquoise" : "w-2 bg-mist hover:bg-sky"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

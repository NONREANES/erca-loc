"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { parseVideo } from "@/lib/format";
import { LogoSymbol } from "../Logo";
import { IconPlay } from "../icons";

/** Carrega o vídeo só quando a pessoa clica (sem autoplay com som ao abrir o site). */
export function VideoCard({ title, url }: { title: string; url: string }) {
  const [tocando, setTocando] = useState(false);
  const v = parseVideo(url);
  if (!v) return null;

  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-xl">
      <div className="relative aspect-video">
        {tocando ? (
          <iframe
            src={v.embed}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setTocando(true)}
            className="group absolute inset-0 grid place-items-center"
            aria-label={`Assistir: ${title}`}
          >
            {v.thumb ? (
              <img src={v.thumb} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100" loading="lazy" />
            ) : (
              <div className="bg-grid absolute inset-0 grid place-items-center bg-gradient-to-br from-navy-700 to-navy-900">
                <LogoSymbol className="h-20 w-20 opacity-40" />
              </div>
            )}
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-turquoise text-white shadow-xl shadow-turquoise/40 transition group-hover:scale-110">
              <IconPlay className="ml-1 h-7 w-7" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="px-5 py-4 font-display font-semibold text-white">{title}</figcaption>
    </figure>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
/* eslint-disable @next/next/no-img-element */
import { LOGO_PADRAO, LogoSymbol } from "../Logo";

const CHAVE = "erca_intro_vista";
const DURACAO = 3400; // tempo total da abertura antes de revelar o site

/**
 * Abertura animada: desenha o símbolo, mostra ERCA LOC e a assinatura,
 * e então "sobe" revelando o site. Aparece uma vez por sessão do navegador.
 */
export function Splash({ logoUrl }: { logoUrl?: string }) {
  const [saindo, setSaindo] = useState(false);
  const [fim, setFim] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const encerrar = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setSaindo(true);
    try {
      sessionStorage.setItem(CHAVE, "1");
    } catch {
      /* navegação privada: ignora */
    }
    setTimeout(() => {
      setFim(true);
      document.documentElement.classList.add("intro-vista");
      document.body.style.overflow = "";
    }, 850);
  }, []);

  useEffect(() => {
    // Quem já viu a abertura nesta sessão: o CSS (html.intro-vista) já a esconde.
    if (document.documentElement.classList.contains("intro-vista")) return;
    document.body.style.overflow = "hidden";
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(encerrar, reduzido ? 900 : DURACAO);
    const tecla = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Enter") && encerrar();
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("keydown", tecla);
      if (timer.current) clearTimeout(timer.current);
      document.body.style.overflow = "";
    };
  }, [encerrar]);

  if (fim) return null;

  return (
    <div className={`splash ${saindo ? "saindo" : ""}`} role="presentation" onClick={encerrar}>
      <div className="bg-grid absolute inset-0 opacity-60" />
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        <line x1="0" y1="62%" x2="100%" y2="38%" stroke="#00B4B3" strokeWidth="1.2" className="pulso" />
        <line x1="0" y1="30%" x2="100%" y2="72%" stroke="#7fd6ef" strokeWidth="1" className="pulso" />
      </svg>

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* O símbolo entra girando no centro e desliza até o seu lugar na logo; o texto se revela ao lado */}
        <div className="relative aspect-[701/201] w-[min(86vw,560px)]">
          <img src={logoUrl || LOGO_PADRAO} alt="ERCA LOC" width={701} height={201} className="splash-logo absolute inset-0 h-full w-full" />
          <LogoSymbol animated className="splash-simbolo absolute left-[37.6%] top-0 h-full w-auto drop-shadow-[0_0_36px_rgba(46,196,230,0.45)]" />
        </div>
        <div className="splash-tag mt-4 font-display text-xs font-semibold uppercase text-sky sm:text-sm">
          Locação de tecnologia
        </div>
        <div className="mt-10 h-[2px] w-48 overflow-hidden rounded bg-white/10">
          <div className="splash-barra h-full w-full bg-gradient-to-r from-[#F7A21B] via-[#9BCB3C] to-[#3FD0EE]" />
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          encerrar();
        }}
        className="splash-pular absolute bottom-8 right-8 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-turquoise hover:text-white"
      >
        Pular abertura
      </button>
    </div>
  );
}

/** Script que roda antes da pintura: evita "piscar" a abertura para quem já viu. */
export const introScript = `try{if(sessionStorage.getItem("${CHAVE}"))document.documentElement.classList.add("intro-vista")}catch(e){}`;

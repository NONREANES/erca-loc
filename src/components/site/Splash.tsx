"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LogoSymbol } from "../Logo";

const CHAVE = "erca_intro_vista";
const DURACAO = 2900; // tempo total da abertura antes de revelar o site

/**
 * Abertura animada: desenha o símbolo, mostra ERCA LOC e a assinatura,
 * e então "sobe" revelando o site. Aparece uma vez por sessão do navegador.
 */
export function Splash() {
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
        <LogoSymbol animated className="h-28 w-28 drop-shadow-[0_0_40px_rgba(0,180,179,0.35)] sm:h-36 sm:w-36" />
        <div className="splash-texto mt-6 font-display text-5xl font-extrabold italic tracking-wide sm:text-7xl">
          <span className="text-white">ERCA</span> <span className="text-turquoise">LOC</span>
        </div>
        <div className="splash-tag mt-4 font-display text-xs font-semibold uppercase text-sky sm:text-sm">
          Locação de tecnologia
        </div>
        <div className="mt-10 h-[2px] w-48 overflow-hidden rounded bg-white/10">
          <div className="splash-barra h-full w-full bg-gradient-to-r from-sky to-turquoise" />
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

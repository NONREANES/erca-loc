"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { LogoSymbol, SIMBOLO_PADRAO } from "../Logo";
import { IconCheck, IconShield, IconTool } from "../icons";

type Banner = { id: string; title: string; subtitle: string; imageUrl: string };

/**
 * Cena interativa do topo: monitor, notebook e celular flutuando, sem fundo.
 * - Os aparelhos acompanham o movimento do mouse (efeito de profundidade).
 * - A tela do monitor mostra os banners cadastrados no painel.
 * - O notebook mostra o inventário; o celular, uma conversa de WhatsApp.
 */
export function HeroScene({ banners, preco, slogan }: { banners: Banner[]; preco: string; slogan: string }) {
  const cena = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cena.current;
    if (!el) return;

    // Fora da tela: pausa as animações da cena
    const visivel = new IntersectionObserver(([e]) => el.classList.toggle("pausada", !e.isIntersecting), { threshold: 0 });
    visivel.observe(el);

    // Efeito de profundidade só em computador (mouse). No celular não há o que seguir.
    const comMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!comMouse || reduzido) return () => visivel.disconnect();

    let raf = 0;
    const alvo = { x: 0, y: 0 };
    const atual = { x: 0, y: 0 };
    const passo = () => {
      atual.x += (alvo.x - atual.x) * 0.08;
      atual.y += (alvo.y - atual.y) * 0.08;
      el.style.setProperty("--mx", atual.x.toFixed(3));
      el.style.setProperty("--my", atual.y.toFixed(3));
      // Chegou ao destino: para de calcular até o mouse mexer de novo
      if (Math.abs(alvo.x - atual.x) < 0.002 && Math.abs(alvo.y - atual.y) < 0.002) raf = 0;
      else raf = requestAnimationFrame(passo);
    };
    const iniciar = () => {
      if (!raf) raf = requestAnimationFrame(passo);
    };
    const mover = (e: PointerEvent) => {
      if (el.classList.contains("pausada")) return;
      const r = el.getBoundingClientRect();
      alvo.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      alvo.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      iniciar();
    };
    const sair = () => {
      alvo.x = 0;
      alvo.y = 0;
      iniciar();
    };
    window.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerleave", sair);
    return () => {
      visivel.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerleave", sair);
    };
  }, []);

  return (
    <div ref={cena} className="cena relative mx-auto aspect-[1/0.9] w-full max-w-[680px] select-none" aria-hidden="true">
      {/* brilhos de fundo */}
      <div className="absolute left-[2%] top-[0%] h-[70%] w-[76%] bg-[radial-gradient(closest-side,rgba(46,196,230,0.22),transparent)]" />
      <div className="absolute bottom-[0%] right-[0%] h-[55%] w-[60%] bg-[radial-gradient(closest-side,rgba(247,162,27,0.12),transparent)]" />

      {/* MONITOR (fundo) */}
      <Camada profundidade={10} className="left-0 top-[5%] w-[76%]" atraso="0s">
        <Monitor banners={banners} slogan={slogan} />
      </Camada>

      {/* NOTEBOOK (meio) */}
      <Camada profundidade={22} className="right-[-3%] top-[41%] w-[68%]" atraso="-2.2s">
        <Notebook />
      </Camada>

      {/* CELULAR (frente) */}
      <Camada profundidade={38} className="left-[1%] top-[33%] w-[27%]" atraso="-4.4s">
        <Celular preco={preco} />
      </Camada>

      {/* selos flutuantes */}
      <Camada profundidade={48} className="right-[0%] top-[1%]" atraso="-1s">
        <Selo icone={<IconCheck className="h-3.5 w-3.5" />} cor="bg-emerald-500">
          Entregue e configurado
        </Selo>
      </Camada>
      <Camada profundidade={52} className="bottom-[-1%] left-[2%]" atraso="-3s">
        <Selo icone={<IconTool className="h-3.5 w-3.5" />} cor="bg-[#1E5FD8]">
          Suporte técnico incluso
        </Selo>
      </Camada>
      {preco && (
        <Camada profundidade={44} className="right-[-2%] top-[23%] hidden sm:block" atraso="-5s">
          <div className="rounded-2xl border border-white/15 bg-white/95 px-3.5 py-2 text-left shadow-2xl shadow-navy-900/40">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate">Notebook Dell i5</p>
            <p className="font-display text-sm font-extrabold text-navy">
              a partir de <span className="text-turquoise-600">{preco}</span>
              <span className="text-xs font-semibold text-slate">/mês</span>
            </p>
          </div>
        </Camada>
      )}
      <Camada profundidade={30} className="bottom-[-3%] right-[6%] hidden sm:block" atraso="-2s">
        <Selo icone={<IconShield className="h-3.5 w-3.5" />} cor="bg-[#F07B1E]">
          Inventário controlado
        </Selo>
      </Camada>
    </div>
  );
}

/** Uma camada da cena: se desloca com o mouse (profundidade) e flutua sozinha. */
function Camada({ profundidade, className, atraso, children }: { profundidade: number; className: string; atraso: string; children: ReactNode }) {
  return (
    <div className={`camada absolute ${className}`} style={{ "--d": profundidade } as CSSProperties}>
      <div className="flutuar" style={{ animationDelay: atraso }}>
        {children}
      </div>
    </div>
  );
}

function Selo({ icone, cor, children }: { icone: ReactNode; cor: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/95 py-1.5 pl-1.5 pr-3.5 text-[11px] font-semibold text-navy shadow-2xl shadow-navy-900/40 sm:text-xs">
      <span className={`grid h-6 w-6 place-items-center rounded-full text-white ${cor}`}>{icone}</span>
      {children}
    </span>
  );
}

/* ---------------- MONITOR ---------------- */
function Monitor({ banners, slogan }: { banners: Banner[]; slogan: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, [banners.length]);

  return (
    <div className="relative">
      <div className="rounded-[10px] bg-gradient-to-b from-[#2b313a] to-[#14181e] p-[1.6%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <div className="relative aspect-video overflow-hidden rounded-[4px] bg-navy-900">
          {/* papel de parede da marca (aparece quando não há banners) */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_10%,#1E5FD8_0%,#0B2340_45%,#071830_100%)]">
            <div className="bg-grid absolute inset-0 opacity-60" />
            <div className="absolute inset-0 flex items-center justify-end gap-[4%] pl-[30%] pr-[7%]">
              <img src={SIMBOLO_PADRAO} alt="" className="w-[22%] drop-shadow-[0_0_24px_rgba(46,196,230,0.45)]" />
              <p className="font-display text-[clamp(9px,1.9vw,17px)] font-bold leading-tight text-white/90 [text-wrap:balance]">{slogan}</p>
            </div>
          </div>
          {banners.map((b, k) => (
            <img
              key={b.id}
              src={b.imageUrl}
              alt=""
              className={`absolute inset-0 h-full w-full bg-white object-cover transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        </div>
        <div className="mx-auto mt-[0.8%] h-[3px] w-[6%] rounded-full bg-white/15" />
      </div>
      {/* pé */}
      <div className="mx-auto h-8 w-[9%] bg-gradient-to-r from-[#9aa3ad] via-[#e3e7eb] to-[#8a939d] sm:h-12" />
      <div className="mx-auto h-[10px] w-[34%] rounded-[50%] bg-gradient-to-b from-[#dfe3e7] to-[#9aa3ad] shadow-[0_10px_20px_rgba(0,0,0,0.35)]" />
    </div>
  );
}

/* ---------------- NOTEBOOK ---------------- */
const LINHAS = [
  { eq: "Notebook Dell i5", quem: "Ana · Financeiro", st: "Em uso", cor: "bg-emerald-400" },
  { eq: 'Monitor 24"', quem: "Carlos · Comercial", st: "Em uso", cor: "bg-emerald-400" },
  { eq: "Celular", quem: "Equipe externa", st: "Em uso", cor: "bg-emerald-400" },
  { eq: "Notebook Dell i5", quem: "Estoque", st: "Disponível", cor: "bg-sky" },
  { eq: "Impressora", quem: "Recepção", st: "Suporte", cor: "bg-[#F7A21B]" },
];

function Notebook() {
  return (
    <div className="relative">
      {/* tela */}
      <div className="mx-auto w-[86%] rounded-t-[12px] bg-gradient-to-b from-[#2a3038] to-[#111419] p-[2%] pb-[2.4%] ring-1 ring-white/10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-[#f4f7fb] [container-type:inline-size]">
          {/* barra superior */}
          <div className="flex items-center gap-[2cqw] bg-navy px-[3cqw] py-[1.8cqw]">
            <LogoSymbol className="h-[4.2cqw] w-[4.2cqw]" />
            <span className="font-display text-[3cqw] font-bold text-white">Inventário</span>
            <span className="ml-auto rounded-full bg-white/10 px-[2cqw] py-[0.6cqw] text-[2.2cqw] text-white/80">Sua empresa</span>
          </div>
          {/* indicadores */}
          <div className="grid grid-cols-3 gap-[2cqw] px-[3cqw] pt-[2.6cqw]">
            {[
              ["32", "equipamentos"],
              ["29", "em uso"],
              ["100%", "identificados"],
            ].map(([n, t]) => (
              <div key={t} className="rounded-[1.4cqw] bg-white px-[2cqw] py-[1.6cqw] shadow-sm ring-1 ring-navy/5">
                <p className="font-display text-[4.2cqw] font-extrabold leading-none text-navy">{n}</p>
                <p className="mt-[0.6cqw] text-[2.1cqw] text-slate">{t}</p>
              </div>
            ))}
          </div>
          {/* tabela */}
          <div className="mx-[3cqw] mt-[2.4cqw] overflow-hidden rounded-[1.4cqw] bg-white ring-1 ring-navy/5">
            {LINHAS.map((l, k) => (
              <div key={k} className="linha-inv flex items-center gap-[2cqw] border-b border-navy/5 px-[2.4cqw] py-[1.25cqw] text-[2.2cqw] last:border-0" style={{ animationDelay: `${0.6 + k * 0.25}s` }}>
                <span className="w-[32%] truncate font-semibold text-navy">{l.eq}</span>
                <span className="flex-1 truncate text-slate">{l.quem}</span>
                <span className="flex items-center gap-[1cqw] font-semibold text-navy">
                  <i className={`h-[1.4cqw] w-[1.4cqw] rounded-full ${l.cor}`} />
                  {l.st}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        </div>
      </div>
      {/* base */}
      <div className="relative mx-auto h-[14px] w-full rounded-b-[14px] rounded-t-[3px] bg-gradient-to-b from-[#e6e9ed] via-[#c3c9d0] to-[#8b939c] shadow-[0_24px_40px_-12px_rgba(0,0,0,0.55)] sm:h-[18px]">
        <div className="absolute left-1/2 top-0 h-[38%] w-[16%] -translate-x-1/2 rounded-b-[8px] bg-[#a9b0b8]" />
      </div>
    </div>
  );
}

/* ---------------- CELULAR (conversa de WhatsApp) ---------------- */
function Celular({ preco }: { preco: string }) {
  const [ciclo, setCiclo] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setCiclo((c) => c + 1), 11000);
    return () => clearInterval(t);
  }, []);
  const msgs: { de: "cliente" | "erca"; txt: string }[] = [
    { de: "cliente", txt: "Olá! Preciso de 10 notebooks para a equipe." },
    { de: "erca", txt: preco ? `Temos Dell Core i5 a partir de ${preco}/mês 💻` : "Temos notebooks Dell Core i5 para locação 💻" },
    { de: "cliente", txt: "Vocês entregam configurado?" },
    { de: "erca", txt: "Sim! Prontos para uso e com suporte ✅" },
  ];
  return (
    <div className="rounded-[18%/8.5%] bg-gradient-to-b from-[#3a414b] to-[#15191f] p-[5%] shadow-[0_30px_50px_-15px_rgba(0,0,0,0.65)] ring-1 ring-white/15">
      <div className="relative aspect-[9/19] overflow-hidden rounded-[14%/6.6%] bg-[#efe7dd] [container-type:inline-size]">
        <div className="absolute left-1/2 top-[1.6%] z-10 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
        <div className="flex items-center gap-[4cqw] bg-[#075E54] px-[5cqw] pb-[3cqw] pt-[12cqw]">
          <img src={SIMBOLO_PADRAO} alt="" className="h-[11cqw] w-[11cqw] rounded-full bg-navy p-[1.5cqw]" />
          <div className="leading-tight">
            <p className="text-[6cqw] font-bold text-white">ERCA LOC</p>
            <p className="text-[4.4cqw] text-white/75">online</p>
          </div>
        </div>
        <div key={ciclo} className="space-y-[3.5cqw] px-[4cqw] pt-[5cqw]">
          {msgs.map((m, k) => (
            <p
              key={k}
              className={`msg-zap max-w-[86%] rounded-[3.5cqw] px-[3.5cqw] py-[2.4cqw] text-[5cqw] leading-snug text-[#111] shadow-sm ${
                m.de === "cliente" ? "ml-auto rounded-tr-none bg-[#d9fdd3]" : "rounded-tl-none bg-white"
              }`}
              style={{ animationDelay: `${0.8 + k * 1.6}s` }}
            >
              {m.txt}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

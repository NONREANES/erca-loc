"use client";

import { useEffect, useState } from "react";
import { Logo } from "../Logo";
import { IconClose, IconMenu, IconWhatsApp } from "../icons";

const LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#quem-somos", label: "Quem somos" },
  { href: "#equipamentos", label: "Equipamentos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#inventario", label: "Inventário" },
  { href: "#suporte", label: "Suporte" },
  { href: "#contato", label: "Contato" },
];

export function Header({ whatsapp, logoUrl, cta }: { whatsapp: string; logoUrl?: string; cta: string }) {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState("#inicio");

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setAtivo("#" + e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        rolou || aberto ? "bg-navy/95 shadow-lg shadow-navy-900/20 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <a href="#inicio" onClick={() => setAberto(false)} aria-label="ERCA LOC — início">
          <Logo src={logoUrl || undefined} className="h-9 w-auto sm:h-10" />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-3 py-2 text-sm font-medium transition xl:px-3.5 ${
                ativo === l.href ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {l.label}
              <span
                className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded bg-turquoise transition-transform duration-300 ${
                  ativo === l.href ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsapp}
            target={whatsapp.startsWith("http") ? "_blank" : undefined}
            rel="noopener"
            className="hidden items-center gap-2 rounded-full bg-turquoise px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-turquoise/25 transition hover:bg-turquoise-600 sm:inline-flex"
          >
            <IconWhatsApp className="h-4 w-4" /> {cta}
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-white hover:bg-white/10 lg:hidden"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="border-t border-white/10 px-5 pb-6 pt-2 lg:hidden" aria-label="Menu móvel">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="block border-b border-white/5 py-3.5 text-base font-medium text-white/85"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsapp}
            target={whatsapp.startsWith("http") ? "_blank" : undefined}
            rel="noopener"
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-turquoise py-3.5 font-semibold text-white"
          >
            <IconWhatsApp className="h-5 w-5" /> {cta}
          </a>
        </nav>
      )}
    </header>
  );
}

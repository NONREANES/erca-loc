/* eslint-disable @next/next/no-img-element */
import { useId } from "react";

/** Arquivos oficiais da marca (fundo transparente, para fundos escuros). */
export const LOGO_PADRAO = "/brand/logo-ercaloc.webp";
export const SIMBOLO_PADRAO = "/brand/simbolo.png";

type Props = {
  /** "full" = símbolo + ERCA LOC ; "symbol" = só o hexágono */
  variant?: "full" | "symbol";
  className?: string;
  /** Imagem enviada pelo painel (substitui a logo padrão) */
  src?: string;
  title?: string;
};

export const SYMBOL_PATHS = {
  outerA: "M74 22 L50 8 L13 29 L13 71 L26 78.5",
  outerB: "M26 78 L50 92 L87 71 L87 29 L80 25",
  inner: "M70 36 L50 25 L31 36 L31 50 L50 50 L69 50 L69 64 L50 75 L36 67",
};

/**
 * Símbolo vetorial nas cores da logo (laranja → verde / azul → ciano).
 * Usado na animação de abertura e em marcas-d'água decorativas.
 */
export function LogoSymbol({ className, animated = false }: { className?: string; animated?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#E8452C" />
          <stop offset=".45" stopColor="#F7A21B" />
          <stop offset="1" stopColor="#9BCB3C" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1E5FD8" />
          <stop offset="1" stopColor="#3FD0EE" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A7DE1" />
          <stop offset="1" stopColor="#57D6F2" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinejoin="round" strokeWidth="11" className={animated ? "logo-draw" : undefined}>
        <path d={SYMBOL_PATHS.outerA} stroke={`url(#${id}a)`} pathLength={1} />
        <path d={SYMBOL_PATHS.outerB} stroke={`url(#${id}b)`} pathLength={1} />
        <path d={SYMBOL_PATHS.inner} stroke={`url(#${id}c)`} pathLength={1} />
      </g>
    </svg>
  );
}

export function Logo({ variant = "full", className, src, title = "ERCA LOC" }: Props) {
  if (variant === "symbol") {
    return <img src={src || SIMBOLO_PADRAO} alt={title} className={className} style={{ objectFit: "contain" }} />;
  }
  return (
    <img
      src={src || LOGO_PADRAO}
      alt={title}
      width={701}
      height={201}
      className={className ?? "h-9 w-auto"}
      style={{ objectFit: "contain" }}
    />
  );
}

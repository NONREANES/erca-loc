/* eslint-disable @next/next/no-img-element */
import { useId } from "react";

type Props = {
  /** "full" = símbolo + ERCA LOC ; "symbol" = só o hexágono */
  variant?: "full" | "symbol";
  /** Cor do texto ERCA (branco em fundo escuro, azul-marinho em fundo claro) */
  tone?: "light" | "dark";
  className?: string;
  /** Imagem enviada pelo painel (substitui o desenho) */
  src?: string;
  title?: string;
};

export const SYMBOL_PATHS = {
  outerA: "M74 22 L50 8 L13 29 L13 71 L26 78.5",
  outerB: "M26 78 L50 92 L87 71 L87 29 L80 25",
  inner: "M70 36 L50 25 L31 36 L31 50 L50 50 L69 50 L69 64 L50 75 L36 67",
};

export function LogoSymbol({ className, animated = false }: { className?: string; animated?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9e2f7" />
          <stop offset=".55" stopColor="#5cc6e6" />
          <stop offset="1" stopColor="#00B4B3" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#00B4B3" />
          <stop offset="1" stopColor="#7fd6ef" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinejoin="miter" strokeWidth="11" className={animated ? "logo-draw" : undefined}>
        <path d={SYMBOL_PATHS.outerA} stroke={`url(#${id}a)`} pathLength={1} />
        <path d={SYMBOL_PATHS.outerB} stroke={`url(#${id}a)`} opacity=".85" pathLength={1} />
        <path d={SYMBOL_PATHS.inner} stroke={`url(#${id}b)`} pathLength={1} />
      </g>
    </svg>
  );
}

export function Logo({ variant = "full", tone = "light", className, src, title = "ERCA LOC" }: Props) {
  if (src) return <img src={src} alt={title} className={className} style={{ objectFit: "contain" }} />;
  if (variant === "symbol") return <LogoSymbol className={className} />;
  return (
    <span className={`inline-flex items-center gap-[0.35em] ${className ?? ""}`} role="img" aria-label={title}>
      <LogoSymbol className="h-[1.6em] w-[1.6em] shrink-0" />
      <span className="font-display text-[1em] font-extrabold italic leading-none tracking-wide">
        <span className={tone === "light" ? "text-white" : "text-navy"}>ERCA</span>{" "}
        <span className="text-turquoise">LOC</span>
      </span>
    </span>
  );
}

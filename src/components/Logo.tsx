/* eslint-disable @next/next/no-img-element */
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

/**
 * Símbolo oficial (o hexágono da logo), a partir do arquivo da marca.
 * Usado na abertura, no painel e como marca-d'água.
 */
export function LogoSymbol({ className, animated = false, src }: { className?: string; animated?: boolean; src?: string }) {
  return (
    <img
      src={src || SIMBOLO_PADRAO}
      alt=""
      aria-hidden="true"
      width={174}
      height={201}
      className={`${animated ? "simbolo-entrada " : ""}object-contain ${className ?? ""}`}
    />
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

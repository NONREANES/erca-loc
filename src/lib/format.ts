/** Utilidades sem dependência de servidor (podem ser usadas no navegador). */

export function formatBRL(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "249,90" | "249.90" | "R$ 1.249,90" → 24990 ; vazio → null */
export function parseBRL(input: string | null | undefined): number | null {
  const s = String(input ?? "").replace(/[^\d,.-]/g, "").trim();
  if (!s) return null;
  const normalizado = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normalizado);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

/** Monta o link do WhatsApp. Sem número configurado, cai na seção de contato. */
export function whatsappLink(numero: string, mensagem: string): string {
  const n = onlyDigits(numero || "");
  if (n.length < 10) return "#contato";
  return `https://wa.me/${n}?text=${encodeURIComponent(mensagem)}`;
}

export function fillTemplate(tpl: string, vars: Record<string, string>) {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");
}

export function paragraphs(texto: string): string[] {
  return String(texto || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export function lines(texto: string): string[] {
  return String(texto || "").split(/\r?\n/).map((p) => p.trim()).filter(Boolean);
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Reconhece links do YouTube e do Vimeo. */
export function parseVideo(url: string): { provider: "youtube" | "vimeo"; id: string; embed: string; thumb?: string } | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") id = u.searchParams.get("v") ?? "";
      else {
        const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
        if (m) id = m[1];
      }
    }
    if (id && /^[\w-]{6,20}$/.test(id)) {
      return {
        provider: "youtube",
        id,
        embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const m = u.pathname.match(/(\d{6,})/);
      if (m) return { provider: "vimeo", id: m[1], embed: `https://player.vimeo.com/video/${m[1]}?autoplay=1&dnt=1` };
    }
  } catch {
    /* link inválido */
  }
  return null;
}

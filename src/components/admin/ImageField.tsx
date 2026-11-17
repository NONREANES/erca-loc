"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";

type Item = { id: string; url: string; filename?: string | null };

/**
 * Campo de imagem: enviar do computador, escolher da biblioteca ou remover.
 * Guarda a URL num <input hidden name={name}> para o formulário.
 */
export function ImageField({ name, defaultValue = "", label = "Imagem", help }: { name: string; defaultValue?: string; label?: string; help?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [biblioteca, setBiblioteca] = useState<Item[] | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function enviar(file: File) {
    setErro(null);
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append("arquivo", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.erro || "Falha no envio.");
      setUrl(j.url);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha no envio.");
    } finally {
      setEnviando(false);
      if (input.current) input.current.value = "";
    }
  }

  async function abrirBiblioteca() {
    setErro(null);
    const r = await fetch("/api/admin/media", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setErro(j.erro || "Não foi possível abrir a biblioteca.");
    setBiblioteca(j.itens);
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-navy">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-28 w-36 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-navy/20 bg-mist/50">
          {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-slate">Sem imagem</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-turquoise px-4 py-2 text-sm font-semibold text-white transition hover:bg-turquoise-600">
            {enviando ? "Enviando…" : url ? "Trocar imagem" : "Enviar imagem"}
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="sr-only"
              disabled={enviando}
              onChange={(e) => e.target.files?.[0] && enviar(e.target.files[0])}
            />
          </label>
          <button type="button" onClick={abrirBiblioteca} className="rounded-xl border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-turquoise">
            Escolher da biblioteca
          </button>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="text-left text-xs font-semibold text-red-600 hover:underline">
              Remover imagem
            </button>
          )}
        </div>
      </div>
      {help && <p className="text-xs text-slate">{help}</p>}
      {erro && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {erro}
        </p>
      )}

      {biblioteca && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-900/60 p-4" onClick={() => setBiblioteca(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Biblioteca de imagens"
            className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
              <h3 className="font-display text-lg font-bold text-navy">Biblioteca de imagens</h3>
              <button type="button" onClick={() => setBiblioteca(null)} className="rounded-lg px-3 py-1 text-sm font-semibold text-slate hover:bg-mist">
                Fechar
              </button>
            </div>
            <div className="grid max-h-[65vh] grid-cols-2 gap-3 overflow-y-auto p-5 sm:grid-cols-4">
              {biblioteca.length === 0 && <p className="col-span-full text-sm text-slate">Nenhuma imagem enviada ainda.</p>}
              {biblioteca.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setUrl(m.url);
                    setBiblioteca(null);
                  }}
                  className={`group overflow-hidden rounded-xl border-2 text-left transition ${m.url === url ? "border-turquoise" : "border-transparent hover:border-sky"}`}
                >
                  <img src={m.url} alt="" className="aspect-[4/3] w-full bg-mist object-cover" loading="lazy" />
                  <span className="block truncate px-2 py-1.5 text-xs text-slate">{m.filename}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

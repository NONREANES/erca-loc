"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Envio de várias imagens de uma vez para a biblioteca. */
export function UploadBox({ limiteMb }: { limiteMb: number }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);

  async function enviar(files: FileList | File[]) {
    const lista = Array.from(files);
    if (!lista.length) return;
    setErro(null);
    let ok = 0;
    const falhas: string[] = [];
    for (const [i, f] of lista.entries()) {
      setStatus(`Enviando ${i + 1} de ${lista.length}…`);
      const fd = new FormData();
      fd.append("arquivo", f);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (r.ok) ok++;
      else falhas.push(`${f.name}: ${(await r.json().catch(() => ({}))).erro ?? "erro"}`);
    }
    setStatus(ok ? `${ok} imagem(ns) enviada(s).` : null);
    if (falhas.length) setErro(falhas.join(" · "));
    router.refresh();
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          enviar(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          arrastando ? "border-turquoise bg-turquoise/5" : "border-navy/15 bg-white hover:border-turquoise"
        }`}
      >
        <span className="font-semibold text-navy">Arraste imagens aqui ou clique para escolher</span>
        <span className="mt-1 text-sm text-slate">JPG, PNG, WEBP, GIF ou AVIF · até {limiteMb} MB cada</span>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="sr-only" onChange={(e) => e.target.files && enviar(e.target.files)} />
      </label>
      {status && <p className="mt-3 text-sm font-medium text-emerald-700">{status}</p>}
      {erro && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{erro}</p>}
    </div>
  );
}

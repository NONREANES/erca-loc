/* eslint-disable @next/next/no-img-element */
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { LIMITE_BYTES, usaCloudinary } from "@/lib/media";
import { excluirImagem } from "../../actions";
import { ActionButton } from "@/components/admin/ui";
import { UploadBox } from "@/components/admin/UploadBox";

export default async function ImagensPage() {
  await requireAdmin();
  const itens = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, filename: true, width: true, height: true, size: true, storage: true },
  });
  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl font-extrabold text-navy">Biblioteca de imagens</h1>
      <p className="mt-1 text-slate">
        Imagens enviadas ficam disponíveis para equipamentos, banners e logo.{" "}
        {usaCloudinary() ? "Armazenamento: Cloudinary." : "Armazenamento: banco de dados (configure o Cloudinary para melhor desempenho)."}
      </p>
      <div className="mt-6">
        <UploadBox limiteMb={Math.round(LIMITE_BYTES / 1024 / 1024)} />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {itens.map((m) => (
          <figure key={m.id} className="overflow-hidden rounded-2xl border border-navy/8 bg-white">
            <img src={m.url} alt="" className="aspect-[4/3] w-full bg-mist object-cover" loading="lazy" />
            <figcaption className="space-y-2 p-3">
              <p className="truncate text-xs font-semibold text-navy" title={m.filename}>{m.filename || "imagem"}</p>
              <p className="text-[11px] text-slate">
                {m.width && m.height ? `${m.width}×${m.height} · ` : ""}
                {(m.size / 1024).toFixed(0)} KB
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <ActionButton action={excluirImagem.bind(null, m.id)} confirmar="Excluir esta imagem da biblioteca?" className="text-red-600 hover:border-red-300">
                  Excluir
                </ActionButton>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {itens.length === 0 && <p className="mt-8 text-center text-slate">Nenhuma imagem enviada ainda.</p>}
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

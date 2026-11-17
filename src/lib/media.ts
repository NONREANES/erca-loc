import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { db } from "./db";

/**
 * Armazenamento de imagens:
 * - Com CLOUDINARY_URL definida → arquivos vão para o Cloudinary (recomendado em produção).
 * - Sem Cloudinary → arquivos ficam guardados no próprio PostgreSQL (persistente, sem depender do disco do servidor).
 */

const MAX_MB = Number(process.env.MAX_UPLOAD_MB || 5);
export const LIMITE_BYTES = MAX_MB * 1024 * 1024;

export const usaCloudinary = () => Boolean(process.env.CLOUDINARY_URL);

const TIPOS: { mime: string; test: (b: Uint8Array) => boolean }[] = [
  { mime: "image/jpeg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { mime: "image/gif", test: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 },
  {
    mime: "image/webp",
    test: (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP",
  },
  { mime: "image/avif", test: (b) => String.fromCharCode(...b.slice(4, 12)) === "ftypavif" },
];

/** Confere o tipo real pelo conteúdo do arquivo (não confia na extensão). */
export function detectarTipo(bytes: Uint8Array): string | null {
  return TIPOS.find((t) => t.test(bytes))?.mime ?? null;
}

function dimensoes(bytes: Uint8Array, mime: string): { width?: number; height?: number } {
  try {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (mime === "image/png") return { width: dv.getUint32(16), height: dv.getUint32(20) };
    if (mime === "image/gif") return { width: dv.getUint16(6, true), height: dv.getUint16(8, true) };
    if (mime === "image/jpeg") {
      let i = 2;
      while (i < bytes.length) {
        if (bytes[i] !== 0xff) break;
        const marker = bytes[i + 1];
        const len = dv.getUint16(i + 2);
        if (marker >= 0xc0 && marker <= 0xc3) return { height: dv.getUint16(i + 5), width: dv.getUint16(i + 7) };
        i += 2 + len;
      }
    }
  } catch {
    /* sem dimensões */
  }
  return {};
}

export async function salvarUpload(file: File) {
  if (file.size === 0) throw new Error("Arquivo vazio.");
  if (file.size > LIMITE_BYTES) throw new Error(`A imagem passa de ${MAX_MB} MB. Reduza o tamanho e tente de novo.`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = detectarTipo(bytes);
  if (!mime) throw new Error("Formato não aceito. Envie JPG, PNG, WEBP, GIF ou AVIF.");
  const filename = (file.name || "imagem").replace(/[^\w.\- ]+/g, "").slice(0, 120);

  if (usaCloudinary()) {
    cloudinary.config({ secure: true });
    const r = await new Promise<{ secure_url: string; public_id: string; width: number; height: number; bytes: number }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: process.env.CLOUDINARY_FOLDER || "erca-loc", resource_type: "image" },
          (err, res) => (err || !res ? reject(err ?? new Error("Falha no envio para o Cloudinary.")) : resolve(res)),
        );
        stream.end(Buffer.from(bytes));
      },
    );
    return db.media.create({
      data: {
        url: r.secure_url,
        storage: "cloudinary",
        publicId: r.public_id,
        filename,
        mime,
        size: r.bytes,
        width: r.width,
        height: r.height,
      },
      select: { id: true, url: true },
    });
  }

  const { width, height } = dimensoes(bytes, mime);
  const criado = await db.media.create({
    data: { url: "pendente", storage: "database", filename, mime, size: bytes.byteLength, width, height, data: bytes },
    select: { id: true },
  });
  return db.media.update({ where: { id: criado.id }, data: { url: `/api/media/${criado.id}` }, select: { id: true, url: true } });
}

export async function removerMidia(id: string) {
  const m = await db.media.findUnique({ where: { id }, select: { storage: true, publicId: true } });
  if (!m) return;
  if (m.storage === "cloudinary" && m.publicId && usaCloudinary()) {
    cloudinary.config({ secure: true });
    await cloudinary.uploader.destroy(m.publicId).catch(() => null);
  }
  await db.media.delete({ where: { id } });
}

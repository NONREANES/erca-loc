import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/data";

export default async function PainelInicio() {
  const admin = await requireAdmin();
  const [s, equip, ativos, banners, videos, imagens] = await Promise.all([
    getSettings(),
    db.equipment.count(),
    db.equipment.count({ where: { active: true } }),
    db.banner.count({ where: { active: true } }),
    db.video.count({ where: { active: true } }),
    db.media.count(),
  ]);
  const semWhats = !s.whatsapp_number;

  const cards = [
    { href: "/admin/equipamentos", titulo: "Equipamentos", valor: `${ativos}/${equip}`, desc: "no site / cadastrados" },
    { href: "/admin/banners", titulo: "Banners", valor: banners, desc: "ativos no topo" },
    { href: "/admin/videos", titulo: "Vídeos", valor: videos, desc: "ativos" },
    { href: "/admin/imagens", titulo: "Imagens", valor: imagens, desc: "na biblioteca" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl font-extrabold text-navy">Olá, {admin.name.split(" ")[0]}!</h1>
      <p className="mt-1 text-slate">Tudo o que você alterar aqui aparece no site na mesma hora, sem precisar publicar de novo.</p>

      {semWhats && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <p className="font-semibold">Falta configurar o número do WhatsApp.</p>
          <p className="mt-1 text-sm">Enquanto isso, os botões do site levam para a seção de contato.</p>
          <Link href="/admin/textos#whatsapp" className="mt-3 inline-block rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
            Configurar WhatsApp
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-2xl border border-navy/8 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-sm font-semibold text-slate">{c.titulo}</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-navy">{c.valor}</p>
            <p className="text-xs text-slate">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-navy/8 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-navy">Atalhos</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/equipamentos/novo" className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-turquoise">+ Novo equipamento</Link>
          <Link href="/admin/textos" className="rounded-xl border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy hover:border-turquoise">Editar textos</Link>
          <Link href="/admin/banners" className="rounded-xl border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy hover:border-turquoise">Trocar banner</Link>
          <Link href="/admin/videos" className="rounded-xl border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy hover:border-turquoise">Adicionar vídeo</Link>
          <Link href="/admin/conta" className="rounded-xl border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy hover:border-turquoise">Trocar senha</Link>
        </div>
      </div>
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/admin/actions";
import { Logo } from "../Logo";
import { IconClose, IconMenu } from "../icons";

const ITENS = [
  { href: "/admin", label: "Início do painel" },
  { href: "/admin/equipamentos", label: "Equipamentos e preços" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/textos", label: "Textos, contato e WhatsApp" },
  { href: "/admin/banners", label: "Banners (tela do monitor)" },
  { href: "/admin/videos", label: "Vídeos" },
  { href: "/admin/imagens", label: "Biblioteca de imagens" },
  { href: "/admin/conta", label: "Minha conta e senha" },
];

export function Sidebar({ nome, email, cloudinary }: { nome: string; email: string; cloudinary: boolean }) {
  const path = usePathname();
  const [aberto, setAberto] = useState(false);
  const ativo = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  return (
    <aside className="bg-navy text-white lg:sticky lg:top-0 lg:h-screen">
      <div className="flex items-center justify-between px-5 py-5 lg:block">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Logo className="h-8 w-auto" />
        </Link>
        <button type="button" className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setAberto((v) => !v)} aria-label="Menu" aria-expanded={aberto}>
          {aberto ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      <div className={`${aberto ? "block" : "hidden"} border-t border-white/10 lg:flex lg:h-[calc(100vh-80px)] lg:flex-col lg:border-0`}>
        <nav className="space-y-1 px-3 py-3" aria-label="Painel">
          {ITENS.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setAberto(false)}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                ativo(i.href) ? "bg-turquoise text-white shadow-lg shadow-turquoise/20" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3 border-t border-white/10 px-5 py-5 text-sm">
          <a href="/" target="_blank" className="block font-semibold text-sky hover:text-white">
            Ver o site ↗
          </a>
          <div className="text-white/60">
            <p className="truncate font-semibold text-white/90">{nome}</p>
            <p className="truncate text-xs">{email}</p>
          </div>
          <p className="text-[11px] text-white/40">Imagens: {cloudinary ? "Cloudinary" : "banco de dados"}</p>
          <form action={logout}>
            <button type="submit" className="w-full rounded-xl border border-white/15 px-3 py-2 text-left font-semibold text-white/80 hover:border-red-300 hover:text-red-200">
              Sair
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

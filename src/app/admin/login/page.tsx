import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Entrar no painel", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-navy px-5 py-12">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -right-52 -top-52 h-[40rem] w-[40rem] bg-[radial-gradient(closest-side,rgba(0,180,179,0.16),transparent)]" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-14 w-auto" />
          <p className="mt-1 text-sm text-sky/80">Painel administrativo</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-navy-900/50">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          <Link href="/" className="hover:text-white">← Voltar para o site</Link>
        </p>
      </div>
    </main>
  );
}

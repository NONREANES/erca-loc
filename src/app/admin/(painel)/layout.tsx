import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { usaCloudinary } from "@/lib/media";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata: Metadata = { title: "Painel", robots: { index: false, follow: false } };

export default function PainelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-mist text-slate">Carregando painel…</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f3f6f9] lg:grid lg:grid-cols-[260px_1fr]">
      <Sidebar nome={admin.name} email={admin.email} cloudinary={usaCloudinary()} />
      <main className="min-w-0 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { EquipmentForm } from "@/components/admin/EquipmentForm";

export default async function NovoEquipamento() {
  await requireAdmin();
  const categorias = await db.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } });
  return (
    <div className="max-w-3xl">
      <Link href="/admin/equipamentos" className="text-sm font-semibold text-turquoise-600 hover:underline">← Equipamentos</Link>
      <h1 className="mb-6 mt-2 font-display text-3xl font-extrabold text-navy">Novo equipamento</h1>
      <EquipmentForm categorias={categorias} />
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

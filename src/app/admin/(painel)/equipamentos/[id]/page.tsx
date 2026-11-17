import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { EquipmentForm } from "@/components/admin/EquipmentForm";

export default async function EditarEquipamento({ params }: PageProps<"/admin/equipamentos/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [equip, categorias] = await Promise.all([
    db.equipment.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!equip) notFound();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/equipamentos" className="text-sm font-semibold text-turquoise-600 hover:underline">← Equipamentos</Link>
      <h1 className="mb-6 mt-2 font-display text-3xl font-extrabold text-navy">{equip.name}</h1>
      <EquipmentForm equip={equip} categorias={categorias} />
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

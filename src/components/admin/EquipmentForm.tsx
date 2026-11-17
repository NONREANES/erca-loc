import { salvarEquipamento, excluirEquipamento } from "@/app/admin/actions";
import { formatBRL } from "@/lib/format";
import { ActionButton, ActionForm, Field, Toggle, inputCls } from "./ui";
import { ImageField } from "./ImageField";

type Equip = {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceCents: number | null;
  pricePrefix: string;
  priceSuffix: string;
  priceNote: string;
  ctaLabel: string;
  whatsappMsg: string;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  categoryId: string | null;
};

export function EquipmentForm({ equip, categorias }: { equip?: Equip; categorias: { id: string; name: string }[] }) {
  const e = equip;
  return (
    <ActionForm
      action={salvarEquipamento}
      submitLabel={e ? "Salvar alterações" : "Criar equipamento"}
      footer={
        e ? (
          <ActionButton
            action={excluirEquipamento.bind(null, e.id)}
            confirmar={`Excluir “${e.name}”? Essa ação não pode ser desfeita.`}
            className="border-red-200 px-4 py-2.5 text-sm text-red-600 hover:border-red-400 hover:text-red-700"
          >
            Excluir equipamento
          </ActionButton>
        ) : null
      }
    >
      {e && <input type="hidden" name="id" value={e.id} />}

      <div className="rounded-2xl border border-navy/8 bg-white p-6 sm:p-8">
        <h2 className="mb-5 font-display text-lg font-bold text-navy">Informações</h2>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-[1fr_220px]">
            <Field label="Nome do equipamento" htmlFor="name">
              <input id="name" name="name" required maxLength={120} defaultValue={e?.name} className={inputCls} placeholder="Ex.: Notebook Dell Core i5" />
            </Field>
            <Field label="Categoria" htmlFor="categoryId">
              <select id="categoryId" name="categoryId" defaultValue={e?.categoryId ?? ""} className={inputCls}>
                <option value="">Sem categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Descrição curta" htmlFor="description">
            <textarea id="description" name="description" rows={3} maxLength={600} defaultValue={e?.description} className={inputCls} />
          </Field>
          <Field label="Destaques técnicos" help="Um por linha (até 8). Aparecem com ✓ no card." htmlFor="features">
            <textarea id="features" name="features" rows={4} defaultValue={e?.features.join("\n")} className={inputCls} />
          </Field>
          <ImageField name="imageUrl" label="Foto do equipamento" defaultValue={e?.imageUrl} help="Ideal: foto em formato 4:3 (ex.: 1200×900), fundo claro." />
        </div>
      </div>

      <div className="rounded-2xl border border-navy/8 bg-white p-6 sm:p-8">
        <h2 className="mb-1 font-display text-lg font-bold text-navy">Preço</h2>
        <p className="mb-5 text-sm text-slate">Deixe o valor vazio para mostrar “Sob consulta”.</p>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Texto antes do preço" htmlFor="pricePrefix">
            <input id="pricePrefix" name="pricePrefix" defaultValue={e?.pricePrefix ?? "A partir de"} className={inputCls} />
          </Field>
          <Field label="Valor (R$)" htmlFor="price">
            <input
              id="price"
              name="price"
              inputMode="decimal"
              defaultValue={e?.priceCents != null ? formatBRL(e.priceCents).replace(/^R\$\s?/, "") : ""}
              placeholder="249,90"
              className={inputCls}
            />
          </Field>
          <Field label="Texto depois do preço" htmlFor="priceSuffix">
            <input id="priceSuffix" name="priceSuffix" defaultValue={e?.priceSuffix ?? "/mês"} className={inputCls} />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Observação do preço" help="Ex.: Valor inicial. O preço varia conforme configuração e disponibilidade." htmlFor="priceNote">
            <input id="priceNote" name="priceNote" defaultValue={e?.priceNote} maxLength={300} className={inputCls} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-navy/8 bg-white p-6 sm:p-8">
        <h2 className="mb-5 font-display text-lg font-bold text-navy">Botão e WhatsApp</h2>
        <div className="space-y-5">
          <Field label="Texto do botão" htmlFor="ctaLabel">
            <input id="ctaLabel" name="ctaLabel" defaultValue={e?.ctaLabel ?? "Solicitar cotação"} maxLength={60} className={inputCls} />
          </Field>
          <Field
            label="Mensagem própria no WhatsApp (opcional)"
            help="Vazio = usa a mensagem padrão de equipamentos (definida em Textos → WhatsApp)."
            htmlFor="whatsappMsg"
          >
            <textarea id="whatsappMsg" name="whatsappMsg" rows={2} defaultValue={e?.whatsappMsg} className={inputCls} />
          </Field>
          <div className="flex flex-wrap gap-8 pt-1">
            <Toggle name="active" label="Mostrar no site" defaultChecked={e ? e.active : true} />
            <Toggle name="featured" label="Marcar como destaque" defaultChecked={e?.featured} />
          </div>
        </div>
      </div>
    </ActionForm>
  );
}

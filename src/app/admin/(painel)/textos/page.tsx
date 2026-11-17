import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { SETTING_GROUPS } from "@/lib/settings";
import { salvarTextos } from "../../actions";
import { ActionForm, Field, Toggle, inputCls } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";

export default async function TextosPage() {
  await requireAdmin();
  const s = await getSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-navy">Textos, contato e WhatsApp</h1>
      <p className="mt-1 text-slate">Cada bloco é salvo separadamente. As mudanças aparecem no site imediatamente.</p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Seções">
        {SETTING_GROUPS.map((g) => (
          <a key={g.id} href={`#${g.id}`} className="rounded-full border border-navy/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy hover:border-turquoise">
            {g.title}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {SETTING_GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-6 rounded-2xl border border-navy/8 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-navy">{g.title}</h2>
            {g.description && <p className="mt-1 text-sm text-slate">{g.description}</p>}
            <ActionForm action={salvarTextos} className="mt-6" submitLabel={`Salvar ${g.title.toLowerCase()}`}>
              <input type="hidden" name="_grupo" value={g.title} />
              {g.fields.map((c) => {
                const v = s[c.key] ?? "";
                if (c.type === "toggle")
                  return (
                    <div key={c.key} className="space-y-1">
                      <input type="hidden" name={`_toggle_${c.key}`} value="1" />
                      <Toggle name={c.key} label={c.label} defaultChecked={v === "1"} />
                      {c.help && <p className="pl-14 text-xs text-slate">{c.help}</p>}
                    </div>
                  );
                if (c.type === "image") return <ImageField key={c.key} name={c.key} label={c.label} defaultValue={v} help={c.help} />;
                const help = c.type === "lines" ? (c.help ?? "Um item por linha.") : c.help;
                return (
                  <Field key={c.key} label={c.label} help={help} htmlFor={c.key}>
                    {c.type === "textarea" || c.type === "lines" ? (
                      <textarea id={c.key} name={c.key} defaultValue={v} rows={c.type === "lines" ? 5 : 4} className={inputCls} />
                    ) : (
                      <input
                        id={c.key}
                        name={c.key}
                        defaultValue={v}
                        className={inputCls}
                        inputMode={c.key === "whatsapp_number" ? "numeric" : undefined}
                        placeholder={c.key === "whatsapp_number" ? "5511987654321" : undefined}
                      />
                    )}
                  </Field>
                );
              })}
            </ActionForm>
          </section>
        ))}
      </div>
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

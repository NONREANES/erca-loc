import { requireAdmin } from "@/lib/auth";
import { salvarPerfil, trocarSenha } from "../../actions";
import { ActionForm, Field, inputCls } from "@/components/admin/ui";

export default async function ContaPage() {
  const admin = await requireAdmin();
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-display text-3xl font-extrabold text-navy">Minha conta</h1>

      <section className="rounded-2xl border border-navy/8 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-navy">Dados de acesso</h2>
        <ActionForm action={salvarPerfil} className="mt-5">
          <Field label="Nome"><input name="nome" defaultValue={admin.name} maxLength={80} className={inputCls} /></Field>
          <Field label="E-mail de login"><input name="email" type="email" required defaultValue={admin.email} className={inputCls} /></Field>
        </ActionForm>
      </section>

      <section className="rounded-2xl border border-navy/8 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-navy">Trocar senha</h2>
        <p className="mt-1 text-sm text-slate">Mínimo de 10 caracteres. Ao trocar, outras sessões abertas são encerradas.</p>
        <ActionForm action={trocarSenha} submitLabel="Trocar senha" resetOnSuccess className="mt-5">
          <Field label="Senha atual"><input name="atual" type="password" autoComplete="current-password" required className={inputCls} /></Field>
          <Field label="Nova senha"><input name="nova" type="password" autoComplete="new-password" minLength={10} required className={inputCls} /></Field>
          <Field label="Confirme a nova senha"><input name="confirmacao" type="password" autoComplete="new-password" minLength={10} required className={inputCls} /></Field>
        </ActionForm>
      </section>
    </div>
  );
}

// Painel interno: pode aguardar o servidor (valida a sessão antes de mostrar a página)
export const instant = false;

"use client";

import { login } from "../actions";
import { Aviso, Field, SubmitButton, inputCls, useEnvio } from "@/components/admin/ui";

export function LoginForm() {
  const { estado, onSubmit, pending } = useEnvio(login);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h1 className="font-display text-2xl font-bold text-navy">Entrar</h1>
      <Field label="E-mail" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="username" required className={inputCls} />
      </Field>
      <Field label="Senha" htmlFor="senha">
        <input id="senha" name="senha" type="password" autoComplete="current-password" required className={inputCls} />
      </Field>
      <Aviso estado={estado} />
      <SubmitButton pending={pending} className="w-full py-3">Entrar no painel</SubmitButton>
    </form>
  );
}

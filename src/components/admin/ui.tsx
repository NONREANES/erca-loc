"use client";

import { startTransition, useActionState, useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import type { Estado } from "@/app/admin/actions";

/**
 * Envia o formulário sem o "reset automático" do React 19,
 * para que o que a pessoa digitou continue na tela se houver erro de validação.
 */
export function useEnvio(action: (s: Estado, f: FormData) => Promise<Estado>) {
  const [estado, dispatch, pending] = useActionState(action, undefined);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return { estado, onSubmit, pending };
}

export function SubmitButton({ children = "Salvar", className = "", pending = false }: { children?: ReactNode; className?: string; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-turquoise disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {pending ? "Salvando…" : children}
    </button>
  );
}

export function Aviso({ estado }: { estado: Estado }) {
  if (!estado?.erro && !estado?.msg) return null;
  return (
    <p
      role={estado.erro ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm font-medium ${
        estado.erro ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      }`}
    >
      {estado.erro ?? estado.msg}
    </p>
  );
}

/** Formulário ligado a uma Server Action, com mensagem de sucesso/erro. */
export function ActionForm({
  action,
  children,
  className = "",
  submitLabel = "Salvar",
  resetOnSuccess = false,
  footer,
}: {
  action: (s: Estado, f: FormData) => Promise<Estado>;
  children: ReactNode;
  className?: string;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  footer?: ReactNode;
}) {
  const { estado, onSubmit, pending } = useEnvio(action);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (estado?.ok && resetOnSuccess) ref.current?.reset();
  }, [estado, resetOnSuccess]);
  return (
    <form ref={ref} onSubmit={onSubmit} className={`space-y-5 ${className}`}>
      {children}
      <Aviso estado={estado} />
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
        {footer}
      </div>
    </form>
  );
}

export function Field({ label, help, children, htmlFor }: { label: string; help?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-navy">
        {label}
      </label>
      {children}
      {help && <p className="text-xs leading-relaxed text-slate">{help}</p>}
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-slate/60 focus:border-turquoise focus:ring-2 focus:ring-turquoise/20";

export function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-navy">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-navy/15 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-turquoise peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-turquoise/40" />
      {label}
    </label>
  );
}

/** Botão que chama uma ação do servidor (com confirmação opcional). */
export function ActionButton({
  action,
  children,
  confirmar,
  className = "",
  title,
}: {
  action: () => Promise<unknown>;
  children: ReactNode;
  confirmar?: string;
  className?: string;
  title?: string;
}) {
  const [pendente, start] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  return (
    <>
      <button
        type="button"
        title={title}
        aria-label={title}
        disabled={pendente}
        onClick={() => {
          if (confirmar && !window.confirm(confirmar)) return;
          setErro(null);
          start(async () => {
            const r = (await action()) as Estado | void;
            if (r && r.erro) setErro(r.erro);
          });
        }}
        className={`inline-flex items-center justify-center rounded-lg border border-navy/10 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy transition hover:border-turquoise hover:text-turquoise-600 disabled:opacity-50 ${className}`}
      >
        {pendente ? "…" : children}
      </button>
      {erro && (
        <span role="alert" className="text-xs font-medium text-red-600">
          {erro}
        </span>
      )}
    </>
  );
}

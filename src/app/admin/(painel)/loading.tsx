export default function Carregando() {
  return (
    <div className="max-w-4xl animate-pulse space-y-4" aria-busy="true" aria-label="Carregando">
      <div className="h-9 w-72 rounded-xl bg-navy/10" />
      <div className="h-4 w-96 max-w-full rounded bg-navy/5" />
      <div className="mt-8 h-32 rounded-2xl bg-white" />
      <div className="h-32 rounded-2xl bg-white" />
    </div>
  );
}

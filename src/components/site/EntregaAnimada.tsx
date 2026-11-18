/**
 * Ilustração animada da entrega: a caixa da ERCA LOC abre e o notebook sobe pronto para uso.
 * Feita em SVG + CSS (leve, nítida em qualquer tela e sem depender de vídeo).
 */
export function EntregaAnimada() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden="true">
      <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-[#2EC4E6]/25 via-[#1E5FD8]/10 to-[#F7A21B]/20 blur-2xl" />
      <div className="absolute inset-[6%] rounded-full border border-dashed border-navy/10" />

      <svg viewBox="0 0 400 400" className="relative h-full w-full">
        <defs>
          <linearGradient id="ea-frente" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#12325a" />
            <stop offset="1" stopColor="#0b2340" />
          </linearGradient>
          <linearGradient id="ea-tampa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b4373" />
            <stop offset="1" stopColor="#12325a" />
          </linearGradient>
          <linearGradient id="ea-tela" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1E5FD8" />
            <stop offset=".6" stopColor="#0b2340" />
            <stop offset="1" stopColor="#071830" />
          </linearGradient>
          <linearGradient id="ea-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6e9ed" />
            <stop offset="1" stopColor="#9aa3ad" />
          </linearGradient>
          <linearGradient id="ea-a" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#E8452C" />
            <stop offset=".5" stopColor="#F7A21B" />
            <stop offset="1" stopColor="#9BCB3C" />
          </linearGradient>
          <linearGradient id="ea-b" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#1E5FD8" />
            <stop offset="1" stopColor="#3FD0EE" />
          </linearGradient>
        </defs>

        {/* sombra no chão */}
        <ellipse cx="200" cy="332" rx="130" ry="14" fill="#0b2340" opacity=".12" />

        {/* fundo interno da caixa */}
        <path d="M95 200 L305 200 L290 215 L110 215 Z" fill="#071830" />

        {/* notebook subindo de dentro da caixa */}
        <g className="caixa-note">
          <rect x="128" y="88" width="144" height="94" rx="8" fill="#1a1f26" />
          <rect x="135" y="95" width="130" height="80" rx="3" fill="url(#ea-tela)" />
          <g transform="translate(183 112) scale(.34)" fill="none" strokeWidth="11" strokeLinejoin="round">
            <path d="M74 22 L50 8 L13 29 L13 71 L26 78.5" stroke="url(#ea-a)" />
            <path d="M26 78 L50 92 L87 71 L87 29 L80 25" stroke="url(#ea-b)" />
            <path d="M70 36 L50 25 L31 36 L31 50 L50 50 L69 50 L69 64 L50 75 L36 67" stroke="url(#ea-b)" />
          </g>
          <rect x="160" y="152" width="80" height="5" rx="2.5" fill="#fff" opacity=".7" />
          <rect x="176" y="161" width="48" height="4" rx="2" fill="#fff" opacity=".35" />
          <path d="M112 182 H288 L298 194 H102 Z" fill="url(#ea-base)" />
        </g>

        {/* abas da caixa */}
        <rect className="caixa-tampa" x="95" y="186" width="105" height="14" rx="3" fill="url(#ea-tampa)" />
        <rect className="caixa-tampa-d" x="200" y="186" width="105" height="14" rx="3" fill="url(#ea-tampa)" />

        {/* frente da caixa */}
        <path d="M95 200 H305 L295 320 H105 Z" fill="url(#ea-frente)" />
        <path d="M95 200 H305 L303 212 H97 Z" fill="#fff" opacity=".06" />
        {/* fita */}
        <rect x="190" y="200" width="20" height="120" fill="#2EC4E6" opacity=".25" />
        {/* etiqueta de inventário */}
        <g transform="translate(236 280) scale(.9)">
          <rect width="62" height="34" rx="5" fill="#fff" />
          <rect x="6" y="7" width="26" height="3" rx="1.5" fill="#0b2340" opacity=".7" />
          <rect x="6" y="13" width="18" height="3" rx="1.5" fill="#0b2340" opacity=".35" />
          {[0, 3, 5, 8, 10, 13, 16, 18, 21, 23].map((x) => (
            <rect key={x} x={6 + x * 2} y="20" width={x % 2 ? 1.4 : 2.4} height="9" fill="#0b2340" />
          ))}
        </g>
        {/* marca na caixa */}
        <g transform="translate(116 222) scale(.42)" fill="none" strokeWidth="11" strokeLinejoin="round">
          <path d="M74 22 L50 8 L13 29 L13 71 L26 78.5" stroke="url(#ea-a)" />
          <path d="M26 78 L50 92 L87 71 L87 29 L80 25" stroke="url(#ea-b)" />
          <path d="M70 36 L50 25 L31 36 L31 50 L50 50 L69 50 L69 64 L50 75 L36 67" stroke="url(#ea-b)" />
        </g>
        <text x="160" y="246" fill="#fff" fontFamily="var(--font-exo), sans-serif" fontWeight="800" fontSize="15">
          ERCA <tspan fill="#2EC4E6" fontStyle="italic">LOC</tspan>
        </text>
        <text x="160" y="259" fill="#7fd6ef" fontFamily="var(--font-inter), sans-serif" fontSize="6.5" letterSpacing="1.6">
          LOCAÇÃO DE TECNOLOGIA
        </text>
      </svg>

      {/* selos */}
      <span className="flutuar absolute right-[2%] top-[16%] inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-navy shadow-xl shadow-navy/15 ring-1 ring-navy/5">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[11px] text-white">✓</span> Configurado
      </span>
      <span
        className="flutuar absolute bottom-[20%] left-0 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-navy shadow-xl shadow-navy/15 ring-1 ring-navy/5"
        style={{ animationDelay: "-3s" }}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#F07B1E] text-[11px] text-white">#</span> Identificado no inventário
      </span>
    </div>
  );
}

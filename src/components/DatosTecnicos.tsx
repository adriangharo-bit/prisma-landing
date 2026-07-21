import Image from 'next/image';

const SPECS: { index: string; label: string; value: string; desc: string }[] = [
  { index: '01', label: 'FLEXIBILIDAD ÚNICA', value: 'Entresuelas compuestas', desc: 'Balance exacto entre flexibilidad y soporte.' },
  { index: '02', label: 'SUELA Y TALÓN', value: 'CAT μ 1.5', desc: 'Incorporamos compuesto CAT en suela y talón.' },
  { index: '03', label: 'TENSIÓN', value: 'Punta a talón', desc: 'Sistema de tensión desde la punta al talón.' },
  { index: '04', label: 'HORMA', value: 'Downturn asimétrico', desc: 'Optimizada para diedros, techos y volúmenes.' },
  { index: '05', label: 'UPPER', value: 'Microfibra', desc: 'Construido en 100% material sintético.' },
  { index: '06', label: 'EMPEINE', value: 'Parche de hule moldeado', desc: 'Con acojinamiento para empeines que exigen.' },
];

function Icon01() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <path d="M4 14 Q 12 4, 20 14 T 36 14" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 22 Q 12 12, 20 22 T 36 22" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M4 30 Q 12 20, 20 30 T 36 30" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}
function Icon03() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <circle cx="7" cy="20" r="3.5" fill="#FF5A1F" />
      <circle cx="33" cy="20" r="3.5" fill="#FF5A1F" opacity="0.4" />
      <line x1="10.5" y1="20" x2="29.5" y2="20" stroke="#FF5A1F" strokeWidth="2" />
      <path d="M14 15 L9 20 L14 25" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M26 15 L31 20 L26 25" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
    </svg>
  );
}
function Icon04() {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
      <path d="M30 8 C 35 9, 36 16, 35 22 C 30 25, 20 25, 8 27 C 4 27.5, 3 24, 6 21 C 11 16, 18 13, 24 10 C 26 9, 28 8, 30 8 Z" fill="rgba(255,90,31,0.18)" stroke="#FF5A1F" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="27" cy="12" r="1.3" fill="#FF5A1F" />
      <path d="M10 24 Q 6 27 9 30" stroke="#FF5A1F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M9 30 L7 27.3 L11.3 27.6 Z" fill="#FF5A1F" />
    </svg>
  );
}
function Icon05() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
      <line x1="6" y1="8" x2="6" y2="32" stroke="#FF5A1F" strokeWidth="2" />
      <line x1="14" y1="8" x2="14" y2="32" stroke="#FF5A1F" strokeWidth="2" opacity="0.6" />
      <line x1="22" y1="8" x2="22" y2="32" stroke="#FF5A1F" strokeWidth="2" opacity="0.6" />
      <line x1="30" y1="8" x2="30" y2="32" stroke="#FF5A1F" strokeWidth="2" />
      <line x1="6" y1="12" x2="30" y2="12" stroke="#FF5A1F" strokeWidth="2" opacity="0.35" />
      <line x1="6" y1="20" x2="30" y2="20" stroke="#FF5A1F" strokeWidth="2" opacity="0.35" />
      <line x1="6" y1="28" x2="30" y2="28" stroke="#FF5A1F" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}
function Icon06() {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
      <g transform="rotate(-24 20 20)">
        <rect x="5" y="12" width="30" height="16" rx="8" fill="rgba(255,90,31,0.18)" stroke="#FF5A1F" strokeWidth="2" />
        <path d="M9 20 L15 15 L21 20 L27 15 L31 20" stroke="#FF5A1F" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 24.5 L15 19.5 L21 24.5 L27 19.5 L31 24.5" stroke="#FF5A1F" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
        <circle cx="26" cy="16.5" r="1.3" fill="#FF5A1F" />
      </g>
    </svg>
  );
}
const ICONS: Record<string, () => JSX.Element> = { '01': Icon01, '03': Icon03, '04': Icon04, '05': Icon05, '06': Icon06 };

export default function DatosTecnicos() {
  return (
    <section
      id="sec-2"
      data-screen-label="Especificaciones"
      className="[scroll-snap-align:start] min-h-screen flex items-center bg-[#0d0d0d] px-6 py-[120px] border-b border-[#1a1a1a]"
    >
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <span className="font-geist text-xs tracking-[0.3em] text-[#FF5A1F] uppercase font-semibold">03 — Ficha técnica</span>
          <h2 className="text-[clamp(32px,5vw,56px)] leading-[1.05] font-extrabold uppercase text-[#f5f5f5]">Datos de rendimiento</h2>
        </div>

        <div className="grid grid-cols-3 gap-px bg-[#262626] border border-[#262626] max-[640px]:grid-cols-2">
          {SPECS.map((spec) => {
            const Icon = ICONS[spec.index];
            return (
              <div key={spec.index} className="bg-[#141414] px-6 py-7 flex flex-col gap-3.5 min-h-[190px]">
                <div className="w-11 h-11 rounded-full bg-[#FF5A1F]/[0.08] flex items-center justify-center overflow-hidden">
                  {spec.index === '02' ? (
                    <Image src="/prisma/icon-cat-logo.png" alt="Logo CAT rubber μ1.5" width={34} height={34} className="object-contain" />
                  ) : (
                    Icon && <Icon />
                  )}
                </div>
                <span className="font-geist text-[11px] tracking-[0.15em] text-[#FF5A1F] uppercase font-semibold">
                  {spec.index} · {spec.label}
                </span>
                <span className="text-[22px] font-bold text-[#f5f5f5] leading-[1.25]">{spec.value}</span>
                <span className="text-[13px] leading-[1.5] text-[#737373] mt-auto">{spec.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

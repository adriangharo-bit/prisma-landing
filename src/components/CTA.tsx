import Image from 'next/image';
import Link from 'next/link';

export default function CTA({ href = '/' }: { href?: string }) {
  return (
    <section
      id="sec-4"
      data-screen-label="CTA final"
      className="[scroll-snap-align:start] min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 py-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,90,31,0.10),transparent_60%)]" />
      <div className="max-w-[760px] mx-auto flex flex-col items-center gap-7 text-center relative z-[2]">
        <Image src="/prisma/prisma-logo-white.png" alt="PRISMA" width={200} height={47} className="h-[26px] w-auto opacity-90" />
        <h2 className="text-[clamp(34px,6vw,64px)] leading-[1.05] font-extrabold uppercase text-[#f5f5f5]">
          Los boulders dejaron de ser un problema
        </h2>
        <p className="text-[17px] leading-[1.6] text-[#a3a3a3] max-w-[520px]">
          Cantidad limitada. PRISMA se entrega a quienes participen y ganen el sorteo oficial de lanzamiento.
        </p>
        <Link
          href={href}
          className="inline-block bg-[#FF5A1F] hover:bg-[#E64A0F] text-[#0a0a0a] font-geist font-bold text-[15px] tracking-[0.05em] uppercase no-underline px-10 py-[18px] rounded-sm transition-all duration-[250ms] hover:-translate-y-0.5"
        >
          Participa en el sorteo →
        </Link>
        <span className="font-geist text-[11px] tracking-[0.15em] text-[#525252] uppercase">
          Acopa Outdoors · Edición de lanzamiento
        </span>
      </div>
    </section>
  );
}

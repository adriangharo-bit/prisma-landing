import Image from 'next/image';

export default function Hero({ heroLayout = 'center' }: { heroLayout?: 'center' | 'left' | 'split' }) {
  return (
    <section
      id="sec-0"
      data-screen-label="Hero"
      className="[scroll-snap-align:start] min-h-screen relative flex items-end overflow-hidden border-b border-[#1a1a1a]"
    >
      <Image
        src="/prisma/prisma-hero.jpg"
        alt="Par de zapatos PRISMA de Acopa Outdoors"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 from-40% to-black/90" />

      {heroLayout === 'center' && (
        <div className="animate-[prismaFadeUp_1s_ease_both_0.15s] w-full max-w-[1100px] mx-auto px-6 pb-24 text-center flex flex-col items-center gap-[18px] relative z-[2]">
          <span className="font-geist text-xs tracking-[0.35em] text-[#FF5A1F] uppercase font-semibold">
            Acopa Outdoors — Serie Técnica
          </span>
          <Image src="/prisma/prisma-logo-white.png" alt="PRISMA" width={280} height={66} className="h-[clamp(48px,9vw,104px)] w-auto" />
          <p className="text-[clamp(16px,2.4vw,22px)] leading-[1.5] text-[#d4d4d4] max-w-[640px] font-normal">
            Boulder técnico de alto nivel.
          </p>
        </div>
      )}

      {heroLayout === 'left' && (
        <div className="animate-[prismaFadeUp_1s_ease_both_0.15s] w-full max-w-[1400px] mx-auto px-8 pb-24 text-left flex flex-col items-start gap-[18px] relative z-[2]">
          <span className="font-geist text-xs tracking-[0.35em] text-[#FF5A1F] uppercase font-semibold">
            Acopa Outdoors — Serie Técnica
          </span>
          <Image src="/prisma/prisma-logo-white.png" alt="PRISMA" width={280} height={66} className="h-[clamp(44px,8vw,92px)] w-auto" />
          <p className="text-[clamp(16px,2vw,20px)] leading-[1.5] text-[#d4d4d4] max-w-[520px] font-normal">
            Boulder técnico de alto nivel.
          </p>
        </div>
      )}

      {heroLayout === 'split' && (
        <div className="animate-[prismaFadeUp_1s_ease_both_0.15s] w-full max-w-[1400px] mx-auto px-8 pb-24 flex flex-row items-end justify-between gap-8 relative z-[2] flex-wrap">
          <div className="flex flex-col gap-[18px] max-w-[640px]">
            <span className="font-geist text-xs tracking-[0.35em] text-[#FF5A1F] uppercase font-semibold">
              Acopa Outdoors — Serie Técnica
            </span>
            <Image src="/prisma/prisma-logo-white.png" alt="PRISMA" width={280} height={66} className="h-[clamp(38px,7vw,80px)] w-auto" />
          </div>
          <p className="text-[clamp(15px,1.8vw,19px)] leading-[1.6] text-[#d4d4d4] max-w-[360px] mb-2 text-left border-l-2 border-[#FF5A1F] pl-[18px]">
            Boulder técnico de alto nivel.
          </p>
        </div>
      )}

      <div className="animate-[prismaFadeUp_1s_ease_both_0.4s] absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[2]">
        <span className="font-geist text-[10px] tracking-[0.25em] text-[#a3a3a3] uppercase">Desliza</span>
        <div className="w-px h-7 bg-gradient-to-b from-[#FF5A1F] to-transparent" />
      </div>
    </section>
  );
}

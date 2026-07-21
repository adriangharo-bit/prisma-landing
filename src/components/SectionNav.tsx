'use client';

import { useEffect, useState } from 'react';

const SECTION_IDS = ['sec-0', 'sec-1', 'sec-2', 'sec-3', 'sec-4'];
const LABELS = ['01', '02', '03', '04', '05'];

export default function SectionNav({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const onScroll = () => {
      const mid = c.scrollTop + c.clientHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const center = el.offsetTop + el.offsetHeight / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActive(best);
    };
    c.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => c.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  const scrollTo = (i: number) => {
    const el = document.getElementById(SECTION_IDS[i]);
    if (el && containerRef.current) {
      containerRef.current.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="
        fixed z-50 pointer-events-none
        top-0 right-0 h-screen w-16 flex-col items-center justify-center gap-[22px]
        max-[640px]:top-auto max-[640px]:bottom-0 max-[640px]:left-0 max-[640px]:right-0
        max-[640px]:h-auto max-[640px]:w-full max-[640px]:flex-row max-[640px]:justify-center
        max-[640px]:gap-3.5 max-[640px]:py-3.5 max-[640px]:pb-[calc(14px+env(safe-area-inset-bottom,0px))]
        max-[640px]:bg-gradient-to-t max-[640px]:from-black/90 max-[640px]:to-transparent
        flex
      "
    >
      {LABELS.map((label, i) => {
        const isActive = active === i;
        return (
          <button
            key={label}
            onClick={() => scrollTo(i)}
            aria-label={`Ir a sección ${label}`}
            className="pointer-events-auto bg-transparent border-0 px-2 py-1.5 flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <span
              className="font-geist text-[11px] tracking-[0.1em] transition-colors duration-300"
              style={{ color: isActive ? '#FF5A1F' : '#525252', fontWeight: isActive ? 700 : 500 }}
            >
              {label}
            </span>
            <span
              className="h-0.5 transition-all duration-300"
              style={{ width: isActive ? 18 : 10, background: isActive ? '#FF5A1F' : '#404040' }}
            />
          </button>
        );
      })}
    </nav>
  );
}

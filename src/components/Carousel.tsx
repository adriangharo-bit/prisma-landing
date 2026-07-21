'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const PHOTOS = [
  { src: '/prisma/carousel-1-frontal.jpg', alt: 'PRISMA vista frontal' },
  { src: '/prisma/carousel-2-diagointerna.jpg', alt: 'PRISMA vista diagonal interna' },
  { src: '/prisma/carousel-3-lateral.jpg', alt: 'PRISMA vista lateral' },
  { src: '/prisma/carousel-4-closeup1.jpg', alt: 'PRISMA detalle de puntera' },
  { src: '/prisma/carousel-5-closeup2.jpg', alt: 'PRISMA detalle de velcro y empeine' },
];
const COUNT = PHOTOS.length;
const AUTOPLAY_MS = 3000;

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const interacting = useRef(false);
  const dragging = useRef(false);
  const dragMoved = useRef(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (interacting.current) return;
      setIndex((i) => (i + 1) % COUNT);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    interacting.current = true;
    dragging.current = true;
    dragMoved.current = false;
    dragStartX.current = e.pageX;
    dragStartIndex.current = index;
    if (elRef.current) elRef.current.style.cursor = 'grabbing';

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const dx = ev.pageX - dragStartX.current;
      if (Math.abs(dx) > 6) dragMoved.current = true;
      const shift = Math.round(-dx / 90);
      const next = ((dragStartIndex.current + shift) % COUNT + COUNT) % COUNT;
      setIndex((cur) => (next !== cur ? next : cur));
    };
    const onUp = () => {
      dragging.current = false;
      interacting.current = false;
      if (elRef.current) elRef.current.style.cursor = 'grab';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const goTo = (i: number) => {
    if (dragMoved.current) { dragMoved.current = false; return; }
    setIndex(i);
  };

  return (
    <div
      ref={elRef}
      onMouseDown={onMouseDown}
      onMouseEnter={() => (interacting.current = true)}
      onMouseLeave={() => (interacting.current = false)}
      className="relative h-[clamp(220px,32vw,360px)] flex items-center justify-center cursor-grab select-none"
    >
      {PHOTOS.map((photo, i) => {
        let offset = i - index;
        if (offset > COUNT / 2) offset -= COUNT;
        if (offset < -COUNT / 2) offset += COUNT;
        const abs = Math.abs(offset);
        const isCenter = offset === 0;
        return (
          <div
            key={photo.src}
            onClick={() => goTo(i)}
            className="absolute rounded border border-[#262626] overflow-hidden bg-[#101010] cursor-pointer"
            style={{
              width: 'clamp(240px, 34vw, 420px)',
              aspectRatio: '16 / 9',
              transition: 'transform 0.9s ease, filter 0.9s ease, opacity 0.9s ease, z-index 0s',
              transform: `translateX(${offset * 62}%) scale(${isCenter ? 1 : 0.78})`,
              filter: isCenter ? 'blur(0) brightness(1)' : 'blur(3px) brightness(0.55)',
              opacity: abs > 2 ? 0 : 1,
              zIndex: 10 - abs,
              boxShadow: isCenter ? '0 24px 50px rgba(0,0,0,0.55)' : 'none',
            }}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="420px" className="object-cover" draggable={false} />
          </div>
        );
      })}
    </div>
  );
}

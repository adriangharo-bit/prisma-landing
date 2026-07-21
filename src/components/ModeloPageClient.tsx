'use client';

import { useRef } from 'react';
import SectionNav from './SectionNav';
import Hero from './Hero';
import Desarrollo from './Desarrollo';
import DatosTecnicos from './DatosTecnicos';
import Video from './Video';
import CTA from './CTA';

export default function ModeloPageClient({
  heroLayout = 'center',
  snapStrength = 'proximity',
  showSectionNav = true,
}: {
  heroLayout?: 'center' | 'left' | 'split';
  snapStrength?: 'proximity' | 'mandatory' | 'none';
  showSectionNav?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const snapType = snapStrength === 'none' ? 'none' : snapStrength === 'mandatory' ? 'y mandatory' : 'y proximity';

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden bg-[#0a0a0a] text-[#f5f5f5] relative font-geist"
      style={{ scrollSnapType: snapType }}
    >
      {showSectionNav && <SectionNav containerRef={containerRef} />}
      <Hero heroLayout={heroLayout} />
      <Desarrollo />
      <DatosTecnicos />
      <Video />
      <CTA />
    </div>
  );
}

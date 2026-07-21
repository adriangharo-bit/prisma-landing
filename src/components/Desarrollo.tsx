import Image from 'next/image';
import Carousel from './Carousel';

const DEV_ITEMS = [
  { src: '/prisma/dev-1-inspiracion.jpg', alt: 'Render de detalle del empeine de PRISMA', caption: 'Canales de flexión modelados en el empeine para acompañar cada movimiento del pie.' },
  { src: '/prisma/dev-4-empeine.jpg', alt: 'Corte láser del prototipo de empeine', caption: 'Proceso de diseño del empeine.' },
  { src: '/prisma/dev-3-talon.jpg', alt: 'Talón reforzado con compuesto CAT', caption: 'Talón en compuesto CAT μ 1.5 — tracción constante en cada apoyo de talón.' },
  { src: '/prisma/dev-4-horma.png', alt: 'Horma técnica con estructura de soporte de impresión 3D', caption: 'Horma validada milímetro a milímetro. Punta redondeada, sin bordes filosos, para mejor soporte de los dedos.' },
];

export default function Desarrollo() {
  return (
    <section
      id="sec-1"
      data-screen-label="Desarrollo"
      className="[scroll-snap-align:start] min-h-screen flex items-center bg-[#0a0a0a] px-6 pt-[120px] pb-[60px] border-b border-[#1a1a1a]"
    >
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-[760px]">
          <span className="font-geist text-xs tracking-[0.3em] text-[#FF5A1F] uppercase font-semibold">02 — El proceso</span>
          <h2 className="text-[clamp(32px,5vw,56px)] leading-[1.05] tracking-[0.01em] font-extrabold uppercase text-[#f5f5f5]">
            Diseñado en la roca
          </h2>
          <p className="text-[17px] leading-[1.7] text-[#a3a3a3] max-w-[680px]">
            Veinticuatro meses de prototipos, pruebas de campo en bloques reales y ajustes de milímetro a milímetro. Cada versión de PRISMA se probó afuera.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 max-[640px]:grid-cols-2 max-[640px]:gap-3.5">
          {DEV_ITEMS.map((item) => (
            <div key={item.src} className="flex flex-col gap-4">
              <div className="aspect-[4/5] w-full rounded-sm border border-[#262626] overflow-hidden relative max-[640px]:max-w-[88%] max-[640px]:mx-auto">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 44vw, 280px" className="object-cover" />
              </div>
              <p className="text-sm leading-[1.6] text-[#737373]">{item.caption}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="font-geist text-xs tracking-[0.2em] text-[#525252] uppercase whitespace-nowrap">Detalle de producto</span>
          <div className="flex-1 h-px bg-[#262626]" />
        </div>

        <Carousel />
      </div>
    </section>
  );
}

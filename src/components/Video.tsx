export default function Video() {
  return (
    <section
      id="sec-3"
      data-screen-label="Video"
      className="[scroll-snap-align:start] min-h-screen flex items-center bg-[#0a0a0a] px-6 py-[120px] border-b border-[#1a1a1a]"
    >
      <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-9">
        <div className="flex flex-col gap-3 text-center">
          <span className="font-geist text-xs tracking-[0.3em] text-[#FF5A1F] uppercase font-semibold">04 — En movimiento</span>
          <h2 className="text-[clamp(30px,4.5vw,48px)] leading-[1.05] font-extrabold uppercase text-[#f5f5f5]">
            PRISMA EN MOVIMIENTO
          </h2>
        </div>
        <div className="w-full aspect-video border border-[#262626] rounded-sm overflow-hidden bg-[#141414]">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/pX6BsGeEL6k?si=JZcwAzQWA6Lszh-g"
            title="YouTube video player"
            className="w-full h-full border-0 block"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

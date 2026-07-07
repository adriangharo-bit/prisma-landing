"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[480px] text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          PRISMA<span className="text-accent">.</span>
        </h1>
        <p className="mb-8 text-neutral-400">
          Algo salió mal. Intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-accent px-4 py-3 font-semibold uppercase tracking-wide text-black transition hover:bg-accent-hover"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}

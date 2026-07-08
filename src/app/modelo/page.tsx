import Link from "next/link";

export default function ModeloPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[480px] text-center">
        <p className="mb-8 text-xs uppercase tracking-[0.3em] text-neutral-500">
          Acopa Outdoors
        </p>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          PRISMA<span className="text-accent">.</span>
        </h1>

        <p className="text-neutral-400">
          Estamos preparando esta página. Muy pronto podrás conocer todos los
          detalles del zapato aquí.
        </p>

        <p className="mt-10">
          <Link href="/" className="text-accent hover:underline">
            ← Volver a registro
          </Link>
        </p>
      </div>
    </main>
  );
}

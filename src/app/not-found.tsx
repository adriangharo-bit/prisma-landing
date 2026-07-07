import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[480px] text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          PRISMA<span className="text-accent">.</span>
        </h1>
        <p className="mb-8 text-neutral-400">
          Esta página no existe.
        </p>
        <Link href="/" className="text-accent hover:underline">
          ← Volver a registro
        </Link>
      </div>
    </main>
  );
}

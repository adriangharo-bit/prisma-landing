import { Suspense } from "react";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default function Home() {
  const raffleDate = process.env.RAFFLE_DATE;
  const showWinnersLink = Boolean(raffleDate) && new Date() >= new Date(raffleDate!);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[480px]">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-neutral-500">
          Acopa Outdoors
        </p>

        <h1 className="mb-4 text-center text-4xl font-bold tracking-tight">
          PRISMA<span className="text-accent">.</span>
        </h1>

        <p className="mb-10 text-center text-neutral-400">
          El zapato más técnico que hemos construido. Regístrate y entra al
          sorteo para ganarlo.
        </p>

        <Suspense fallback={null}>
          <RegisterForm showWinnersLink={showWinnersLink} />
        </Suspense>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRaffleDate } from "@/lib/date";

type WinnersResponse =
  | { status: "pending"; raffle_date: string }
  | { status: "complete"; winners: { name: string; email_masked: string }[] };

function useCountdown(targetIso: string | null) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!targetIso) return;

    function tick() {
      const diff = new Date(targetIso!).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setRemaining({ days, hours, minutes });
    }

    tick();
    const interval = setInterval(tick, 1000 * 30);
    return () => clearInterval(interval);
  }, [targetIso]);

  return remaining;
}

export default function GanadoresPage() {
  const [data, setData] = useState<WinnersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/winners")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const countdown = useCountdown(
    data?.status === "pending" ? data.raffle_date : null
  );

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[480px] text-center">
        <p className="mb-8 text-xs uppercase tracking-[0.3em] text-neutral-500">
          Acopa Outdoors
        </p>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          PRISMA<span className="text-accent">.</span>
        </h1>
        <p className="mb-10 text-neutral-400">Ganadores del sorteo.</p>

        {loading && <p className="text-neutral-500">Cargando...</p>}

        {!loading && data?.status === "pending" && (
          <div>
            <p className="mb-6 text-neutral-400">
              El sorteo se realiza el {formatRaffleDate(data.raffle_date)}.
            </p>
            <p className="text-2xl font-semibold">
              {countdown.days} días : {countdown.hours} hrs : {countdown.minutes} min
            </p>
          </div>
        )}

        {!loading && data?.status === "complete" && (
          <div>
            <p className="mb-6 text-lg">🎉 ¡Y el PRISMA se va con...</p>
            <div className="flex flex-col gap-4">
              {data.winners.map((winner, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border bg-surface px-6 py-5"
                >
                  <p className="text-lg font-semibold">{winner.name}</p>
                  <p className="text-neutral-400">{winner.email_masked}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-neutral-400">
              Felicidades. Nos pondremos en contacto por email.
            </p>
          </div>
        )}

        <p className="mt-10">
          <Link href="/" className="text-accent hover:underline">
            ← Volver a registro
          </Link>
        </p>
      </div>
    </main>
  );
}

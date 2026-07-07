"use client";

import { useState } from "react";
import { formatRaffleDate } from "@/lib/date";

interface AdminStatus {
  count: number;
  raffle_date: string;
  status: "waiting" | "ready" | "done";
  winners: { name: string; email_masked: string }[];
}

const STATUS_LABELS: Record<AdminStatus["status"], string> = {
  waiting: "EN ESPERA",
  ready: "LISTO",
  done: "EJECUTADO",
};

const RAFFLE_ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "No autorizado.",
  raffle_not_ready: "Todavía no es la fecha del sorteo.",
  raffle_already_run: "El sorteo ya se ejecutó.",
  server_error: "Algo salió mal. Intenta de nuevo.",
};

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [raffleRunning, setRaffleRunning] = useState(false);
  const [raffleMessage, setRaffleMessage] = useState("");
  const [csvDownloading, setCsvDownloading] = useState(false);

  async function fetchStatus(pwd: string) {
    const res = await fetch("/api/admin/status", {
      headers: { Authorization: `Bearer ${pwd}` },
    });
    if (res.ok) {
      setStatus(await res.json());
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput }),
    });

    if (!res.ok) {
      setLoginError("Contraseña incorrecta.");
      return;
    }

    setPassword(passwordInput);
    await fetchStatus(passwordInput);
  }

  async function handleRunRaffle() {
    if (!password) return;
    setRaffleRunning(true);
    setRaffleMessage("");

    try {
      const res = await fetch("/api/raffle", {
        method: "POST",
        headers: { Authorization: `Bearer ${password}` },
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setRaffleMessage(
          RAFFLE_ERROR_MESSAGES[data?.error] ?? RAFFLE_ERROR_MESSAGES.server_error
        );
        return;
      }

      await fetchStatus(password);
    } finally {
      setRaffleRunning(false);
    }
  }

  async function handleDownloadCsv() {
    if (!password) return;
    setCsvDownloading(true);
    try {
      const res = await fetch("/api/admin/registrants", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prisma-registrados.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setCsvDownloading(false);
    }
  }

  if (!password) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px]">
          <h1 className="mb-8 text-center text-2xl font-bold">
            Admin PRISMA Sorteo
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {loginError && <p className="text-sm text-red-400">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-accent px-4 py-3 font-semibold uppercase tracking-wide text-black transition hover:bg-accent-hover"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[480px]">
        <h1 className="mb-8 text-center text-2xl font-bold">
          Admin PRISMA Sorteo
        </h1>

        {status && (
          <div className="mb-8 rounded-md border border-border bg-surface px-6 py-5">
            <p className="mb-2">
              Registrados:{" "}
              <span className="font-semibold">{status.count} escaladores</span>
            </p>
            <p className="mb-2">
              Fecha sorteo:{" "}
              <span className="font-semibold">
                {formatRaffleDate(status.raffle_date)}
              </span>
            </p>
            <p>
              Estado:{" "}
              <span className="font-semibold">
                {STATUS_LABELS[status.status]}
              </span>
            </p>
          </div>
        )}

        <button
          onClick={handleRunRaffle}
          disabled={status?.status !== "ready" || raffleRunning}
          className="mb-2 w-full rounded-md bg-accent px-4 py-3 font-semibold uppercase tracking-wide text-black transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {raffleRunning ? "Ejecutando..." : "Ejecutar sorteo"}
        </button>
        {raffleMessage && (
          <p className="mb-6 text-sm text-red-400">{raffleMessage}</p>
        )}

        <hr className="my-8 border-border" />

        <p className="mb-3 font-semibold">Ganadores:</p>
        {status && status.winners.length > 0 ? (
          <div className="mb-8 flex flex-col gap-3">
            {status.winners.map((w, i) => (
              <div
                key={i}
                className="rounded-md border border-border bg-surface px-4 py-3"
              >
                <p className="font-semibold">{w.name}</p>
                <p className="text-sm text-neutral-400">{w.email_masked}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-8 text-neutral-500">Todavía no hay ganadores.</p>
        )}

        <button
          onClick={handleDownloadCsv}
          disabled={csvDownloading}
          className="w-full rounded-md border border-border px-4 py-3 font-semibold uppercase tracking-wide transition hover:border-accent disabled:opacity-60"
        >
          {csvDownloading ? "Descargando..." : "Descargar CSV de registrados"}
        </button>
      </div>
    </main>
  );
}

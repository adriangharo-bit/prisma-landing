"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "idle" | "loading" | "success" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_code: "Ese código no es válido. Revisa el poster.",
  already_registered: "Ya estás registrado con ese email.",
  invalid_email: "Ingresa un email válido.",
  missing_fields: "Completa todos los campos.",
  rate_limited: "Demasiados intentos. Intenta de nuevo en un rato.",
  server_error: "Algo salió mal. Intenta de nuevo.",
};

export function RegisterForm({
  showWinnersLink,
  assignedCode,
}: {
  showWinnersLink: boolean;
  assignedCode: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code] = useState(assignedCode);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, code }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setEmailSent(data?.email_sent !== false);
        setStatus("success");
        return;
      }

      setErrorMessage(ERROR_MESSAGES[data?.error] ?? ERROR_MESSAGES.server_error);
      setStatus("error");
    } catch {
      setErrorMessage(ERROR_MESSAGES.server_error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        {emailSent ? (
          <p className="text-lg">
            ¡Ya estás dentro! Revisa tu email para confirmar.
          </p>
        ) : (
          <>
            <p className="text-lg">¡Ya estás dentro!</p>
            <p className="mt-2 text-sm text-red-400">
              No pudimos enviarte el email de confirmación. Guarda tu código:{" "}
              <span className="font-semibold">{code}</span>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <div className="relative">
          <input
            type="text"
            readOnly
            value={code}
            className="w-full rounded-md border border-border bg-surface px-4 py-3 pr-10 text-neutral-400 focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-accent">
            ✓
          </span>
        </div>

        {status === "error" && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 w-full rounded-md bg-accent px-4 py-3 font-semibold uppercase tracking-wide text-black transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Enviando..." : "Registrarme en el sorteo"}
        </button>

        <p className="text-center text-neutral-300">
          Nos pondremos en contacto por correo electrónico con los ganadores.
        </p>

        <p className="text-center text-xs text-neutral-500">
          Al registrarte aceptas los términos del sorteo y recibir
          comunicaciones de Acopa Outdoors.
        </p>
      </form>

      {showWinnersLink && (
        <>
          <hr className="my-8 border-border" />
          <p className="text-center">
            <Link href="/ganadores" className="text-accent hover:underline">
              Ver ganadores →
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

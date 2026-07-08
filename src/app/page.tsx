import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";
import { isRaffleDateReached } from "@/lib/date";
import { getValidCodes } from "@/lib/validation";

export const dynamic = "force-dynamic";

function assignRandomCode(): string {
  const codes = getValidCodes();
  return codes[Math.floor(Math.random() * codes.length)] ?? "";
}

export default function Home() {
  const showWinnersLink = isRaffleDateReached(process.env.RAFFLE_DATE);
  const assignedCode = assignRandomCode();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg-mobile.jpg"
          alt=""
          className="block h-full w-full object-cover md:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg-desktop.jpg"
          alt=""
          className="hidden h-full w-full object-cover md:block"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-[480px]">
          <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-neutral-400">
            Acopa Outdoors
          </p>

          <div className="mb-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/prisma-logo-white.png"
              alt="PRISMA"
              className="h-10 w-auto sm:h-12"
            />
          </div>

          <p className="mb-10 text-center text-neutral-300">
            El zapato más técnico que hemos construido. Regístrate y entra al
            sorteo para ganarlo.
          </p>

          <RegisterForm showWinnersLink={showWinnersLink} assignedCode={assignedCode} />

          <Link
            href="/modelo"
            className="mt-4 block w-full rounded-md border border-accent px-4 py-3 text-center font-semibold uppercase tracking-wide text-accent transition hover:border-foreground hover:text-foreground"
          >
            Explorar el PRISMA
          </Link>
        </div>
      </main>
    </div>
  );
}

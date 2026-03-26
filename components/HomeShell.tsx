"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { ComplaintPublic } from "@/lib/domain/types";
import {
  ComplaintFeed,
  type ComplaintFeedHandle,
} from "@/components/ComplaintFeed";
import { WallOfShame } from "@/components/WallOfShame";
import { CatharsisManifest } from "@/components/CatharsisManifest";

const VentBox = dynamic(
  () => import("@/components/VentBox").then((m) => m.VentBox),
  {
    ssr: false,
    loading: () => (
      <div
        className="border-2 border-dashed border-white/25 bg-black px-4 py-10 font-mono text-sm text-white/45"
        aria-hidden
      >
        Cargando caja de ventilación…
      </div>
    ),
  },
);

export function HomeShell() {
  const feedRef = useRef<ComplaintFeedHandle>(null);
  const [wallTick, setWallTick] = useState(0);

  function handlePosted(c: ComplaintPublic) {
    feedRef.current?.prependComplaint(c);
    setWallTick((n) => n + 1);
  }

  return (
    <div className="flex w-full max-w-none flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:gap-8 lg:px-8 xl:gap-10 xl:px-10 2xl:px-12">
      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <header className="border-2 border-white bg-black px-4 py-4 shadow-[8px_8px_0_0_#FF3B30] sm:px-6 sm:py-5">
          <p className="font-mono text-[11px] uppercase leading-snug tracking-[0.12em] text-[#E5FF00] sm:text-xs">
            Juntamos historias reales · para exigir mejor servicio
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-archivo)] text-4xl uppercase leading-none tracking-tight text-white sm:text-5xl xl:text-6xl">
            Mal de Muchos
          </h1>
          <div className="mt-4 max-w-4xl space-y-3 font-mono text-sm leading-relaxed text-white/80 lg:text-base">
            <p>
              Acá podés contar, sin dar tu nombre, qué te falló con una empresa o
              servicio: un cobro injusto, una espera eterna, una promesa que no
              cumplieron. Tu queja se suma a la de miles y se ve qué marcas nos
              hacen perder tiempo, plata y paciencia.
            </p>
            <p className="text-white/70">
              No estás solo en el filo: antes no había un lugar donde gritarlo
              juntos. Esto no es pelear entre nosotros; es un espejo colectivo
              para que dejen de tratarnos como números y nos den lo que pagamos.
            </p>
          </div>
        </header>

        <VentBox onPosted={handlePosted} />
        <ComplaintFeed ref={feedRef} />
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:w-[min(100%,420px)] lg:overflow-y-auto lg:pr-1 xl:w-[min(100%,460px)] 2xl:w-[min(100%,500px)]">
        <CatharsisManifest variant="sidebar" />
        <WallOfShame refreshToken={wallTick} />
      </aside>
    </div>
  );
}

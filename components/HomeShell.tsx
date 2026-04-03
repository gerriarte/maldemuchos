"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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
        Cargando formulario…
      </div>
    ),
  },
);

export function HomeShell() {
  const feedRef = useRef<ComplaintFeedHandle>(null);
  const [wallTick, setWallTick] = useState(0);
  const [ventOpen, setVentOpen] = useState(false);

  function handlePosted(c: ComplaintPublic) {
    feedRef.current?.prependComplaint(c);
    setWallTick((n) => n + 1);
  }

  useEffect(() => {
    if (!ventOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [ventOpen]);

  useEffect(() => {
    if (!ventOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVentOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ventOpen]);

  return (
    <div className="relative flex w-full max-w-none flex-col gap-5 px-3 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:gap-8 lg:px-8 xl:gap-10 xl:px-10 2xl:px-12">
      {/* Mobile: feed-first layout + compact header */}
      <header className="shrink-0 border-2 border-white bg-black px-3 py-3 shadow-[6px_6px_0_0_#FF3B30] lg:hidden">
        <h1 className="font-[family-name:var(--font-archivo)] text-2xl uppercase leading-none tracking-tight text-white sm:text-3xl">
          Mal de Muchos
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-xs leading-snug text-white/75 sm:text-sm">
          Quejas anónimas contra empresas y servicios, sin registro. Contá qué te
          falló y mirá el chismógrafo en vivo.
        </p>
      </header>

      <div className="flex min-w-0 flex-1 flex-col gap-6 pb-24 lg:flex-row lg:gap-8 lg:pb-0">
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:min-w-0">
          {/* Desktop: hero + inline form */}
          <header className="hidden border-2 border-white bg-black px-6 py-5 shadow-[8px_8px_0_0_#FF3B30] lg:block">
            <p className="font-mono text-xs uppercase leading-snug tracking-[0.12em] text-[#E5FF00]">
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

          <div className="hidden lg:block">
            <VentBox onPosted={handlePosted} variant="inline" />
          </div>

          <ComplaintFeed ref={feedRef} />

          <section
            aria-labelledby="faq-title"
            className="border-2 border-white/50 bg-black px-4 py-5 sm:px-6"
          >
            <h2
              id="faq-title"
              className="font-[family-name:var(--font-archivo)] text-2xl uppercase leading-none text-white sm:text-3xl"
            >
              Preguntas frecuentes
            </h2>
            <div className="mt-4 space-y-3 font-mono text-sm text-white/85">
              <p className="lg:hidden">
                <strong className="text-[#E5FF00]">¿Cómo publico?</strong> Tocá el
                botón amarillo flotante, completá el formulario y enviá.
              </p>
              <p className="hidden lg:block">
                <strong className="text-[#E5FF00]">¿Cómo publico?</strong> Completá
                empresa, país, queja e intensidad en la caja de ventilación y enviá.
              </p>
              <p>
                <strong className="text-[#E5FF00]">¿Es anónimo?</strong> Sí, no
                pedimos registro para publicar.
              </p>
              <p>
                <strong className="text-[#E5FF00]">¿Qué no está permitido?</strong>{" "}
                Nombres de personas, datos sensibles y ataques a individuos.
              </p>
            </div>
          </section>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:w-[min(100%,420px)] lg:overflow-y-auto lg:pr-1 xl:w-[min(100%,460px)] 2xl:w-[min(100%,500px)]">
          <CatharsisManifest variant="sidebar" />
          <WallOfShame refreshToken={wallTick} />
        </aside>
      </div>

      <button
        type="button"
        onClick={() => setVentOpen(true)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-4 z-40 flex min-h-14 items-center justify-center gap-2 border-2 border-black bg-[#E5FF00] px-5 py-3 font-[family-name:var(--font-archivo)] text-sm uppercase tracking-wide text-black shadow-[5px_5px_0_0_#fff] active:translate-x-px active:translate-y-px lg:hidden"
        aria-haspopup="dialog"
        aria-expanded={ventOpen}
        aria-controls="vent-dialog-panel"
      >
        Soltar veneno
      </button>

      {ventOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 sm:items-center lg:hidden"
          role="presentation"
          onClick={() => setVentOpen(false)}
        >
          <div
            id="vent-dialog-panel"
            className="w-full max-w-lg border-2 border-white border-b-0 bg-[#0A0A0A] shadow-[0_-6px_0_0_#E5FF00] sm:mb-4 sm:max-h-[min(92dvh,880px)] sm:border-b-2 sm:shadow-[8px_8px_0_0_#ffffff]"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <VentBox
              variant="modal"
              onPosted={(c) => {
                handlePosted(c);
                setVentOpen(false);
              }}
              onRequestClose={() => setVentOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

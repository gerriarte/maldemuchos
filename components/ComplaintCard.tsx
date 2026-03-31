"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ComplaintPublic, ReactionType } from "@/lib/domain/types";
import {
  buildWhatsappChismeUrl,
  shareChismeWithImage,
} from "@/lib/utils/chismeShareImage";
import { timeAgoEs } from "@/lib/utils/timeAgo";
import { countryLabel } from "@/lib/domain/countries";
import { linkifyTextWithUgc } from "@/lib/utils/linkifyText";

type Props = {
  complaint: ComplaintPublic;
  onUpdate: (c: ComplaintPublic) => void;
};

export function ComplaintCard({ complaint, onUpdate }: Props) {
  const [pending, setPending] = useState<ReactionType | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const shareWrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
  }, []);

  const whatsappHref = useMemo(() => {
    if (!pageUrl) return "#";
    return buildWhatsappChismeUrl(complaint, pageUrl);
  }, [complaint, pageUrl]);

  useEffect(() => {
    if (!shareMenuOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (
        shareWrapRef.current &&
        !shareWrapRef.current.contains(e.target as Node)
      ) {
        setShareMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [shareMenuOpen]);

  async function react(type: ReactionType) {
    setPending(type);
    try {
      const res = await fetch(`/api/complaints/${complaint.id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) return;
      const updated = (await res.json()) as ComplaintPublic;
      onUpdate(updated);
    } finally {
      setPending(null);
    }
  }

  async function handleShareImage() {
    setShareError(null);
    setShareBusy(true);
    try {
      await shareChismeWithImage(complaint);
      setShareMenuOpen(false);
    } catch {
      setShareError(
        "No se pudo generar la imagen. Probá de nuevo o usá WhatsApp.",
      );
    } finally {
      setShareBusy(false);
    }
  }

  function openWhatsapp() {
    if (whatsappHref && whatsappHref !== "#") {
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    }
    setShareMenuOpen(false);
  }

  return (
    <article className="border-2 border-white bg-black p-4 shadow-[6px_6px_0_0_rgba(255,255,255,0.35)]">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-[family-name:var(--font-archivo)] text-xl uppercase leading-none text-[#FF3B30] sm:text-2xl">
          {complaint.company}
        </h3>
        <span
          className="border border-white/35 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white/70"
          title="Mercado de la queja"
        >
          {countryLabel(complaint.countryCode) ?? complaint.countryCode}
        </span>
        <span className="font-mono text-xs text-white/55">
          {timeAgoEs(complaint.createdAt)}
        </span>
      </header>
      <div className="mt-3 whitespace-pre-wrap font-mono text-sm leading-relaxed text-white">
        {linkifyTextWithUgc(complaint.text)}
      </div>
      <footer className="mt-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => react("meToo")}
            className="border-2 border-[#E5FF00] bg-transparent px-3 py-2 font-mono text-xs uppercase tracking-wide text-[#E5FF00] transition hover:bg-[#E5FF00] hover:text-black disabled:opacity-50"
          >
            A mí también me pasó ({complaint.reactions.meToo})
          </button>
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => react("indignante")}
            className="border-2 border-white bg-transparent px-3 py-2 font-mono text-xs uppercase tracking-wide text-white transition hover:bg-white hover:text-black disabled:opacity-50"
          >
            Indignante ({complaint.reactions.indignante})
          </button>
        </div>

        <div
          ref={shareWrapRef}
          className="relative border-t border-white/15 pt-3"
        >
          <button
            type="button"
            disabled={pending !== null}
            aria-expanded={shareMenuOpen}
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={() => setShareMenuOpen((o) => !o)}
            className="w-full border-2 border-[#E5FF00] bg-[#E5FF00]/10 px-3 py-2.5 text-left font-mono text-xs uppercase tracking-wide text-[#E5FF00] shadow-[4px_4px_0_0_rgba(229,255,0,0.25)] transition hover:bg-[#E5FF00]/20 sm:w-auto sm:min-w-[220px]"
          >
            Compartir chisme {shareMenuOpen ? "▲" : "▼"}
          </button>

          {shareMenuOpen ? (
            <div
              id={menuId}
              role="menu"
              className="absolute left-0 right-0 top-full z-20 mt-2 border-2 border-white bg-[#0A0A0A] shadow-[6px_6px_0_0_#ffffff] sm:right-auto sm:min-w-[280px]"
            >
              <button
                type="button"
                role="menuitem"
                disabled={shareBusy || pending !== null}
                onClick={() => void handleShareImage()}
                className="flex w-full items-center justify-between gap-3 border-b-2 border-white/20 px-3 py-3 text-left font-mono text-xs uppercase tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                <span>Compartir chisme en imagen</span>
                <span className="text-[10px] font-normal normal-case text-white/50">
                  post cuadrado · 1:1
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={!pageUrl || pending !== null}
                onClick={openWhatsapp}
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left font-mono text-xs uppercase tracking-wide text-[#25D366] transition hover:bg-white/10 disabled:opacity-40"
              >
                <span>Compartir por WhatsApp</span>
                <span className="text-[10px] font-normal normal-case text-white/50">
                  texto + link
                </span>
              </button>
            </div>
          ) : null}

          <p className="mt-2 font-mono text-[10px] leading-snug text-white/40">
            Imagen lista para redes; WhatsApp abre el chat con el texto del
            chisme.
          </p>
          {shareError ? (
            <p className="mt-2 font-mono text-xs text-[#FF3B30]">{shareError}</p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}

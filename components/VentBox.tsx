"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COUNTRY_OPTIONS,
  guessCountryFromLocale,
} from "@/lib/domain/countries";
import type { ComplaintPublic } from "@/lib/domain/types";

type Props = {
  onPosted: (c: ComplaintPublic) => void;
};

function intensityLabel(n: number) {
  if (n <= 3) return "Molestia leve";
  if (n <= 6) return "Indignación seria";
  if (n <= 8) return "Furia alta";
  return "Furia total / estafa";
}

const PLACEHOLDER_QUEJA =
  "Contanos qué falló en el servicio (Recordá: No nombres de personas, solo la marca)";

type ChallengePayload = {
  a: number;
  b: number;
  expiresAt: number;
  nonce: string;
  signature: string;
};

export function VentBox({ onPosted }: Props) {
  const [text, setText] = useState("");
  const [company, setCompany] = useState("");
  const [countryCode, setCountryCode] = useState("AR");
  const [intensity, setIntensity] = useState(5);
  const [manifestAccepted, setManifestAccepted] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noiseNotice, setNoiseNotice] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [fingerprint, setFingerprint] = useState("");
  const [challenge, setChallenge] = useState<ChallengePayload | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [challengeError, setChallengeError] = useState<string | null>(null);

  const loadChallenge = useCallback(async () => {
    setChallengeError(null);
    try {
      const res = await fetch("/api/complaints/challenge");
      if (!res.ok) {
        setChallengeError("No se pudo cargar la verificación.");
        return;
      }
      const data = (await res.json()) as ChallengePayload;
      setChallenge(data);
      setChallengeAnswer("");
    } catch {
      setChallengeError("No se pudo cargar la verificación.");
    }
  }, []);

  useEffect(() => {
    void loadChallenge();
  }, [loadChallenge]);

  useEffect(() => {
    setCountryCode(guessCountryFromLocale(navigator.language));
  }, []);

  useEffect(() => {
    try {
      let v = sessionStorage.getItem("muro_fp");
      if (!v) {
        v = crypto.randomUUID();
        sessionStorage.setItem("muro_fp", v);
      }
      setFingerprint(v);
    } catch {
      setFingerprint("na");
    }
  }, []);

  useEffect(() => {
    const q = company.trim();
    const t = setTimeout(async () => {
      const res = await fetch(
        `/api/companies/suggest?q=${encodeURIComponent(q)}&country=${encodeURIComponent(countryCode)}`,
      );
      const data = (await res.json()) as { items?: string[] };
      setSuggestions(data.items ?? []);
    }, 180);
    return () => clearTimeout(t);
  }, [company, countryCode]);

  const sliderStyle = useMemo((): CSSProperties => {
    return {
      background: `linear-gradient(to right, #E5FF00 0%, #FF3B30 100%)`,
      accentColor: intensity > 7 ? "#FF3B30" : "#E5FF00",
    };
  }, [intensity]);

  const triggerShake = useCallback(() => {
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNoiseNotice(null);
    if (!manifestAccepted) {
      setError("Tenés que marcar el compromiso con las reglas de la casa.");
      return;
    }
    if (!challenge) {
      setError("Esperá a que cargue la verificación humana o tocá «Nuevo número».");
      return;
    }
    const answerNum = Number(challengeAnswer.trim());
    if (!Number.isFinite(answerNum)) {
      setError("Completá la verificación: ¿cuánto da la suma?");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: countryCode,
          company,
          text,
          intensity,
          manifestAccepted: true,
          fingerprint: fingerprint || undefined,
          website: honeypot,
          challenge: {
            answer: answerNum,
            a: challenge.a,
            b: challenge.b,
            expiresAt: challenge.expiresAt,
            nonce: challenge.nonce,
            signature: challenge.signature,
          },
        }),
      });
      const data = (await res.json()) as ComplaintPublic & { error?: string };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Error al enviar");
        void loadChallenge();
        return;
      }
      if (data.noise) {
        setNoiseNotice(
          "Patrón de uso anómalo: esta entrada se guardó como ruido y no aparece en el listado público ni en reportes de datos.",
        );
        triggerShake();
        setText("");
        setCompany("");
        setIntensity(5);
        setManifestAccepted(false);
        void loadChallenge();
        return;
      }
      triggerShake();
      onPosted(data);
      setText("");
      setCompany("");
      setIntensity(5);
      setManifestAccepted(false);
      setHoneypot("");
      void loadChallenge();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="vent-title"
      className="border-2 border-white bg-[#0A0A0A] p-4 shadow-[6px_6px_0_0_#ffffff] sm:p-6"
    >
      <h2
        id="vent-title"
        className="font-[family-name:var(--font-archivo)] text-2xl uppercase leading-none tracking-tight text-white sm:text-3xl"
      >
        Caja de ventilación
      </h2>
      <p className="mt-2 font-mono text-sm text-white/70">
        Sin registros, totalmente anónimo, un desahogo libre
      </p>

      <form
        onSubmit={handleSubmit}
        className="relative mt-6 flex flex-col gap-5"
      >
        <div
          className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="vent-website-hp">No completar</label>
          <input
            id="vent-website-hp"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#E5FF00]">
            País (mercado de la marca)
          </span>
          <select
            name="country"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="cursor-pointer border-2 border-white bg-black px-3 py-3 font-mono text-sm text-white focus:border-[#FF3B30] focus:outline-none"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.code})
              </option>
            ))}
          </select>
          <span className="font-mono text-[11px] leading-snug text-white/45">
            Si la marca opera en varios países, elegí dónde te pasó: el ranking y
            las sugerencias se separan por mercado.
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#E5FF00]">
            ¿Quién fue?
          </span>
          <input
            list="company-suggestions"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Nombre de la empresa o servicio"
            className="border-2 border-white bg-black px-3 py-3 font-mono text-sm text-white placeholder:text-white/35 focus:border-[#FF3B30] focus:outline-none"
            autoComplete="off"
          />
          <datalist id="company-suggestions">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#E5FF00]">
            Tu queja
          </span>
          <textarea
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER_QUEJA}
            rows={5}
            className="resize-y border-2 border-white bg-black px-3 py-3 font-mono text-sm text-white placeholder:text-white/35 focus:border-[#FF3B30] focus:outline-none"
          />
        </label>

        <div className="border-2 border-white/25 bg-black px-3 py-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <label className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#E5FF00]">
                Verificación humana
              </span>
              <span className="font-mono text-sm text-white/80">
                ¿Cuánto es{" "}
                <strong className="text-white">
                  {challenge ? `${challenge.a} + ${challenge.b}` : "— + —"}
                </strong>
                ?
              </span>
              <input
                type="text"
                inputMode="numeric"
                name="challengeAnswer"
                value={challengeAnswer}
                onChange={(e) => setChallengeAnswer(e.target.value)}
                placeholder="Resultado"
                className="max-w-[140px] border-2 border-white bg-black px-2 py-2 font-mono text-sm text-white placeholder:text-white/35 focus:border-[#E5FF00] focus:outline-none"
                autoComplete="off"
              />
            </label>
            <button
              type="button"
              onClick={() => void loadChallenge()}
              className="shrink-0 border-2 border-white/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white/70 hover:border-white hover:text-white"
            >
              Nuevo número
            </button>
          </div>
          {challengeError ? (
            <p className="mt-2 font-mono text-xs text-[#FF3B30]">{challengeError}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#E5FF00]">
              Intensidad
            </span>
            <span className="font-mono text-sm text-[#FF3B30]">
              {intensity}/10 · {intensityLabel(intensity)}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="h-3 w-full cursor-pointer appearance-none rounded-none border-2 border-white accent-[#E5FF00]"
            style={sliderStyle}
          />
        </div>

        <div className="border-2 border-white/30 bg-black px-3 py-3">
          <label className="flex cursor-pointer items-start gap-3 font-mono text-xs leading-snug text-white/90">
            <input
              type="checkbox"
              name="manifestAccepted"
              checked={manifestAccepted}
              onChange={(e) => {
                setManifestAccepted(e.target.checked);
                if (e.target.checked) setError(null);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer border-2 border-[#E5FF00] accent-[#E5FF00]"
            />
            <span>
              Entiendo que esto es contra la marca y no contiene ataques a
              personas reales.
            </span>
          </label>
        </div>

        {error ? (
          <p className="border-2 border-[#FF3B30] bg-black px-3 py-2 font-mono text-sm text-[#FF3B30]">
            {error}
          </p>
        ) : null}

        {noiseNotice ? (
          <p
            role="status"
            className="border-2 border-[#E5FF00] bg-black px-3 py-2 font-mono text-sm text-[#E5FF00]"
          >
            {noiseNotice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !manifestAccepted || !challenge}
          className={`font-[family-name:var(--font-archivo)] border-2 border-black bg-[#E5FF00] px-4 py-4 text-lg uppercase tracking-wide text-black shadow-[6px_6px_0_0_#ffffff] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#ffffff] disabled:cursor-not-allowed disabled:opacity-40 ${shake ? "animate-vent-shake" : ""}`}
        >
          {loading ? "Soltando…" : "Soltar veneno"}
        </button>
      </form>
    </section>
  );
}

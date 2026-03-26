"use client";

import { useEffect, useState } from "react";
import { countryLabel } from "@/lib/domain/countries";
import type { WallEntry } from "@/lib/domain/types";

function TrendIcon({ trend }: { trend: WallEntry["trend"] }) {
  if (trend === "up") return <span title="Sube">⬆️</span>;
  if (trend === "down") return <span title="Baja">⬇️</span>;
  if (trend === "new") return <span title="Nuevo en el top">🆕</span>;
  return <span title="Estable">➡️</span>;
}

type Props = {
  refreshToken: number;
};

export function WallOfShame({ refreshToken }: Props) {
  const [items, setItems] = useState<WallEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetch("/api/wall");
      const data = (await res.json()) as { items: WallEntry[] };
      if (cancelled) return;
      setItems(data.items ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  return (
    <aside
      aria-labelledby="wall-title"
      className="border-2 border-[#FF3B30] bg-black p-4 shadow-[6px_6px_0_0_#FF3B30]"
    >
      <h2
        id="wall-title"
        className="font-[family-name:var(--font-archivo)] text-xl uppercase leading-none text-[#FF3B30] sm:text-2xl"
      >
        Top del colectivo
      </h2>
      <p className="mt-2 font-mono text-xs text-white/60">
        Top 10 · Score de odio = quejas×10 + suma de intensidad
      </p>

      {loading ? (
        <p className="mt-4 font-mono text-sm text-white/60">Calculando odio…</p>
      ) : (
        <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 font-mono text-sm text-white">
          {items.map((row) => (
            <li key={row.company} className="marker:text-[#E5FF00]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-[family-name:var(--font-archivo)] text-base uppercase text-white">
                  {row.rank}. {row.company}{" "}
                  <span className="font-mono text-[10px] font-normal normal-case text-white/50">
                    ({countryLabel(row.countryCode) ?? row.countryCode})
                  </span>
                </span>
                <span className="text-[#FF3B30]">{row.hateScore}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-white/55">
                <span>{row.complaintCount} quejas</span>
                <TrendIcon trend={row.trend} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

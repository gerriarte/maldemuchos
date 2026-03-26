"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { ComplaintPublic } from "@/lib/domain/types";
import { ComplaintCard } from "@/components/ComplaintCard";

export type ComplaintFeedHandle = {
  prependComplaint: (c: ComplaintPublic) => void;
};

export const ComplaintFeed = forwardRef<ComplaintFeedHandle>(function ComplaintFeed(
  _,
  ref,
) {
  const [items, setItems] = useState<ComplaintPublic[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const prependComplaint = useCallback((c: ComplaintPublic) => {
    setItems((prev) => {
      const list = prev ?? [];
      if (list.some((p) => p.id === c.id)) return list;
      return [c, ...list];
    });
  }, []);

  useImperativeHandle(ref, () => ({ prependComplaint }), [prependComplaint]);

  const loadPage = useCallback(async (cursor?: string | null) => {
    const fail = () =>
      ({
        items: [] as ComplaintPublic[],
        nextCursor: null as string | null,
        failed: true as const,
      }) as const;

    try {
      const params = new URLSearchParams({ limit: "10" });
      if (cursor) params.set("cursor", cursor);
      const res = await fetch(`/api/complaints?${params.toString()}`);
      const data = (await res.json()) as {
        items?: ComplaintPublic[];
        nextCursor?: string | null;
        error?: string;
      };
      if (!res.ok || !Array.isArray(data.items)) {
        return fail();
      }
      return {
        items: data.items,
        nextCursor: data.nextCursor ?? null,
        failed: false as const,
      };
    } catch {
      return fail();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      const data = await loadPage();
      if (cancelled) return;
      setItems(data.items);
      setNextCursor(data.nextCursor);
      setLoadError(data.failed ? "No se pudo cargar el chismógrafo. Reintentá." : null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting || loading || loadingMore || !nextCursor) return;
        setLoadingMore(true);
        loadPage(nextCursor).then((data) => {
          if (!data.failed && Array.isArray(data.items)) {
            setItems((prev) => {
              const safe = prev ?? [];
              const ids = new Set(safe.map((p) => p.id));
              const merged = [...safe];
              for (const it of data.items) {
                if (!ids.has(it.id)) merged.push(it);
              }
              return merged;
            });
            setNextCursor(data.nextCursor);
          }
          setLoadingMore(false);
        });
      },
      { rootMargin: "240px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadPage, loading, loadingMore, nextCursor]);

  function handleUpdate(updated: ComplaintPublic) {
    setItems((prev) => (prev ?? []).map((p) => (p.id === updated.id ? updated : p)));
  }

  return (
    <section aria-labelledby="feed-title" className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <h2
          id="feed-title"
          className="font-[family-name:var(--font-archivo)] text-2xl uppercase leading-none text-white sm:text-3xl"
        >
          Chismógrafo
        </h2>
        <span className="font-mono text-xs text-[#E5FF00]">En vivo</span>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-white/60">Cargando veneno…</p>
      ) : null}

      {loadError ? (
        <p className="border-2 border-[#FF3B30] bg-black px-3 py-2 font-mono text-sm text-[#FF3B30]">
          {loadError}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        {(items ?? []).map((c) => (
          <ComplaintCard key={c.id} complaint={c} onUpdate={handleUpdate} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4 w-full" aria-hidden />

      {loadingMore ? (
        <p className="font-mono text-xs text-white/50">Más historias…</p>
      ) : null}
      {!loading && !nextCursor && items.length > 0 ? (
        <p className="font-mono text-xs text-white/40">Fin del feed (por ahora).</p>
      ) : null}
    </section>
  );
});

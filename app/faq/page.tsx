import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/config/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "FAQ — Quejas anónimas y reglas | Mal de Muchos",
  description:
    "Respuestas rápidas sobre cómo publicar quejas anónimas, qué contenido está permitido y cómo se usa la información en Mal de Muchos.",
  alternates: {
    canonical: "/faq",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo publicar una queja anónima?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Completá empresa, país, texto e intensidad en el formulario principal y enviá. No se requiere registro.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué contenido está prohibido?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No se permiten nombres de personas, datos sensibles, campañas coordinadas ni ataques a individuos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se usa la información publicada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La plataforma anonimiza y agrega los datos para análisis de tendencias de servicio y reportes de experiencia del cliente.",
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <article className="mx-auto w-full max-w-none px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <p className="font-mono text-xs uppercase tracking-widest text-[#E5FF00]">
        Ayuda · respuestas breves
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-archivo)] text-3xl uppercase leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">
        FAQ de Mal de Muchos
      </h1>
      <p className="mt-3 max-w-4xl font-mono text-sm leading-relaxed text-white/80">
        Esta guía responde las dudas más comunes sobre quejas anónimas, reglas de
        publicación y uso de datos en la plataforma.
      </p>

      <div className="mt-10 max-w-4xl space-y-8 font-mono text-sm leading-relaxed text-white/85">
        <section>
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            ¿Cómo publicar una queja anónima?
          </h2>
          <p className="mt-2 text-white/80">
            Usá la caja de ventilación en la home: indicá empresa, país donde pasó
            el problema, texto e intensidad. No hay registro obligatorio.
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            ¿Qué contenido está prohibido?
          </h2>
          <p className="mt-2 text-white/80">
            No se aceptan nombres de personas, datos sensibles, doxxing, spam ni
            ataques dirigidos a individuos.
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            ¿Cómo funciona el ranking de empresas?
          </h2>
          <p className="mt-2 text-white/80">
            El ranking se ordena por volumen e intensidad de quejas, para detectar
            patrones de fricción de servicio por marca y mercado.
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            ¿Cómo usan mis datos?
          </h2>
          <p className="mt-2 text-white/80">
            Se procesan de forma agregada y anonimizada para estadísticas y reportes
            de experiencia de cliente.
          </p>
        </section>
      </div>

      <p className="mt-12 font-mono text-sm">
        <Link
          href="/"
          className="text-[#E5FF00] underline decoration-[#E5FF00]/40 underline-offset-4 hover:text-white"
        >
          ← Volver al inicio
        </Link>
      </p>
      <p className="mt-3 font-mono text-xs text-white/45">
        Fuente oficial: <span>{siteUrl}</span>
      </p>
    </article>
  );
}

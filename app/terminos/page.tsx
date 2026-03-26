import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones — Mal de Muchos",
  description:
    "Aviso legal, uso de datos y reglas de la plataforma. Versión legible.",
};

export default function TerminosPage() {
  return (
    <article className="mx-auto w-full max-w-none px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <p className="font-mono text-xs uppercase tracking-widest text-[#E5FF00]">
        Legal · versión humana
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-archivo)] text-3xl uppercase leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">
        Términos y condiciones
      </h1>
      <p className="mt-2 font-mono text-sm text-[#FF3B30]">
        Aviso legal y reglas de juego
      </p>

      <div className="mt-10 max-w-4xl space-y-8 font-mono text-sm leading-relaxed text-white/85">
        <p>
          Al usar esta plataforma para &quot;soltar el veneno&quot;, aceptás que
          este es un espacio de{" "}
          <strong className="text-white">análisis de experiencia de usuario</strong>{" "}
          y no un foro de difamación. Para proteger la integridad de la data y la
          comunidad, rigen los siguientes puntos:
        </p>

        <section className="border-l-4 border-[#E5FF00] pl-4">
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            Responsabilidad del contenido
          </h2>
          <p className="mt-2 text-white/80">
            Vos sos el único responsable de lo que publicás. Nuestra plataforma
            actúa exclusivamente como un canal de recolección de experiencias con
            marcas.
          </p>
        </section>

        <section className="border-l-4 border-[#FF3B30] pl-4">
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            Prohibición de ataques personales
          </h2>
          <p className="mt-2 text-white/80">
            Está estrictamente prohibido mencionar nombres propios de empleados,
            contratistas o individuos. Las quejas deben dirigirse a la persona
            jurídica (la marca) y sus procesos. Cualquier mención a personas
            físicas será eliminada sin previo aviso mediante nuestros filtros de
            IA.
          </p>
        </section>

        <section className="border-l-4 border-[#E5FF00] pl-4">
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            Uso de datos (la &quot;letra chica&quot; importante)
          </h2>
          <p className="mt-2 text-white/80">
            Al publicar, otorgás a la plataforma el derecho no exclusivo de
            anonimizar, procesar y utilizar tu queja como parte de estudios de
            mercado, reportes estadísticos y análisis de tendencias de consumo.
            Nunca venderemos tu identidad, pero sí el &quot;dolor&quot; que
            reportaste.
          </p>
        </section>

        <section className="border-l-4 border-white/40 pl-4">
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            Veracidad
          </h2>
          <p className="mt-2 text-white/80">
            Te comprometés a reportar experiencias reales. El uso de la
            plataforma para campañas coordinadas de desprestigio o ataques de
            competencia desleal resultará en el baneo permanente de tu IP.
          </p>
        </section>

        <section className="border-l-4 border-[#FF3B30] pl-4">
          <h2 className="font-[family-name:var(--font-archivo)] text-lg uppercase text-white">
            No somos ente regulador
          </h2>
          <p className="mt-2 text-white/80">
            No somos la SIC ni una entidad gubernamental. No garantizamos que la
            marca te responda o solucione tu problema; somos tu megáfono y tu
            fuente de data, no tu abogado.
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
    </article>
  );
}

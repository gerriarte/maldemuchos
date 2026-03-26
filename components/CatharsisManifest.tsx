type Props = {
  variant?: "default" | "sidebar";
};

export function CatharsisManifest({ variant = "default" }: Props) {
  const isSidebar = variant === "sidebar";

  return (
    <section
      aria-labelledby="manifest-title"
      className={`border-2 border-[#E5FF00] bg-black shadow-[6px_6px_0_0_#E5FF00] ${
        isSidebar ? "p-3 sm:p-4" : "p-4 sm:p-6"
      }`}
    >
      <h2
        id="manifest-title"
        className={`font-[family-name:var(--font-archivo)] uppercase leading-tight tracking-tight text-white ${
          isSidebar ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
        }`}
      >
        Reglas de la casa{" "}
        <span className="text-[#FF3B30]">(Leelas o no publiques)</span>
      </h2>

      <p
        className={`mt-3 font-mono leading-relaxed text-white/80 ${
          isSidebar ? "text-xs sm:text-sm" : "mt-4 text-sm"
        }`}
      >
        En este espacio, el veneno se suelta con inteligencia. Queremos mejorar el
        mercado, no destruir personas. Para que tu queja sea pública y tenga
        impacto, aceptás estas reglas:
      </p>

      <ol
        className={`mt-4 flex list-none flex-col pl-0 font-mono leading-relaxed text-white/90 ${
          isSidebar ? "gap-4 text-xs sm:text-sm" : "mt-6 gap-5 text-sm"
        }`}
      >
        <li className="flex gap-2 sm:gap-3">
          <span
            className={`shrink-0 font-[family-name:var(--font-archivo)] leading-none text-[#E5FF00] ${
              isSidebar ? "text-base" : "text-lg"
            }`}
            aria-hidden
          >
            1.
          </span>
          <div>
            <p
              className={`font-[family-name:var(--font-archivo)] uppercase tracking-wide text-white ${
                isSidebar ? "text-xs sm:text-sm" : "text-sm"
              }`}
            >
              Marcas, no personas
            </p>
            <p className="mt-1 text-white/75">
              El foco es la ineficiencia de la empresa, el fallo del producto o
              el desastre del servicio. No permitimos nombres propios de
              empleados, descripciones físicas ni ataques personales. El culpable
              es el proceso, no el cajero.
            </p>
          </div>
        </li>

        <li className="flex gap-2 sm:gap-3">
          <span
            className={`shrink-0 font-[family-name:var(--font-archivo)] leading-none text-[#E5FF00] ${
              isSidebar ? "text-base" : "text-lg"
            }`}
            aria-hidden
          >
            2.
          </span>
          <div>
            <p
              className={`font-[family-name:var(--font-archivo)] uppercase tracking-wide text-white ${
                isSidebar ? "text-xs sm:text-sm" : "text-sm"
              }`}
            >
              Sin datos sensibles
            </p>
            <p className="mt-1 text-white/75">
              No publiques números de documento, teléfonos o direcciones.
              Cuidamos tu privacidad y la de los demás.
            </p>
          </div>
        </li>

        <li className="flex gap-2 sm:gap-3">
          <span
            className={`shrink-0 font-[family-name:var(--font-archivo)] leading-none text-[#E5FF00] ${
              isSidebar ? "text-base" : "text-lg"
            }`}
            aria-hidden
          >
            3.
          </span>
          <div>
            <p
              className={`font-[family-name:var(--font-archivo)] uppercase tracking-wide text-white ${
                isSidebar ? "text-xs sm:text-sm" : "text-sm"
              }`}
            >
              Crítica constructiva (aunque sea con furia)
            </p>
            <p className="mt-1 text-white/75">
              Describí el fallo. Si decís &quot;X empresa es una basura&quot;, no
              nos sirve. Si decís &quot;X empresa me cobró doble y no me responde
              hace 4 días&quot;, eso es data poderosa.
            </p>
          </div>
        </li>

        <li className="flex gap-2 sm:gap-3">
          <span
            className={`shrink-0 font-[family-name:var(--font-archivo)] leading-none text-[#E5FF00] ${
              isSidebar ? "text-base" : "text-lg"
            }`}
            aria-hidden
          >
            4.
          </span>
          <div>
            <p
              className={`font-[family-name:var(--font-archivo)] uppercase tracking-wide text-white ${
                isSidebar ? "text-xs sm:text-sm" : "text-sm"
              }`}
            >
              Moderación quirúrgica
            </p>
            <p className="mt-1 text-white/75">
              Nuestra IA detecta nombres propios y lenguaje abusivo personal. Si
              intentás atacar a un individuo, tu queja será enviada al limbo
              automáticamente.
            </p>
          </div>
        </li>
      </ol>

      <p
        className={`border-l-4 border-[#FF3B30] pl-3 font-mono leading-relaxed text-white/65 sm:pl-4 ${
          isSidebar ? "mt-4 text-[10px] sm:text-xs" : "mt-6 text-xs"
        }`}
      >
        <span className="text-[#E5FF00]">Nota:</span> Somos el megáfono de tu
        frustración con el sistema, no una herramienta de acoso. Mantenelo
        profesional, mantenelo real.
      </p>
    </section>
  );
}

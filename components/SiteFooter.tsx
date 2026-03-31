import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-2 border-white/20 bg-black/40 px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <nav className="font-mono text-sm">
        <Link
          href="/faq"
          className="text-white/90 underline decoration-white/30 underline-offset-4 hover:text-white"
        >
          FAQ
        </Link>
        <span className="text-white/35"> · </span>
        <Link
          href="/terminos"
          className="text-[#E5FF00] underline decoration-[#E5FF00]/40 underline-offset-4 hover:text-white hover:decoration-white"
        >
          Términos y condiciones
        </Link>
        <span className="text-white/35"> · </span>
        <Link
          href="/"
          className="text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white"
        >
          Inicio
        </Link>
      </nav>
    </footer>
  );
}

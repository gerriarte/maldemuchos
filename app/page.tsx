import { HomeShell } from "@/components/HomeShell";
import { getSiteUrl } from "@/lib/config/site";

const siteUrl = getSiteUrl();

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo publicar una queja anónima?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Completá empresa, país, texto e intensidad en la caja de ventilación. No se pide registro.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo mencionar personas en mi reclamo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Las publicaciones deben apuntar a la marca o al servicio, nunca a individuos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Para qué sirve el ranking de empresas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El ranking ordena empresas por volumen e intensidad de quejas para visibilizar patrones de mala experiencia.",
      },
    },
  ],
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mal de Muchos",
  url: siteUrl,
  inLanguage: "es",
};

export default function Home() {
  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <HomeShell />
    </main>
  );
}

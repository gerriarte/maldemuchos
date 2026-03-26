import type { Metadata } from "next";
import { Archivo_Black, Space_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Mal de Muchos — Quejas anónimas",
  description:
    "Denunciá y compartí frustraciones con empresas y servicios. Sin registro. Catarsis colectiva.",
  openGraph: {
    title: "Mal de Muchos",
    description: "Red social de desahogo. El chisme en vivo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full bg-[#0A0A0A] font-mono text-white antialiased">
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

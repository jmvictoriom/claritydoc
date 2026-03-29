import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClarityDoc - Analiza tu contrato antes de firmar",
  description:
    "Analiza contratos de alquiler con IA. Detecta clausulas peligrosas, abusivas o ausentes con un sistema de semaforo. Basado en la legislacion espanola vigente.",
  openGraph: {
    title: "ClarityDoc - Analiza tu contrato antes de firmar",
    description:
      "Detecta clausulas peligrosas en tu contrato de alquiler con IA.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

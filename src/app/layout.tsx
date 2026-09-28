import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Cabecalho } from "@/components/layout/Cabecalho";
import { Rodape } from "@/components/layout/Rodape";
import { urlBase } from "@/lib/share";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(urlBase()),
  title: { default: "Eleitor Livre — conheça quem quer ser reeleito", template: "%s · Eleitor Livre" },
  description:
    "Veja, de um jeito simples, a trajetória de quem está tentando a reeleição: vitórias, derrotas, bens e dinheiro de campanha, com dados oficiais do TSE.",
  applicationName: "Eleitor Livre",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Eleitor Livre" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8fa",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:p-2">
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <main id="conteudo" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10">
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  );
}

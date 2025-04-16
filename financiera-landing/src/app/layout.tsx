import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from '@/lib/registry';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinBank - Soluciones financieras digitales",
  description: "Descubre nuestros productos financieros diseñados para ayudarte a alcanzar tus metas. Seguridad, innovación y atención personalizada en cada etapa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

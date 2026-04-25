import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmaciaAdmin - Sistema de Gestión",
  description: "Sistema de administración de farmacia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}

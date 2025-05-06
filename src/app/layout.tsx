import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Çorap Üretim Yönetim Sistemi",
  description: "Çorap üretim süreçleri için yönetim panelidir",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beacons | Tìm Người Thân Thất Lạc",
  description: "Hệ thống AI nhận diện khuôn mặt hỗ trợ tìm kiếm người mất tích và thất lạc gia đình với độ chính xác cao.",
  keywords: ["tìm người thân", "người mất tích", "nhận diện khuôn mặt", "AI tìm người"],
  openGraph: {
    title: "Beacons | Thắp sáng niềm tin, mang người thân trở về",
    description: "Hệ thống AI nhận diện khuôn mặt hỗ trợ tìm kiếm người mất tích và thất lạc gia đình.",
    url: "https://beacons.vn",
    siteName: "Beacons",
    images: [
      {
        url: "https://beacons.vn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Beacons Tìm Người Thân",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

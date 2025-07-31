import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/css/globals.css";
import "@/styles/scss/globals.scss";
import NavigationBar from "./(ui)/navigation-bar";
import Footer from "./(ui)/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//? MetaData | Next.js
export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "KONOHA PROJECT",
    template: "%s | KONOHA PROJECT",
  },
  description: "Creator, Developer & Artist",
  openGraph: {
    title: "KONOHA PROJECT",
    description: "Creator, Developer & Artist",
    url: "http://localhost:3000",
    siteName: "KONOHA PROJECT",
    locale: "en_UK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavigationBar />
        <div style={{ viewTransitionName: "page" }}>
          {children}
          <Footer />
        </div>
        <SpeedInsights/>
      </body>
    </html>
  );
}

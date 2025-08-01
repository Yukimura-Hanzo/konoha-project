//? NEXT
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
//? GOOGLE FONTS
import { Geist, Geist_Mono } from "next/font/google";
//? STYLESHEET
import "@/styles/css/globals.css";
import "@/styles/scss/globals.scss";
//? UI
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

//? METADATA
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

//? GLOBAL LAYOUT
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
        {/* Navigation bar */}
        <NavigationBar />
        {/* Index layout */}
        <div style={{ viewTransitionName: "page" }}>
          {children}
          {/* Footer */}
          <Footer />
        </div>
        {/* Next.js Analytics & Insights */}
        <SpeedInsights/>
        <Analytics />
      </body>
    </html>
  );
}

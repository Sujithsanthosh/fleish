import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { GestureProvider } from "@/components/GestureProvider";
import { GestureControls } from "@/components/GestureControls";
import { VoiceCommandUI } from "@/components/VoiceCommandUI";

export const metadata: Metadata = {
  title: "Fleish — Fresh Meat. Smarter Delivery. One Unified System.",
  description: "India's most advanced hyperlocal meat delivery platform. Connecting customers, vendors, and delivery partners through cutting-edge technology for the fastest, freshest deliveries.",
  keywords: ["meat delivery", "hyperlocal", "fresh meat", "delivery platform", "vendor partner"],
  openGraph: {
    title: "Fleish — Fresh Meat. Smarter Delivery.",
    description: "India's most advanced hyperlocal meat delivery ecosystem.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script>
      </head>
      <body className="antialiased">
        <GestureProvider>
          <ToastProvider>
            {children}
            <GestureControls />
            <VoiceCommandUI />
          </ToastProvider>
        </GestureProvider>
      </body>
    </html>
  );
}

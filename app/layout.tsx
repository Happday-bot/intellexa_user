import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "./context/AuthContext";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "600", "700"], variable: "--font-jakarta" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Intellexa REC | Innovate. Impact. Inspire.",
  description: "The premier technical club of Rajalakshmi Engineering College.",
};

import { GridBackground } from "@/app/components/layout/GridBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(jakarta.variable, inter.variable, "antialiased bg-bg-dark text-text-main font-sans overflow-x-hidden selection:bg-accent/30")} suppressHydrationWarning>
        <GridBackground />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

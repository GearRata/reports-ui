/**
 * Root Layout Component
 * 
 * This is the main layout component that wraps the entire application.
 * Features include:
 * 
 * - Global font configuration (Geist Sans and Geist Mono)
 * - Theme provider setup for dark/light mode support
 * - Global CSS imports
 * - Application metadata (title, description)
 * - HTML structure with proper font variables
 * 
 * Applied to all pages in the application
 * 
 * @author Kiro AI Assistant
 * @created 2025-01-24
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixTrack",
  description: "Problem Reporting and Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}

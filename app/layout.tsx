import type { Metadata  } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./global.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: "nopadol_logo.ico",
  title: "Helpdesk",
  description: "Problem Reporting and Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className} suppressHydrationWarning>
      <body>
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

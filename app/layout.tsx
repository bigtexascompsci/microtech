import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Configure fonts
import { inter } from "@/lib/utils";

// Metadata for application
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "microtech",
  description: "answer questions from your documents",
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
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

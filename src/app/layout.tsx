import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ConfigurationProvider } from "@/providers/ConfigurationProvider";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastContainer } from "react-toastify";

const manropeHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matter",
  description: "Focus on what matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "dark",
        "antialiased",
        plusJakartaSans.variable,
        "font-sans",
        inter.variable,
        manropeHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ConfigurationProvider>
          <QueryProvider>{children}</QueryProvider>
          <ToastContainer theme="dark" position="bottom-right" />
        </ConfigurationProvider>
      </body>
    </html>
  );
}

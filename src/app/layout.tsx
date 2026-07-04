import type { Metadata } from "next";
import "./globals.css";

//import Web3Provider from "@/components/providers/Web3Provider";
import { ToastProvider } from "@/components/ui/toast-provider";

export const metadata: Metadata = {
  title: "HOODIE",
  description:
    "Born from different hoods. Bound by one Brotherhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
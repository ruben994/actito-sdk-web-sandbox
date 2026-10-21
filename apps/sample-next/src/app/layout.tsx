import { Toaster } from "sonner";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SerwistProvider } from "./serwist";
import { GoogleMapsBootstrap } from "@/components/google-maps-bootstrap";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sample app",
  description: "Sample app used for testing the Actito web libraries.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-50 dark:bg-neutral-950">
      <body className="h-full">
        <SerwistProvider
          swUrl="/serwist/sw.js"
          register={false}
          cacheOnNavigation={false}
          reloadOnOnline={false}
        >
          <Toaster position="bottom-right" offset={32} mobileOffset={44} />
          <main>
            {children}

            <GoogleMapsBootstrap />
          </main>
        </SerwistProvider>
      </body>
    </html>
  );
}

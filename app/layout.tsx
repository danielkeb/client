import type { Metadata } from "next";
import { StrictMode } from "react";
import Providers from "./Providers";
import "./globals.css";
import AlertsProvider from "./lib/contexts/AlertContext";
import AppContext from "./lib/contexts/AppContext";

export const metadata: Metadata = {
  title: "VolunteerLink",
  description: "Empowering communities thorough volunteering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StrictMode>
      <html lang="en" className="bg-base-200/40" suppressHydrationWarning>
        <body>
          <AlertsProvider>
            {/* Theme provider for next-themes */}
            <Providers>
              <AppContext>{children}</AppContext>
            </Providers>
          </AlertsProvider>
        </body>
      </html>
    </StrictMode>
  );
}

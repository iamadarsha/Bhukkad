"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ThemeInitializer } from "@/components/ui/theme-initializer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
        <ThemeInitializer />
        {children}
        <Toaster
          position="bottom-center"
          richColors
          toastOptions={{
            style: {
              borderRadius: "var(--md-sys-shape-corner-extra-small)",
              background: "var(--md-sys-color-inverse-surface)",
              color: "var(--md-sys-color-inverse-on-surface)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}

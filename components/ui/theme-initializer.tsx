"use client";

import { useEffect } from "react";
import { initTheme } from "@/lib/theme/material-theme";

/**
 * Initializes MD3 dynamic color tokens on mount.
 * Place this inside the root layout, inside ThemeProvider.
 */
export function ThemeInitializer() {
  useEffect(() => {
    initTheme();
  }, []);

  return null;
}

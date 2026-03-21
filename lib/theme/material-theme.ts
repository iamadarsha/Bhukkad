"use client";

import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme as mcuApplyTheme,
  hexFromArgb,
  TonalPalette,
  Hct,
} from "@material/material-color-utilities";

// Brand seed color — saffron orange
export const BRAND_SEED = "#FF6B35";

export interface MD3ColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  surface: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  scrim: string;
}

function toHex(argb: number): string {
  return hexFromArgb(argb);
}

export function generateScheme(seedHex: string, isDark: boolean): MD3ColorScheme {
  const argb = argbFromHex(seedHex);
  const theme = themeFromSourceColor(argb);
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;

  // Access tonal palettes for surface variants
  const neutralPalette = theme.palettes.neutral;
  const neutralVariantPalette = theme.palettes.neutralVariant;

  if (isDark) {
    return {
      primary: toHex(scheme.primary),
      onPrimary: toHex(scheme.onPrimary),
      primaryContainer: toHex(scheme.primaryContainer),
      onPrimaryContainer: toHex(scheme.onPrimaryContainer),
      secondary: toHex(scheme.secondary),
      onSecondary: toHex(scheme.onSecondary),
      secondaryContainer: toHex(scheme.secondaryContainer),
      onSecondaryContainer: toHex(scheme.onSecondaryContainer),
      tertiary: toHex(scheme.tertiary),
      onTertiary: toHex(scheme.onTertiary),
      tertiaryContainer: toHex(scheme.tertiaryContainer),
      onTertiaryContainer: toHex(scheme.onTertiaryContainer),
      error: "#F2B8B5",
      onError: "#601410",
      errorContainer: "#8C1D18",
      onErrorContainer: "#F9DEDC",
      surface: toHex(neutralPalette.tone(6)),
      surfaceDim: toHex(neutralPalette.tone(6)),
      surfaceBright: toHex(neutralPalette.tone(24)),
      surfaceContainerLowest: toHex(neutralPalette.tone(4)),
      surfaceContainerLow: toHex(neutralPalette.tone(10)),
      surfaceContainer: toHex(neutralPalette.tone(12)),
      surfaceContainerHigh: toHex(neutralPalette.tone(17)),
      surfaceContainerHighest: toHex(neutralPalette.tone(22)),
      onSurface: toHex(neutralPalette.tone(90)),
      onSurfaceVariant: toHex(neutralVariantPalette.tone(80)),
      outline: toHex(neutralVariantPalette.tone(60)),
      outlineVariant: toHex(neutralVariantPalette.tone(30)),
      inverseSurface: toHex(neutralPalette.tone(90)),
      inverseOnSurface: toHex(neutralPalette.tone(20)),
      inversePrimary: toHex(scheme.inversePrimary),
      shadow: "#000000",
      scrim: "#000000",
    };
  }

  return {
    primary: toHex(scheme.primary),
    onPrimary: toHex(scheme.onPrimary),
    primaryContainer: toHex(scheme.primaryContainer),
    onPrimaryContainer: toHex(scheme.onPrimaryContainer),
    secondary: toHex(scheme.secondary),
    onSecondary: toHex(scheme.onSecondary),
    secondaryContainer: toHex(scheme.secondaryContainer),
    onSecondaryContainer: toHex(scheme.onSecondaryContainer),
    tertiary: toHex(scheme.tertiary),
    onTertiary: toHex(scheme.onTertiary),
    tertiaryContainer: toHex(scheme.tertiaryContainer),
    onTertiaryContainer: toHex(scheme.onTertiaryContainer),
    error: "#B3261E",
    onError: "#FFFFFF",
    errorContainer: "#F9DEDC",
    onErrorContainer: "#410E0B",
    surface: toHex(neutralPalette.tone(98)),
    surfaceDim: toHex(neutralPalette.tone(87)),
    surfaceBright: toHex(neutralPalette.tone(98)),
    surfaceContainerLowest: toHex(neutralPalette.tone(100)),
    surfaceContainerLow: toHex(neutralPalette.tone(96)),
    surfaceContainer: toHex(neutralPalette.tone(94)),
    surfaceContainerHigh: toHex(neutralPalette.tone(92)),
    surfaceContainerHighest: toHex(neutralPalette.tone(90)),
    onSurface: toHex(neutralPalette.tone(10)),
    onSurfaceVariant: toHex(neutralVariantPalette.tone(30)),
    outline: toHex(neutralVariantPalette.tone(50)),
    outlineVariant: toHex(neutralVariantPalette.tone(80)),
    inverseSurface: toHex(neutralPalette.tone(20)),
    inverseOnSurface: toHex(neutralPalette.tone(95)),
    inversePrimary: toHex(scheme.inversePrimary),
    shadow: "#000000",
    scrim: "#000000",
  };
}

export function applyTheme(seedHex: string, isDark: boolean): void {
  if (typeof document === "undefined") return;

  const scheme = generateScheme(seedHex, isDark);
  const root = document.documentElement;

  const tokenMap: Record<string, string> = {
    "--md-sys-color-primary": scheme.primary,
    "--md-sys-color-on-primary": scheme.onPrimary,
    "--md-sys-color-primary-container": scheme.primaryContainer,
    "--md-sys-color-on-primary-container": scheme.onPrimaryContainer,
    "--md-sys-color-secondary": scheme.secondary,
    "--md-sys-color-on-secondary": scheme.onSecondary,
    "--md-sys-color-secondary-container": scheme.secondaryContainer,
    "--md-sys-color-on-secondary-container": scheme.onSecondaryContainer,
    "--md-sys-color-tertiary": scheme.tertiary,
    "--md-sys-color-on-tertiary": scheme.onTertiary,
    "--md-sys-color-tertiary-container": scheme.tertiaryContainer,
    "--md-sys-color-on-tertiary-container": scheme.onTertiaryContainer,
    "--md-sys-color-error": scheme.error,
    "--md-sys-color-on-error": scheme.onError,
    "--md-sys-color-error-container": scheme.errorContainer,
    "--md-sys-color-on-error-container": scheme.onErrorContainer,
    "--md-sys-color-surface": scheme.surface,
    "--md-sys-color-surface-dim": scheme.surfaceDim,
    "--md-sys-color-surface-bright": scheme.surfaceBright,
    "--md-sys-color-surface-container-lowest": scheme.surfaceContainerLowest,
    "--md-sys-color-surface-container-low": scheme.surfaceContainerLow,
    "--md-sys-color-surface-container": scheme.surfaceContainer,
    "--md-sys-color-surface-container-high": scheme.surfaceContainerHigh,
    "--md-sys-color-surface-container-highest": scheme.surfaceContainerHighest,
    "--md-sys-color-on-surface": scheme.onSurface,
    "--md-sys-color-on-surface-variant": scheme.onSurfaceVariant,
    "--md-sys-color-outline": scheme.outline,
    "--md-sys-color-outline-variant": scheme.outlineVariant,
    "--md-sys-color-inverse-surface": scheme.inverseSurface,
    "--md-sys-color-inverse-on-surface": scheme.inverseOnSurface,
    "--md-sys-color-inverse-primary": scheme.inversePrimary,
    "--md-sys-color-shadow": scheme.shadow,
    "--md-sys-color-scrim": scheme.scrim,
  };

  Object.entries(tokenMap).forEach(([token, value]) => {
    root.style.setProperty(token, value);
  });

  // Also update legacy color vars for backward compat
  root.style.setProperty("--primary", scheme.primary);
  root.style.setProperty("--primary-dark", scheme.primaryContainer);
  root.style.setProperty("--primary-light", scheme.primaryContainer);
  root.style.setProperty("--background", scheme.surface);
  root.style.setProperty("--surface", scheme.surfaceContainerLowest);
  root.style.setProperty("--border", scheme.outlineVariant);
  root.style.setProperty("--text-primary", scheme.onSurface);
  root.style.setProperty("--text-secondary", scheme.onSurfaceVariant);
  root.style.setProperty("--text-muted", scheme.outline);

  // Store seed for persistence
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("md3-seed-color", seedHex);
    localStorage.setItem("md3-dark-mode", isDark ? "1" : "0");
  }
}

export function initTheme(): void {
  if (typeof document === "undefined") return;
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("md3-seed-color") : null;
  const isDarkStored = typeof localStorage !== "undefined" ? localStorage.getItem("md3-dark-mode") : null;
  const isDark = isDarkStored === "1" || document.documentElement.getAttribute("data-theme") === "dark";
  applyTheme(stored ?? BRAND_SEED, isDark);
}

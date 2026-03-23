# Bhukkad Branding System

## Brand Intent
Bhukkad is a warm, high-energy restaurant operating system designed for busy floor teams, kitchen staff, and managers. The identity should feel:

- fast, confident, and service-oriented
- warm enough for hospitality, structured enough for operations
- modern and tactile, inspired by Material 3 color roles and shape language

## Brand Core
- Brand name: `Bhukkad`
- Product descriptor: `Restaurant OS`
- Voice: direct, upbeat, practical, confident
- Personality: bold hospitality, reliable operations, sharp service rhythm

## Material 3 Direction
The UI system follows Material 3 principles with Bhukkad-specific expression:

- semantic color roles instead of one-off hex usage
- rounded, tactile surfaces with clear elevation layers
- strong contrast between primary actions and neutral operational surfaces
- support for both light and dark mode from the same token set

## Color Roles
### Light theme
- Primary: `#ac3f12`
- Primary strong: `#8a3109`
- Primary soft: `#fff0e8`
- Secondary: `#745746`
- Tertiary: `#2f6c61`
- Background: `#fbf6f1`
- Card / Surface: `#fffaf7`
- Surface container: `#f6ede6`
- Border: `#dbc4b6`
- Foreground: `#211814`
- Muted foreground: `#6f5b4f`

### Dark theme
- Primary: `#ffb694`
- Primary container: `#7e3110`
- Secondary: `#e7c0a8`
- Tertiary: `#8bd2c3`
- Background: `#17120f`
- Card / Surface: `#211a16`
- Surface container: `#2b221d`
- Border: `#4d3d37`
- Foreground: `#f5ddd1`
- Muted foreground: `#c3aa9c`

## Typography
- Display: `Sora`
- UI / body: `Manrope`

Usage:
- Display font for brand moments, page titles, key metrics
- Sans font for navigation, forms, dense operations UI, tables

## Shape System
- Compact radius: `10px`
- Medium radius: `16px`
- Large radius: `22px`
- XL radius: `28px`
- Pill radius: `999px`

Use larger radii for high-level surfaces and primary actions to preserve the Material 3 feel.

## Elevation
- Elevation 1: base card and utility controls
- Elevation 2: interactive surfaces and popovers
- Elevation 3: hero panels and focused brand surfaces
- Brand shadow: primary-colored glow for key actions only

## Component Rules
- Primary CTA uses the Bhukkad warm orange tone
- Navigation should read like a Material 3 navigation rail / drawer hybrid
- Input fields should feel soft, elevated, and hospitality-friendly rather than stark enterprise gray
- Charts and analytics should sit on neutral containers with brand accents, not saturated backgrounds

## Do / Avoid
### Do
- use semantic tokens like `bg-card`, `text-muted-foreground`, `border-border`
- keep hospitality warmth visible in both themes
- use brand color for state emphasis, not every surface

### Avoid
- hardcoded slate palettes for dashboard chrome
- random saturated stat colors with no semantic meaning
- mixing tokenized surfaces with raw gray utility backgrounds

## Integration Notes
This branding system is integrated through:

- [`app/globals.css`](/Users/debadritamukhopadhyay/Bhukkad/app/globals.css)
- [`app/layout.tsx`](/Users/debadritamukhopadhyay/Bhukkad/app/layout.tsx)
- [`components/layout/header.tsx`](/Users/debadritamukhopadhyay/Bhukkad/components/layout/header.tsx)
- [`components/layout/sidebar.tsx`](/Users/debadritamukhopadhyay/Bhukkad/components/layout/sidebar.tsx)
- [`components/brand/brand-mark.tsx`](/Users/debadritamukhopadhyay/Bhukkad/components/brand/brand-mark.tsx)

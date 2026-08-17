---
name: Imperial Quartz
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c5c6cd'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8f9097'
  outline-variant: '#44474d'
  surface-tint: '#b9c7e4'
  primary: '#b9c7e4'
  on-primary: '#233148'
  primary-container: '#0a192f'
  on-primary-container: '#74829d'
  inverse-primary: '#515f78'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#b6c6ed'
  on-tertiary: '#20304f'
  tertiary-container: '#061836'
  on-tertiary-container: '#7282a5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#b6c6ed'
  on-tertiary-fixed: '#091b39'
  on-tertiary-fixed-variant: '#374767'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
spacing:
  margin-safe: 4rem
  gutter: 1.5rem
  section-gap: 8rem
  stack-sm: 0.5rem
  stack-md: 1.5rem
---

## Brand & Style
This design system targets high-net-worth investors and multi-national corporations seeking prestigious office space in Tashkent. The personality is authoritative, established, and cinematic. 

The aesthetic blends **Minimalism** with **High-Contrast** elements. It relies on expansive whitespace to denote luxury, punctuated by sharp, intentional lines and gold accents that evoke a sense of "Old World" prestige meeting "New World" commerce. The emotional response should be one of immediate trust, exclusivity, and quiet power.

## Colors
The palette is anchored by a deep, "Midnight Navy" (#0A192F) used for primary backgrounds to create a sense of depth and stability. 

- **Primary:** Deep Navy (#0A192F) for main canvases.
- **Secondary:** Metallic Gold (#D4AF37) used sparingly for high-value calls to action, borders, and decorative accents.
- **Tertiary:** Slate Blue (#112240) for card backgrounds and subtle layering.
- **Neutral:** Off-white (#F8F8F8) for primary body text to ensure maximum legibility against the dark background.

## Typography
The system uses a classic pairing of a high-contrast serif for headers and a functional, grounded sans-serif for utility.

- **Headlines:** Playfair Display. Used for all major section titles. It should be set with tight letter spacing for a modern, editorial feel.
- **Body & Labels:** Work Sans. Chosen for its professional, versatile nature. It remains legible at smaller sizes and provides a sturdy counterpoint to the decorative nature of the serif.
- **Styling Note:** Use `label-caps` for navigation and small headers above main titles to establish a rhythmic hierarchy.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy to maintain a structured, architectural feel. 

- **Desktop:** 12-column grid with wide 4rem side margins to "breathe."
- **Mobile:** 4-column grid with 1rem margins. 
- **Sectioning:** Large vertical gaps (8rem+) are required between major content blocks to emphasize the "luxury of space."
- **Alignment:** Primary content is often center-aligned or dramatically offset to one side to create a sophisticated, asymmetrical balance.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Low-contrast outlines**. 

Avoid heavy dropshadows. Instead, use a secondary navy tint (#112240) to lift cards from the primary background. To define edges, use 1px solid borders in the primary gold (#D4AF37) at 20% opacity. This creates a "gold leaf" effect that is visible only upon closer inspection, adding to the premium feel.

## Shapes
The shape language is strictly **Sharp (0)**. 

Every element—from buttons to image containers—uses 90-degree angles. This rigidity reinforces the architectural nature of the business centers and communicates a sense of precision, discipline, and uncompromising quality.

## Components
- **Buttons:** Rectangular with no radius. Primary buttons feature a solid gold background with navy text. Secondary buttons are "ghost" style with a gold 1px border.
- **Inputs:** Simple bottom-border only (underline style) to maintain a minimalist look. Labels should use the `label-caps` style.
- **Cards:** No shadows. Defined by a slightly lighter navy background and a 1px top-border in gold.
- **Lists:** Use custom gold-colored Roman numerals (I, II, III) instead of standard bullets to lean into the "Imperial" theme.
- **Imagery:** Large-scale, desaturated architectural photography with high contrast. Use gold color-burn overlays on hover.
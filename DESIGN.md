---
tokens:
  colors:
    background: "#f8fafc"
    surface: "#ffffff"
    surface-elevated: "#ffffff"
    border: "#e2e8f0"
    foreground: "#0f172a"
    muted: "#64748b"
    primary: "#0284c7"
    isochrone-tier-1: "rgba(220, 252, 231, 0.45)" # < 1h
    isochrone-tier-2: "rgba(187, 247, 208, 0.40)" # 1-2h
    isochrone-tier-3: "rgba(134, 239, 172, 0.35)" # 2-3h
    isochrone-tier-4: "rgba(74, 222, 128, 0.30)"  # 3-5h
    isochrone-tier-5: "rgba(34, 197, 94, 0.25)"   # 5-8h
  typography:
    fonts:
      sans: "Inter, system-ui, -apple-system, sans-serif"
---

# Chronotrains Style Adaptation for Poland Rail Explorer

- Clean, light, minimal cartography (ESRI Light Gray Canvas with subtle European boundaries).
- Single unified left sidebar containing Origin/Destination input, Filter Pills (All trains, Direct only, Weekend deals), Travel Time slider, Budget slider, and Destination list cards.
- Screen is completely open: No floating top boxes or conflicting double sidebars.
- White rounded rectangular city badges displaying City name, travel duration (e.g. `1 hr 43`), and lowest 2-week fare (e.g. `19 zł`).
- Origin marker: High-contrast black/white bullseye ring with pulsing halo (matching Chronotrains).
- Isochrone travel time color polygons layered over Poland radiating outwards from origin.

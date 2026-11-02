// Distance calculation (Haversine formula in km)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Format minutes into "Xh Ym"
export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m < 10 ? '0' : ''}${m}m`;
}

// Generate quadratic/cubic bezier curved line between 2 coordinates for clean map routes
export function generateCurvedGeoJSON(origin: [number, number], dest: [number, number], segments = 40): [number, number][] {
  const [lng1, lat1] = origin;
  const [lng2, lat2] = dest;

  // Midpoint
  const midLng = (lng1 + lng2) / 2;
  const midLat = (lat1 + lat2) / 2;

  // Distance
  const dx = lng2 - lng1;
  const dy = lat2 - lat1;
  const d = Math.sqrt(dx * dx + dy * dy);

  // Perpendicular curve offset factor (positive curve slightly east/north)
  const curvature = 0.12;
  const offsetLng = -dy * curvature;
  const offsetLat = dx * curvature;

  const controlLng = midLng + offsetLng;
  const controlLat = midLat + offsetLat;

  const coordinates: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Quadratic Bezier formula: (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
    const curLng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;
    const curLat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
    coordinates.push([curLng, curLat]);
  }
  return coordinates;
}

// Standard fare tariff calculator based on PKP Intercity and Polregio base tariffs (adult 2nd class)
export function calculateStandardFare(distanceKm: number, category: "EIP" | "EIC" | "IC" | "TLK" | "REGIO" = "IC"): number {
  if (category === "EIP") {
    // Pendolino Express Intercity Premium: base surcharge ~169 PLN or distance based
    if (distanceKm <= 100) return 99;
    if (distanceKm <= 200) return 149;
    if (distanceKm <= 350) return 169;
    return Math.round(169 + (distanceKm - 350) * 0.22);
  }

  if (category === "EIC") {
    // Express Intercity
    if (distanceKm <= 100) return 70;
    if (distanceKm <= 200) return 110;
    if (distanceKm <= 350) return 139;
    return Math.round(139 + (distanceKm - 350) * 0.18);
  }

  if (category === "REGIO") {
    // Regional trains (Polregio / KM / KD)
    if (distanceKm <= 20) return 6.5;
    if (distanceKm <= 40) return 11.5;
    if (distanceKm <= 60) return 16.0;
    if (distanceKm <= 100) return 22.5;
    if (distanceKm <= 160) return 29.0;
    return Math.round(30 + (distanceKm - 160) * 0.12);
  }

  // Standard IC / TLK tariff table
  if (distanceKm <= 40) return 19;
  if (distanceKm <= 60) return 24;
  if (distanceKm <= 80) return 31;
  if (distanceKm <= 100) return 38;
  if (distanceKm <= 140) return 46;
  if (distanceKm <= 180) return 52;
  if (distanceKm <= 240) return 62;
  if (distanceKm <= 300) return 68;
  if (distanceKm <= 400) return 75;
  if (distanceKm <= 500) return 83;
  return Math.round(83 + (distanceKm - 500) * 0.08);
}


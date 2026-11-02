import { City, DestinationRouteSummary } from "@/types/rail";

// Generate smooth circular/elliptical polygon buffers around origin coordinate representing isochrone travel zones
export function generateIsochroneZonesGeoJSON(
  origin: City,
  maxTravelHours: number
): GeoJSON.FeatureCollection {
  const [origLng, origLat] = [origin.lng, origin.lat];

  // Zones in hours (e.g. 1h, 2h, 3h, 5h, 8h)
  const zoneHours = [1, 2, 3, 5, 8].filter(h => h <= Math.max(1, maxTravelHours));
  if (!zoneHours.includes(maxTravelHours)) {
    zoneHours.push(maxTravelHours);
    zoneHours.sort((a, b) => a - b);
  }

  // Reverse so the larger outer rings are drawn first (underneath), smaller closer rings on top
  const sortedDesc = [...zoneHours].sort((a, b) => b - a);

  // Speed factor: rail transit travels ~85-110km per hour radial distance
  // 1 degree latitude ~= 111 km
  const kmPerDegLat = 111.0;
  const kmPerDegLng = 111.0 * Math.cos((origLat * Math.PI) / 180);

  const features: GeoJSON.Feature[] = sortedDesc.map((hours) => {
    const radialKm = hours * 95; // ~95 km per travel hour
    const pointsCount = 64;
    const ring: [number, number][] = [];

    for (let i = 0; i <= pointsCount; i++) {
      const angle = (i / pointsCount) * 2 * Math.PI;
      // Slight natural organic perturbation for realistic rail corridor reach
      const perturbation = 1 + 0.08 * Math.sin(angle * 3) + 0.05 * Math.cos(angle * 2);
      const dKm = radialKm * perturbation;

      const dLat = (dKm * Math.sin(angle)) / kmPerDegLat;
      const dLng = (dKm * Math.cos(angle)) / kmPerDegLng;

      ring.push([origLng + dLng, origLat + dLat]);
    }

    // Determine Chronotrains green hue based on travel hours
    // Closest (<1h) = vibrant lime-green; furthest (8h) = deep teal/forest green
    let fillColor = "rgba(74, 222, 128, 0.22)"; // light green
    let strokeColor = "rgba(34, 197, 94, 0.35)";

    if (hours <= 1) {
      fillColor = "rgba(187, 247, 208, 0.40)";
      strokeColor = "rgba(74, 222, 128, 0.50)";
    } else if (hours <= 2) {
      fillColor = "rgba(134, 239, 172, 0.32)";
      strokeColor = "rgba(34, 197, 94, 0.40)";
    } else if (hours <= 3) {
      fillColor = "rgba(74, 222, 128, 0.26)";
      strokeColor = "rgba(22, 163, 74, 0.35)";
    } else if (hours <= 5) {
      fillColor = "rgba(34, 197, 94, 0.20)";
      strokeColor = "rgba(21, 128, 61, 0.30)";
    } else {
      fillColor = "rgba(20, 184, 166, 0.16)";
      strokeColor = "rgba(13, 148, 136, 0.28)";
    }

    return {
      type: "Feature",
      properties: {
        hours,
        fillColor,
        strokeColor
      },
      geometry: {
        type: "Polygon",
        coordinates: [ring]
      }
    };
  });

  return {
    type: "FeatureCollection",
    features
  };
}


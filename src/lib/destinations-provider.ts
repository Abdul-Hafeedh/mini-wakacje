import { CITY_MAP, POLAND_CITIES } from "@/data/cities";
import { buildTwoWeekDestinationSummary } from "@/lib/two-week-service";
import { DestinationRouteSummary } from "@/types/rail";

export interface DestinationFilterOptions {
  maxDurationHours?: number;
  maxPricePln?: number;
  directOnly?: boolean;
  weekendOnly?: boolean;
  touristOnly?: boolean;
  startDate?: string;
}

export function getFilteredDestinations(
  originCityId: string,
  options: DestinationFilterOptions = {}
): DestinationRouteSummary[] {
  const originCity = CITY_MAP.get(originCityId.toLowerCase());
  if (!originCity) return [];

  const maxDurationHours = options.maxDurationHours ?? 12;
  const maxPricePln = options.maxPricePln ?? 999;
  const directOnly = options.directOnly ?? false;
  const weekendOnly = options.weekendOnly ?? false;
  const touristOnly = options.touristOnly ?? false;
  const startDate = options.startDate ?? "2026-11-02";

  const maxDurationMinutes = Math.round(maxDurationHours * 60);
  const destinations: DestinationRouteSummary[] = [];

  for (const destCity of POLAND_CITIES) {
    if (destCity.id === originCity.id) continue;
    if (touristOnly && !destCity.isTouristSpot) continue;

    const rawSummary = buildTwoWeekDestinationSummary(originCity, destCity, startDate);
    if (!rawSummary) continue;

    const summary = { ...rawSummary };

    if (summary.fastestDurationMinutes > maxDurationMinutes) continue;
    if (summary.minPriceNext2WeeksPln > maxPricePln) continue;
    if (directOnly && !summary.directAvailable) continue;

    if (weekendOnly) {
      const weekendDeals = summary.twoWeekDeals.filter(d => d.isWeekend);
      if (weekendDeals.length > 0) {
        const minWeekend = weekendDeals.reduce((m, d) => d.lowestFarePln < m.lowestFarePln ? d : m, weekendDeals[0]);
        if (minWeekend.lowestFarePln > maxPricePln) continue;
        summary.minPriceNext2WeeksPln = minWeekend.lowestFarePln;
      }
    }

    destinations.push(summary);
  }

  // Sort by lowest fare ascending
  destinations.sort((a, b) => a.minPriceNext2WeeksPln - b.minPriceNext2WeeksPln);
  return destinations;
}

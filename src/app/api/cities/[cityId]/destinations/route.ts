import { NextRequest, NextResponse } from "next/server";
import { CITY_MAP, POLAND_CITIES } from "@/data/cities";
import { buildTwoWeekDestinationSummary } from "@/lib/two-week-service";
import { DestinationRouteSummary } from "@/types/rail";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cityId: string }> }
) {
  const { cityId } = await params;
  const originCity = CITY_MAP.get(cityId.toLowerCase());

  if (!originCity) {
    return NextResponse.json({ error: `City with id '${cityId}' not found.` }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const maxDurationHours = parseFloat(searchParams.get("maxDurationHours") || "12");
  const maxPricePln = parseFloat(searchParams.get("maxPricePln") || "999");
  const directOnly = searchParams.get("directOnly") === "true";
  const weekendOnly = searchParams.get("weekendOnly") === "true";
  const touristOnly = searchParams.get("touristOnly") === "true";
  const startDate = searchParams.get("startDate") || "2026-11-02";

  const maxDurationMinutes = Math.round(maxDurationHours * 60);

  // Compute 2-week lowest fare overview for all destination cities
  const destinations: DestinationRouteSummary[] = [];

  for (const destCity of POLAND_CITIES) {
    if (destCity.id === originCity.id) continue;
    if (touristOnly && !destCity.isTouristSpot) continue;

    const rawSummary = buildTwoWeekDestinationSummary(originCity, destCity, startDate);
    if (!rawSummary) continue;

    // Shallow-clone so filters don't mutate cached values
    const summary = { ...rawSummary };

    // Apply filters
    if (summary.fastestDurationMinutes > maxDurationMinutes) continue;
    if (summary.minPriceNext2WeeksPln > maxPricePln) continue;
    if (directOnly && !summary.directAvailable) continue;

    if (weekendOnly) {
      // Find cheapest on weekend specifically
      const weekendDeals = summary.twoWeekDeals.filter(d => d.isWeekend);
      if (weekendDeals.length > 0) {
        const minWeekend = weekendDeals.reduce((m, d) => d.lowestFarePln < m.lowestFarePln ? d : m, weekendDeals[0]);
        if (minWeekend.lowestFarePln > maxPricePln) continue;
        summary.minPriceNext2WeeksPln = minWeekend.lowestFarePln;
        summary.bestTravelDay = minWeekend.dayOfWeek;
        summary.bestTravelDate = minWeekend.date;
      }
    }

    destinations.push(summary);
  }

  // Sort by lowest price first for easy budget discovery
  destinations.sort((a, b) => a.minPriceNext2WeeksPln - b.minPriceNext2WeeksPln);

  return NextResponse.json({
    origin: originCity,
    timeframe: "Next 14 days",
    startDate,
    count: destinations.length,
    destinations
  });
}

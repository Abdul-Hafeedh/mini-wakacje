import { NextRequest, NextResponse } from "next/server";
import { CITY_MAP } from "@/data/cities";
import { buildTwoWeekDestinationSummary } from "@/lib/two-week-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const startDate = searchParams.get("startDate") || "2026-11-04";

  if (!from || !to) {
    return NextResponse.json({ error: "Missing 'from' or 'to' city IDs" }, { status: 400 });
  }

  const originCity = CITY_MAP.get(from.toLowerCase());
  const destCity = CITY_MAP.get(to.toLowerCase());

  if (!originCity || !destCity) {
    return NextResponse.json({ error: "Invalid city ID supplied" }, { status: 404 });
  }

  const summary = buildTwoWeekDestinationSummary(originCity, destCity, startDate);

  return NextResponse.json({
    origin: originCity,
    destination: destCity,
    distanceKm: summary.distanceKm,
    minPriceNext2WeeksPln: summary.minPriceNext2WeeksPln,
    standardPricePln: summary.standardPricePln,
    savingsPercent: summary.savingsPercent,
    fastestDurationMinutes: summary.fastestDurationMinutes,
    fastestDurationFormatted: `${Math.floor(summary.fastestDurationMinutes / 60)}h ${summary.fastestDurationMinutes % 60}m`,
    twoWeekDeals: summary.twoWeekDeals,
    pricingRules: {
      promotionalTier: summary.minPriceNext2WeeksPln <= 29 ? "PKP Super Promo / Bilet Wcześniej" : "Promo 30-45%",
      discountDescription: `Save up to ${summary.savingsPercent}% off standard ${summary.standardPricePln} zł adult 2nd class fare by booking advance dates`,
      bookingWindow: "Next 14 calendar days (rolling ticket sales window)"
    }
  });
}

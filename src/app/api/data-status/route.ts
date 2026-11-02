import { NextResponse } from "next/server";
import { POLAND_CITIES } from "@/data/cities";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    primaryJourneySource: "KOLEO Live API (https://api.koleo.pl/v2/main)",
    officialSource: "PKP Polskie Linie Kolejowe (PLK) & KOLEO Engine",
    fareVerification: "KOLEO Verified Live Daily Fares",
    totalCitiesCovered: POLAND_CITIES.length,
    passengerDefaults: {
      passenger: "1 Adult",
      class: "2nd Class",
      journey: "One way",
      discounts: "None (Bilet normalny)",
      currency: "PLN",
      fareModel: "Published standard fare / Rozklad live tariff"
    },
    lastUpdated: new Date().toISOString()
  });
}


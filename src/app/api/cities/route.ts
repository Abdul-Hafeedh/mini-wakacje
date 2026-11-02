import { NextResponse } from "next/server";
import { POLAND_CITIES } from "@/data/cities";

export async function GET() {
  return NextResponse.json({
    total: POLAND_CITIES.length,
    cities: POLAND_CITIES
  });
}


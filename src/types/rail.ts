export interface City {
  id: string;
  name: string;
  namePl: string;
  voivodeship: string;
  population: number;
  tier: "1M+" | "750k+" | "500k+" | "250k+" | "175k+" | "100k+" | "75k+";
  lat: number;
  lng: number;
  primaryStationId: string;
  primaryStationName: string;
  allStations: string[];
  wikipediaUrl: string;
  isTouristSpot?: boolean;
  touristDescription?: string;
}

export interface DayFareDeal {
  date: string;          // YYYY-MM-DD
  dayOfWeek: string;     // e.g. "Fri, Nov 6"
  isWeekend: boolean;
  lowestFarePln: number;
  fareTier: "Super Promo" | "Promo" | "Taniomiastowy" | "Standard Regio" | "Bazowa";
  fastestDurationMinutes: number;
  fastestDurationFormatted: string;
  directAvailable: boolean;
  sampleTrain: {
    number: string;
    name?: string;
    operator: string;
    departureTime: string;
    arrivalTime: string;
  };
  koleoBookingUrl: string;
}

export interface DestinationRouteSummary {
  destinationCityId: string;
  destinationCityName: string;
  lat: number;
  lng: number;
  distanceKm: number;
  // Lowest ticket price available across the next 14 days
  minPriceNext2WeeksPln: number;
  standardPricePln: number;
  savingsPercent: number;
  fastestDurationMinutes: number;
  fewestTransfers: number;
  directAvailable: boolean;
  bestTravelDay: string; // e.g. "Tue, Nov 10"
  bestTravelDate: string; // YYYY-MM-DD
  primaryOperator: string;
  isTouristSpot?: boolean;
  availableDaysCount: number;
  twoWeekDeals: DayFareDeal[];
}

export interface DestinationDetailResponse {
  origin: City;
  destination: City;
  distanceKm: number;
  minPriceNext2WeeksPln: number;
  standardPricePln: number;
  fastestDurationMinutes: number;
  fastestDurationFormatted: string;
  twoWeekDeals: DayFareDeal[];
  pricingRules: {
    promotionalTier: string;
    discountDescription: string;
    bookingWindow: string;
  };
}

export interface ExplorerFilters {
  originCityId: string;
  maxDurationHours: number;
  maxPricePln: number;
  directOnly: boolean;
  weekendOnly: boolean;
  selectedOperator: string;
  timeWindow: "next_7_days" | "next_14_days";
}

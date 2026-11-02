import fs from "fs";
import path from "path";
import { City, DestinationRouteSummary, DayFareDeal } from "@/types/rail";
import { calculateDistanceKm, formatMinutesToHours } from "./rail-utils";
import { KOLEO_STATIONS } from "@/data/station-mapping";
import { getBrandInfo } from "@/data/koleo-brands";

const KOLEO_API_BASE = "https://api.koleo.pl/v2/main";
const KOLEO_HEADERS = {
  "Accept": "application/json, text/plain, */*",
  "X-KOLEO-Version": "2",
  "X-KOLEO-Client": "Nuxt-17965d2",
  "Accept-EOL-Response-Version": "2",
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)"
};

// Disk Cache file
const CACHE_FILE_PATH = path.join(process.cwd(), "src", "data", "koleo-cache.json");

// In-memory route summary cache: key is `${originId}-${destId}`
const memoryCache = new Map<string, DestinationRouteSummary>();
let lastCacheMtimeMs = 0;

// Load disk cache on module startup or whenever file is modified on disk
function reloadDiskCacheIfNeeded() {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const stats = fs.statSync(CACHE_FILE_PATH);
      if (stats.mtimeMs > lastCacheMtimeMs) {
        lastCacheMtimeMs = stats.mtimeMs;
        const data = fs.readFileSync(CACHE_FILE_PATH, "utf-8");
        const json = JSON.parse(data);
        for (const [key, val] of Object.entries(json)) {
          memoryCache.set(key, val as DestinationRouteSummary);
        }
        console.log(`[koleo-service] Reloaded ${memoryCache.size} routes from disk cache.`);
      }
    }
  } catch (err) {
    console.error("[koleo-service] Error reading cache file:", err);
  }
}

reloadDiskCacheIfNeeded();

export function saveDiskCache() {
  try {
    const obj: Record<string, DestinationRouteSummary> = {};
    for (const [k, v] of memoryCache.entries()) {
      obj[k] = v;
    }
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(obj, null, 2), "utf-8");
    lastCacheMtimeMs = fs.statSync(CACHE_FILE_PATH).mtimeMs;
    console.log(`[koleo-service] Saved ${memoryCache.size} routes to ${CACHE_FILE_PATH}`);
  } catch (err) {
    console.error("[koleo-service] Error writing cache file:", err);
  }
}

export function getCachedRouteSummary(originId: string, destId: string): DestinationRouteSummary | undefined {
  reloadDiskCacheIfNeeded();
  return memoryCache.get(`${originId}-${destId}`);
}

export function setCachedRouteSummary(originId: string, destId: string, summary: DestinationRouteSummary) {
  memoryCache.set(`${originId}-${destId}`, summary);
}

export function getAllCachedRoutesForOrigin(originId: string): DestinationRouteSummary[] {
  const prefix = `${originId}-`;
  const result: DestinationRouteSummary[] = [];
  for (const [key, val] of memoryCache.entries()) {
    if (key.startsWith(prefix)) {
      result.push(val);
    }
  }
  return result;
}

interface KoleoRawLeg {
  leg_type: string;
  train_nr?: number | string;
  train_name?: string;
  train_full_name?: string;
  commercial_brand_id?: number;
  departure?: string;
  arrival?: string;
  duration?: number;
}

interface KoleoRawConnection {
  uuid: string;
  departure: string;
  arrival: string;
  duration: number;
  changes: number;
  legs: KoleoRawLeg[];
}

/**
 * Fetch real connections for a single date from KOLEO
 */
export async function fetchKoleoConnectionsForDay(
  startStationId: number,
  endStationId: number,
  originSlug: string,
  destSlug: string,
  dateStr: string,
  onlyDirect = false
): Promise<DayFareDeal | null> {
  const times = [`${dateStr}T05:30:00`, `${dateStr}T14:30:00`];
  const connsMap = new Map<string, KoleoRawConnection>();

  await Promise.all(
    times.map(async (departureAfter) => {
      try {
        const res = await fetch(`${KOLEO_API_BASE}/eol_connections/search`, {
          method: "POST",
          headers: KOLEO_HEADERS,
          body: JSON.stringify({
            start_id: startStationId,
            end_id: endStationId,
            only_direct: onlyDirect,
            departure_after: departureAfter
          })
        });

        if (!res.ok) return;
        const list = (await res.json()) as KoleoRawConnection[];
        if (Array.isArray(list)) {
          for (const c of list) {
            if (!connsMap.has(c.uuid) && c.departure.startsWith(dateStr)) {
              if (!onlyDirect || c.changes === 0) {
                connsMap.set(c.uuid, c);
              }
            }
          }
        }
      } catch (e) {
        // network or timeout error
      }
    })
  );

  const rawConns = Array.from(connsMap.values());
  if (rawConns.length === 0) return null;

  // Query prices for these connections (limit to 12 most relevant to stay snappy)
  const pricedConns = await Promise.all(
    rawConns.slice(0, 12).map(async (c) => {
      try {
        const pRes = await fetch(`${KOLEO_API_BASE}/eol_connections/${c.uuid}/price`, {
          headers: KOLEO_HEADERS
        });
        if (!pRes.ok) return null;
        const pData = await pRes.json();
        const price = pData.price ? parseFloat(pData.price) : null;
        if (price === null || isNaN(price)) return null;

        return {
          connection: c,
          price
        };
      } catch {
        return null;
      }
    })
  );

  const validDeals = pricedConns.filter((p): p is { connection: KoleoRawConnection; price: number } => p !== null);
  if (validDeals.length === 0) return null;

  // Find connection with the lowest price
  validDeals.sort((a, b) => a.price - b.price);
  const best = validDeals[0];
  const c = best.connection;

  const depTime = c.departure.slice(11, 16);
  const arrTime = c.arrival.slice(11, 16);
  const durMin = c.duration;

  // Extract legs info
  const trainLegs = c.legs.filter(l => l.leg_type === "train_leg");
  const firstLeg = trainLegs[0] || {};
  const brandInfo = getBrandInfo(firstLeg.commercial_brand_id);

  // Train numbers & names
  const trainNumbers = trainLegs
    .map(l => {
      const b = getBrandInfo(l.commercial_brand_id);
      return `${b.logoText} ${l.train_nr || ""}`.trim();
    })
    .join(" / ");

  const trainNames = trainLegs
    .map(l => l.train_name)
    .filter(Boolean)
    .join(" / ");

  const curDate = new Date(dateStr + "T12:00:00Z");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayIdx = curDate.getUTCDay();
  const isWeekend = dayIdx === 0 || dayIdx === 6;
  const dayOfWeekStr = `${daysOfWeek[dayIdx]}, ${months[curDate.getUTCMonth()]} ${curDate.getUTCDate()}`;

  const [year, month, day] = dateStr.split("-");
  const koleoBookingUrl = `https://koleo.pl/rozklad-pkp/${originSlug}/${destSlug}/${day}-${month}-${year}_${depTime}`;

  let fareTier: DayFareDeal["fareTier"] = "Bazowa";
  if (best.price <= 35) fareTier = "Super Promo";
  else if (best.price <= 55) fareTier = "Promo";

  return {
    date: dateStr,
    dayOfWeek: dayOfWeekStr,
    isWeekend,
    lowestFarePln: best.price,
    fareTier,
    fastestDurationMinutes: durMin,
    fastestDurationFormatted: formatMinutesToHours(durMin),
    directAvailable: c.changes === 0,
    sampleTrain: {
      number: trainNumbers || "PKP",
      name: trainNames || undefined,
      operator: brandInfo.displayName,
      departureTime: depTime,
      arrivalTime: arrTime
    },
    koleoBookingUrl
  };
}

/**
 * Fetch 14-day itinerary for an origin-destination pair from KOLEO
 */
export async function fetchTwoWeekDealsForRoute(
  origin: City,
  dest: City,
  startDateStr = "2026-11-02",
  onlyDirect = false
): Promise<DestinationRouteSummary | null> {
  const cacheKey = `${origin.id}-${dest.id}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const originStation = KOLEO_STATIONS[origin.id];
  const destStation = KOLEO_STATIONS[dest.id];
  if (!originStation || !destStation) {
    console.warn(`[koleo-service] Missing KOLEO station mapping for ${origin.id} or ${dest.id}`);
    return null;
  }

  const baseDate = new Date(startDateStr + "T00:00:00Z");
  const dates: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate.getTime() + i * 24 * 3600 * 1000);
    dates.push(d.toISOString().slice(0, 10));
  }

  // Fetch all 14 days in parallel
  const deals = await Promise.all(
    dates.map(dateStr =>
      fetchKoleoConnectionsForDay(
        originStation.stationId,
        destStation.stationId,
        originStation.slug,
        destStation.slug,
        dateStr,
        onlyDirect
      )
    )
  );

  const validDeals = deals.filter((d): d is DayFareDeal => d !== null);
  if (validDeals.length === 0) return null;

  // Find lowest price over 2 weeks
  const bestDeal = validDeals.reduce((min, d) => (d.lowestFarePln < min.lowestFarePln ? d : min), validDeals[0]);
  const highestDeal = validDeals.reduce((max, d) => (d.lowestFarePln > max.lowestFarePln ? d : max), validDeals[0]);
  const fastestMin = Math.min(...validDeals.map(d => d.fastestDurationMinutes));

  const standardPrice = highestDeal.lowestFarePln > bestDeal.lowestFarePln ? highestDeal.lowestFarePln : Math.round(bestDeal.lowestFarePln * 1.5);
  const savingsPercent = standardPrice > bestDeal.lowestFarePln
    ? Math.round(((standardPrice - bestDeal.lowestFarePln) / standardPrice) * 100)
    : 0;

  const straightKm = calculateDistanceKm(origin.lat, origin.lng, dest.lat, dest.lng);
  const distanceKm = Math.round(straightKm * 1.15);

  const summary: DestinationRouteSummary = {
    destinationCityId: dest.id,
    destinationCityName: dest.namePl,
    lat: dest.lat,
    lng: dest.lng,
    distanceKm,
    minPriceNext2WeeksPln: bestDeal.lowestFarePln,
    standardPricePln: standardPrice,
    savingsPercent,
    fastestDurationMinutes: fastestMin,
    fewestTransfers: validDeals.some(d => d.directAvailable) ? 0 : 1,
    directAvailable: validDeals.some(d => d.directAvailable),
    bestTravelDay: bestDeal.dayOfWeek,
    bestTravelDate: bestDeal.date,
    primaryOperator: bestDeal.sampleTrain.operator,
    isTouristSpot: !!dest.isTouristSpot,
    availableDaysCount: validDeals.length,
    twoWeekDeals: validDeals
  };

  memoryCache.set(cacheKey, summary);
  return summary;
}

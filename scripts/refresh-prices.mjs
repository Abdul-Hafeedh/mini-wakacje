import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const cacheFilePath = path.join(projectRoot, "src", "data", "koleo-cache.json");

// Read existing stations and brands
const stationsJsonPath = path.join(projectRoot, "src", "data", "station-mapping.ts");
const stationsContent = fs.readFileSync(stationsJsonPath, "utf-8");
const jsonMatch = stationsContent.match(/export const KOLEO_STATIONS[^{]*(\{[\s\S]*?\});/);
const KOLEO_STATIONS = eval("(" + jsonMatch[1] + ")");

const brandsJsonPath = path.join(projectRoot, "src", "data", "koleo-brands.ts");
const brandsContent = fs.readFileSync(brandsJsonPath, "utf-8");
const brandsMatch = brandsContent.match(/export const KOLEO_BRANDS[^{]*(\{[\s\S]*?\});/);
const KOLEO_BRANDS = eval("(" + brandsMatch[1] + ")");

function getBrand(id) {
  if (id && KOLEO_BRANDS[id]) return KOLEO_BRANDS[id];
  return { name: "PKP", displayName: "PKP", logoText: "PKP", color: "#0284c7" };
}

// Read cities
const citiesPath = path.join(projectRoot, "src", "data", "cities.ts");
const citiesText = fs.readFileSync(citiesPath, "utf-8");
const cityMatches = [...citiesText.matchAll(/id:\s*"([^"]+)",[\s\S]*?namePl:\s*"([^"]+)",[\s\S]*?lat:\s*([0-9.]+),[\s\S]*?lng:\s*([0-9.]+),/g)];

const CITIES = cityMatches.map(m => ({
  id: m[1],
  namePl: m[2],
  lat: parseFloat(m[3]),
  lng: parseFloat(m[4])
}));

const KOLEO_API_BASE = "https://api.koleo.pl/v2/main";
const KOLEO_HEADERS = {
  "Accept": "application/json, text/plain, */*",
  "X-KOLEO-Version": "2",
  "X-KOLEO-Client": "Nuxt-17965d2",
  "Accept-EOL-Response-Version": "2",
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
};

function formatHours(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 1.15);
}

// Load existing cache
let diskCache = {};
if (fs.existsSync(cacheFilePath)) {
  try {
    diskCache = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
  } catch (e) {}
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchDay(startStationId, endStationId, originSlug, destSlug, dateStr) {
  const times = [`${dateStr}T05:30:00`, `${dateStr}T14:30:00`];
  const connsMap = new Map();

  await Promise.all(times.map(async (departureAfter) => {
    try {
      const res = await fetch(`${KOLEO_API_BASE}/eol_connections/search`, {
        method: "POST",
        headers: KOLEO_HEADERS,
        body: JSON.stringify({
          start_id: startStationId,
          end_id: endStationId,
          only_direct: false,
          departure_after: departureAfter
        }),
        signal: AbortSignal.timeout(6000)
      });
      if (!res.ok) return;
      const list = await res.json();
      if (Array.isArray(list)) {
        for (const c of list) {
          if (!connsMap.has(c.uuid) && c.departure.startsWith(dateStr)) {
            connsMap.set(c.uuid, c);
          }
        }
      }
    } catch (e) {}
  }));

  const rawConns = Array.from(connsMap.values());
  if (rawConns.length === 0) return null;

  rawConns.sort((a, b) => {
    if (a.changes !== b.changes) return a.changes - b.changes;
    return a.duration - b.duration;
  });

  const candidates = rawConns.slice(0, 4);

  const pricedConns = await Promise.all(candidates.map(async (c) => {
    try {
      const pRes = await fetch(`${KOLEO_API_BASE}/eol_connections/${c.uuid}/price`, {
        headers: KOLEO_HEADERS,
        signal: AbortSignal.timeout(5000)
      });
      if (!pRes.ok) return null;
      const pData = await pRes.json();
      const price = pData.price ? parseFloat(pData.price) : null;
      if (price === null || isNaN(price)) return null;
      return { c, price };
    } catch {
      return null;
    }
  }));

  const valid = pricedConns.filter(p => p !== null);
  if (valid.length === 0) return null;

  valid.sort((a, b) => a.price - b.price);
  const best = valid[0];
  const c = best.c;

  const depTime = c.departure.slice(11, 16);
  const arrTime = c.arrival.slice(11, 16);
  const durMin = c.duration;

  const trainLegs = (c.legs || []).filter(l => l.leg_type === "train_leg");
  const firstLeg = trainLegs[0] || {};
  const brand = getBrand(firstLeg.commercial_brand_id);

  const trainNumbers = trainLegs.map(l => {
    const b = getBrand(l.commercial_brand_id);
    return `${b.logoText} ${l.train_nr || ""}`.trim();
  }).join(" / ");

  const trainNames = trainLegs.map(l => l.train_name).filter(Boolean).join(" / ");

  const curDate = new Date(dateStr + "T12:00:00Z");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayIdx = curDate.getUTCDay();
  const isWeekend = dayIdx === 0 || dayIdx === 6;
  const dayOfWeekStr = `${daysOfWeek[dayIdx]}, ${months[curDate.getUTCMonth()]} ${curDate.getUTCDate()}`;

  const [year, month, day] = dateStr.split("-");
  const koleoBookingUrl = `https://koleo.pl/rozklad-pkp/${originSlug}/${destSlug}/${day}-${month}-${year}_${depTime}`;

  let fareTier = "Bazowa";
  if (best.price <= 35) fareTier = "Super Promo";
  else if (best.price <= 55) fareTier = "Promo";

  return {
    date: dateStr,
    dayOfWeek: dayOfWeekStr,
    isWeekend,
    lowestFarePln: best.price,
    fareTier,
    fastestDurationMinutes: durMin,
    fastestDurationFormatted: formatHours(durMin),
    directAvailable: c.changes === 0,
    sampleTrain: {
      number: trainNumbers || "PKP",
      name: trainNames || undefined,
      operator: brand.displayName,
      departureTime: depTime,
      arrivalTime: arrTime
    },
    koleoBookingUrl
  };
}

async function refreshRoute(originCity, destCity, startDateStr = "2026-11-04") {
  const cacheKey = `${originCity.id}-${destCity.id}`;

  const originStation = KOLEO_STATIONS[originCity.id];
  const destStation = KOLEO_STATIONS[destCity.id];
  if (!originStation || !destStation) return null;

  const baseDate = new Date(startDateStr + "T00:00:00Z");
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate.getTime() + i * 24 * 3600 * 1000);
    dates.push(d.toISOString().slice(0, 10));
  }

  const deals = await Promise.all(dates.map(d =>
    fetchDay(originStation.stationId, destStation.stationId, originStation.slug, destStation.slug, d)
  ));

  const validDeals = deals.filter(d => d !== null);
  if (validDeals.length === 0) {
    // Keep existing fallback if live search returned nothing
    return diskCache[cacheKey] || null;
  }

  const bestDeal = validDeals.reduce((min, d) => (d.lowestFarePln < min.lowestFarePln ? d : min), validDeals[0]);
  const highestDeal = validDeals.reduce((max, d) => (d.lowestFarePln > max.lowestFarePln ? d : max), validDeals[0]);
  const fastestMin = Math.min(...validDeals.map(d => d.fastestDurationMinutes));

  const standardPrice = highestDeal.lowestFarePln > bestDeal.lowestFarePln
    ? highestDeal.lowestFarePln
    : Math.round(bestDeal.lowestFarePln * 1.5);

  const savingsPercent = standardPrice > bestDeal.lowestFarePln
    ? Math.round(((standardPrice - bestDeal.lowestFarePln) / standardPrice) * 100)
    : 0;

  const distanceKm = calculateDistance(originCity.lat, originCity.lng, destCity.lat, destCity.lng);

  const isTourist = [
    "malbork", "wieliczka", "oswiecim", "walbrzych", "gryfow-slaski", "pszczyna", "lancut",
    "czestochowa", "swidnica", "jawor", "tarnowskie-gory", "kalwaria-zebrzydowska", "gniezno", "znin",
    "zakopane", "hajnowka", "gizycko", "mikolajki", "leba", "ustrzyki-dolne", "szklarska-poreba",
    "jelenia-gora", "klodzko", "nowy-targ", "krynica-zdroj", "wisla", "hel", "kolobrzeg",
    "swinoujscie", "miedzyzdroje", "ustka"
  ].includes(destCity.id);

  const summary = {
    destinationCityId: destCity.id,
    destinationCityName: destCity.namePl,
    lat: destCity.lat,
    lng: destCity.lng,
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
    isTouristSpot: isTourist,
    availableDaysCount: validDeals.length,
    twoWeekDeals: validDeals
  };

  diskCache[cacheKey] = summary;
  return summary;
}

async function main() {
  const warsaw = CITIES.find(c => c.id === "warsaw");
  if (!warsaw) {
    console.error("Warsaw city not found");
    return;
  }

  const destinations = CITIES.filter(c => c.id !== "warsaw");
  console.log(`Starting live KOLEO price refresh for ${destinations.length} destinations from Warsaw (2026-11-04 to 2026-11-17)...`);

  let count = 0;
  for (const dest of destinations) {
    count++;
    const t0 = Date.now();
    try {
      const summary = await refreshRoute(warsaw, dest, "2026-11-04");
      const elapsed = Date.now() - t0;
      if (summary) {
        console.log(`[${count}/${destinations.length}] ${dest.namePl} (${dest.id}): ${summary.minPriceNext2WeeksPln} zł (${formatHours(summary.fastestDurationMinutes)}, ${summary.availableDaysCount} days) in ${elapsed}ms`);
      } else {
        console.log(`[${count}/${destinations.length}] ${dest.namePl}: No deals found in ${elapsed}ms`);
      }

      if (count % 5 === 0) {
        fs.writeFileSync(cacheFilePath, JSON.stringify(diskCache, null, 2), "utf-8");
      }
      await sleep(150);
    } catch (err) {
      console.error(`[${count}/${destinations.length}] Error for ${dest.namePl}:`, err.message);
    }
  }

  fs.writeFileSync(cacheFilePath, JSON.stringify(diskCache, null, 2), "utf-8");
  console.log(`ALL DONE! Successfully refreshed prices for ${Object.keys(diskCache).length} routes to ${cacheFilePath}`);
}

main();

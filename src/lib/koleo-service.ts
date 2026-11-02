import { City, DestinationRouteSummary } from "@/types/rail";
import staticCacheJson from "@/data/koleo-cache.json";

// In-memory route summary cache: key is `${originId}-${destId}`
const memoryCache = new Map<string, DestinationRouteSummary>();

// Initialize memory cache directly from imported JSON
for (const [key, val] of Object.entries(staticCacheJson)) {
  memoryCache.set(key, val as unknown as DestinationRouteSummary);
}

export function getCachedRouteSummary(originId: string, destId: string): DestinationRouteSummary | undefined {
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

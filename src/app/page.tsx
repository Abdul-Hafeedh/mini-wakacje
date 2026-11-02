"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { RailMap } from "@/components/RailMap";
import { ChronotrainsSidebar } from "@/components/ChronotrainsSidebar";
import { ChronotrainsHeader } from "@/components/ChronotrainsHeader";
import { POLAND_CITIES, CITY_MAP } from "@/data/cities";
import { DestinationRouteSummary } from "@/types/rail";

export default function Home() {
  const [originCityId, setOriginCityId] = useState<string>("warsaw");
  const [maxTravelHours, setMaxTravelHours] = useState<number>(5.0);
  const [maxPricePln, setMaxPricePln] = useState<number>(65);
  const [directOnly, setDirectOnly] = useState<boolean>(false);
  const [weekendOnly, setWeekendOnly] = useState<boolean>(false);
  const [touristOnly, setTouristOnly] = useState<boolean>(false);

  const [destinations, setDestinations] = useState<DestinationRouteSummary[]>([]);
  const [selectedDestCityId, setSelectedDestCityId] = useState<string | null>(null);

  const originCity = useMemo(() => CITY_MAP.get(originCityId) || POLAND_CITIES[0], [originCityId]);

  // Fetch reachable destinations with 2-week lowest fares
  const fetchDestinations = useCallback(async () => {
    try {
      const url = `/api/cities/${originCityId}/destinations?maxDurationHours=${maxTravelHours}&maxPricePln=${maxPricePln}&directOnly=${directOnly}&weekendOnly=${weekendOnly}&touristOnly=${touristOnly}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDestinations(data.destinations || []);
      }
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
    }
  }, [originCityId, maxTravelHours, maxPricePln, directOnly, weekendOnly, touristOnly]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleSelectOrigin = (cityId: string) => {
    setOriginCityId(cityId);
    setSelectedDestCityId(null);
  };

  const handleSelectDestination = (cityId: string) => {
    if (cityId === originCityId) return;
    setSelectedDestCityId(cityId);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#edf2f7] flex flex-col font-sans">
      
      {/* Top Chronotrains Header */}
      <ChronotrainsHeader />

      {/* Main Map & Floating Controls Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Unified Left Sidebar in Chronotrains style */}
        <ChronotrainsSidebar
          cities={POLAND_CITIES}
          originCity={originCity}
          onSelectOrigin={handleSelectOrigin}
          destinations={destinations}
          selectedDestCityId={selectedDestCityId}
          onSelectDestination={handleSelectDestination}
          onClearDestination={() => setSelectedDestCityId(null)}
          maxTravelHours={maxTravelHours}
          onMaxTravelHoursChange={setMaxTravelHours}
          maxPricePln={maxPricePln}
          onMaxPriceChange={setMaxPricePln}
          directOnly={directOnly}
          onDirectOnlyChange={setDirectOnly}
          weekendOnly={weekendOnly}
          onWeekendOnlyChange={setWeekendOnly}
          touristOnly={touristOnly}
          onTouristOnlyChange={setTouristOnly}
        />

        {/* Main MapLibre Viewport centered on Poland with Isochrone reach rings */}
        <div className="w-full h-full relative">
          <RailMap
            cities={POLAND_CITIES}
            originCity={originCity}
            destinations={destinations}
            selectedDestCityId={selectedDestCityId}
            onSelectCity={handleSelectDestination}
            maxTravelHours={maxTravelHours}
          />
        </div>
      </div>

    </div>
  );
}

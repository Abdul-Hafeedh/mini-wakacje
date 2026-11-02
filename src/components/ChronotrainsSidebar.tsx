"use client";

import React, { useState } from "react";
import { Search, ArrowRight, Clock, Tag, ExternalLink, Calendar, X, Sparkles, Train } from "lucide-react";
import { City, DestinationRouteSummary, DayFareDeal } from "@/types/rail";

interface ChronotrainsSidebarProps {
  cities: City[];
  originCity: City;
  onSelectOrigin: (cityId: string) => void;
  destinations: DestinationRouteSummary[];
  selectedDestCityId: string | null;
  onSelectDestination: (cityId: string) => void;
  onClearDestination: () => void;
  maxTravelHours: number;
  onMaxTravelHoursChange: (hours: number) => void;
  maxPricePln: number;
  onMaxPriceChange: (price: number) => void;
  directOnly: boolean;
  onDirectOnlyChange: (direct: boolean) => void;
  weekendOnly: boolean;
  onWeekendOnlyChange: (weekend: boolean) => void;
  touristOnly: boolean;
  onTouristOnlyChange: (tourist: boolean) => void;
}

export function ChronotrainsSidebar({
  cities,
  originCity,
  onSelectOrigin,
  destinations,
  selectedDestCityId,
  onSelectDestination,
  onClearDestination,
  maxTravelHours,
  onMaxTravelHoursChange,
  maxPricePln,
  onMaxPriceChange,
  directOnly,
  onDirectOnlyChange,
  weekendOnly,
  onWeekendOnlyChange,
  touristOnly,
  onTouristOnlyChange
}: ChronotrainsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const selectedDest = destinations.find(d => d.destinationCityId === selectedDestCityId);

  // Filtered destination list for the sidebar
  const displayedDestinations = destinations.filter(d => {
    if (!searchQuery) return true;
    return d.destinationCityName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="absolute top-4 left-4 bottom-4 w-96 max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 z-20 flex flex-col overflow-hidden text-slate-800 transition-all">
      
      {/* Top Search Inputs (Chronotrains 'From' & 'To') */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2">
          {/* Origin selector */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              From
            </label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-sky-500 transition-colors">
              <span className="text-slate-400 mr-1.5 text-xs">➤</span>
              <select
                value={originCity.id}
                onChange={(e) => onSelectOrigin(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.namePl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search/Filter destination */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Filter City
            </label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-sky-500 transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Pills: All trains, Direct trains, Weekend only, Tourist destinations */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => {
              onDirectOnlyChange(false);
              onWeekendOnlyChange(false);
              onTouristOnlyChange(false);
            }}
            className={`py-1 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
              !directOnly && !weekendOnly && !touristOnly
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onDirectOnlyChange(!directOnly)}
            className={`py-1 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
              directOnly
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => {
              onWeekendOnlyChange(!weekendOnly);
            }}
            className={`py-1 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
              weekendOnly
                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Weekend
          </button>
          <button
            onClick={() => {
              onTouristOnlyChange(!touristOnly);
            }}
            className={`py-1 px-2.5 rounded-lg text-xs font-bold border text-center transition-colors flex items-center justify-center gap-1 ${
              touristOnly
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs ring-1 ring-emerald-500"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
            }`}
            title="Filter UNESCO & Polish Tourist Destinations"
          >
            <span>🏰</span>
            <span>Tourist</span>
          </button>
        </div>

        {/* Maximum travel time slider (Chronotrains signature green slider) */}
        <div className="pt-2">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-600 font-medium">Maximum travel time</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{maxTravelHours} h</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="0.5"
            value={maxTravelHours}
            onChange={(e) => onMaxTravelHoursChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 h</span>
            <span>3 h</span>
            <span>5 h</span>
            <span>8 h</span>
          </div>
        </div>

        {/* Budget filter slider */}
        <div className="pt-1 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-600 font-medium">Ticket budget (adult 2nd class)</span>
            <span className="font-bold text-emerald-700 font-mono text-sm">{maxPricePln} zł</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="5"
            value={maxPricePln}
            onChange={(e) => onMaxPriceChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Main Content Area: Detailed 2-week view for selected city OR list of reachable cities */}
      <div className="flex-1 overflow-y-auto p-3">
        {selectedDest ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <div className="flex items-center gap-1 text-[11px] text-sky-600 font-medium">
                  <span>{originCity.namePl}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{selectedDest.destinationCityName}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedDest.destinationCityName}
                </h3>
                <div className="text-xs text-slate-500">
                  {Math.floor(selectedDest.fastestDurationMinutes / 60)}h {selectedDest.fastestDurationMinutes % 60}m · {selectedDest.directAvailable ? "Direct connection" : "1 transfer"}
                </div>
              </div>
              <button
                onClick={onClearDestination}
                className="text-slate-400 hover:text-slate-700 p-1"
                title="Back to list"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price highlight */}
            {(() => {
              const bestOverallDeal = selectedDest.twoWeekDeals.find(d => d.lowestFarePln === selectedDest.minPriceNext2WeeksPln) || selectedDest.twoWeekDeals[0];
              return (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Lowest Fare (Next 14 Days)
                    </div>
                    <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                      {selectedDest.minPriceNext2WeeksPln} zł
                    </div>
                    <div className="text-[11px] text-emerald-900 font-medium mt-0.5">
                      Best day: <strong className="font-bold">{bestOverallDeal?.dayOfWeek}</strong> at <strong className="font-bold">{bestOverallDeal?.sampleTrain?.departureTime}</strong> ({bestOverallDeal?.sampleTrain?.number})
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Daily calendar list with exact times and real KOLEO fares */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>14-Day Calendar Timetable & Prices</span>
                </span>
                <span className="text-[10px] text-slate-400">KOLEO live links</span>
              </div>

              <div className="space-y-1.5 pr-1">
                {selectedDest.twoWeekDeals.map((deal) => {
                  const isLowest = deal.lowestFarePln === selectedDest.minPriceNext2WeeksPln;
                  return (
                    <div
                      key={deal.date}
                      className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        isLowest
                          ? "border-emerald-300 bg-emerald-50/70 shadow-xs"
                          : "border-slate-200 bg-slate-50/80 hover:bg-slate-100"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{deal.dayOfWeek}</span>
                          {deal.isWeekend && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-normal">
                              Weekend
                            </span>
                          )}
                          {isLowest && (
                            <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                              Cheapest
                            </span>
                          )}
                        </div>

                        {/* Train details with exact time */}
                        <div className="text-[11px] text-slate-600 font-mono mt-1 flex items-center gap-1.5 flex-wrap">
                          <Train className="w-3 h-3 text-sky-600 shrink-0" />
                          <strong className="text-slate-900">{deal.sampleTrain.departureTime}</strong>
                          <span className="text-slate-400">→</span>
                          <span>{deal.sampleTrain.arrivalTime}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 font-sans">{deal.fastestDurationFormatted}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-700 font-sans font-medium">{deal.sampleTrain.number}</span>
                          {deal.sampleTrain.name && (
                            <span className="text-slate-400 italic font-sans text-[10px]">
                              "{deal.sampleTrain.name}"
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`font-black text-sm font-mono ${isLowest ? "text-emerald-700" : "text-slate-800"}`}>
                          {deal.lowestFarePln} zł
                        </span>
                        <a
                          href={deal.koleoBookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white px-2 py-0.5 rounded font-medium flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <span>KOLEO</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* List of all reachable cities from origin (Chronotrains style cards) */
          <div>
            <div className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>Trains from {originCity.namePl}</span>
              <span className="text-[11px] font-normal text-slate-500">
                {displayedDestinations.length} destinations
              </span>
            </div>

            <div className="space-y-2">
              {displayedDestinations.map((dest) => {
                const h = Math.floor(dest.fastestDurationMinutes / 60);
                const m = dest.fastestDurationMinutes % 60;
                const timeText = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;

                return (
                  <div
                    key={dest.destinationCityId}
                    onClick={() => onSelectDestination(dest.destinationCityId)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 hover:border-slate-300 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm group-hover:text-sky-700 transition-colors">
                        {dest.destinationCityName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span>{dest.directAvailable ? "Direct" : "1 transfer"}</span>
                        <span>·</span>
                        <span>{timeText}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-700 font-mono">
                        {dest.minPriceNext2WeeksPln} zł
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Adult 2nd cl.
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

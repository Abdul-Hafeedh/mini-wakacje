"use client";

import React from "react";
import { Train, Clock, Wallet, Filter, CalendarDays, RefreshCw, Sparkles, MapPin } from "lucide-react";
import { City } from "@/types/rail";

interface FilterBarProps {
  cities: City[];
  originCityId: string;
  onOriginChange: (cityId: string) => void;
  maxDurationHours: number;
  onMaxDurationChange: (hours: number) => void;
  maxPricePln: number;
  onMaxPriceChange: (price: number) => void;
  directOnly: boolean;
  onDirectOnlyChange: (direct: boolean) => void;
  weekendOnly: boolean;
  onWeekendOnlyChange: (weekend: boolean) => void;
  destinationsCount: number;
  onResetFilters: () => void;
}

export function FilterBar({
  cities,
  originCityId,
  onOriginChange,
  maxDurationHours,
  onMaxDurationChange,
  maxPricePln,
  onMaxPriceChange,
  directOnly,
  onDirectOnlyChange,
  weekendOnly,
  onWeekendOnlyChange,
  destinationsCount,
  onResetFilters
}: FilterBarProps) {
  const currentOrigin = cities.find(c => c.id === originCityId);

  return (
    <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:max-w-4xl z-20 pointer-events-auto">
      <div className="bg-[#121826]/92 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 shadow-2xl flex flex-col gap-3.5 text-slate-100">
        
        {/* Top row: Brand & Origin selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500/20 text-sky-400 p-2 rounded-xl border border-sky-500/30">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">Poland Rail Explorer</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  Next 2 Weeks Lowest Fare Finder
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Where can I travel cheaply from</span>
                <select
                  value={originCityId}
                  onChange={(e) => onOriginChange(e.target.value)}
                  className="bg-slate-800 text-sky-300 font-semibold px-2 py-0.5 rounded border border-slate-700 text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.namePl} ({city.tier})
                    </option>
                  ))}
                </select>
                <span>?</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{destinationsCount} cheap destinations found</span>
            </div>
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Discovery Filter Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center text-xs">
          
          {/* Max Budget Slider */}
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
            <div className="flex justify-between items-center mb-1 text-slate-300">
              <span className="flex items-center gap-1 font-medium">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                Max Budget:
              </span>
              <span className="font-mono text-emerald-300 font-bold">{maxPricePln} zł</span>
            </div>
            <input
              type="range"
              min="15"
              max="150"
              step="5"
              value={maxPricePln}
              onChange={(e) => onMaxPriceChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>15 zł</span>
              <span>150 zł</span>
            </div>
          </div>

          {/* Max Travel Duration Slider */}
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
            <div className="flex justify-between items-center mb-1 text-slate-300">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Max Travel Time:
              </span>
              <span className="font-mono text-sky-300 font-bold">{maxDurationHours}h</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={maxDurationHours}
              onChange={(e) => onMaxDurationChange(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 hour</span>
              <span>8 hours</span>
            </div>
          </div>

          {/* Direct Trains Only Toggle */}
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 flex flex-col justify-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={directOnly}
                onChange={(e) => onDirectOnlyChange(e.target.checked)}
                className="rounded accent-sky-400 bg-slate-900 border-slate-700 cursor-pointer w-4 h-4"
              />
              <span className="text-slate-200 text-xs font-medium">Direct trains only</span>
            </label>
            <span className="text-[10px] text-slate-400">Skip transfers for quick getaways</span>
          </div>

          {/* Weekend Only Toggle */}
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 flex flex-col justify-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={weekendOnly}
                onChange={(e) => onWeekendOnlyChange(e.target.checked)}
                className="rounded accent-amber-400 bg-slate-900 border-slate-700 cursor-pointer w-4 h-4"
              />
              <span className="text-slate-200 text-xs font-medium">Weekend trips (Sat/Sun)</span>
            </label>
            <span className="text-[10px] text-slate-400">Filter for Saturday & Sunday dates</span>
          </div>

        </div>

        {/* Price legend & 2-week insight pill */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
              &lt; 35 zł (Super Promo / Regio)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              35–70 zł (Promo IC)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
              &gt; 70 zł (Long Distance)
            </span>
          </div>
          <span className="hidden sm:inline text-slate-400 font-mono text-[10px]">
            Displays the absolute lowest fare across the upcoming 14 days
          </span>
        </div>

      </div>
    </div>
  );
}

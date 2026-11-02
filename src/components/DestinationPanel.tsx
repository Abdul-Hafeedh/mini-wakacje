"use client";

import React, { useState } from "react";
import { X, Clock, Train, ArrowRight, ExternalLink, Calendar, Sparkles, Tag, ShieldAlert, MapPin, TrendingDown } from "lucide-react";
import { City, DestinationRouteSummary, DayFareDeal } from "@/types/rail";

interface DestinationPanelProps {
  originCity: City;
  destinationCity: City;
  summary: DestinationRouteSummary | null;
  onClose: () => void;
  onSelectAsNewOrigin: (cityId: string) => void;
}

export function DestinationPanel({
  originCity,
  destinationCity,
  summary,
  onClose,
  onSelectAsNewOrigin
}: DestinationPanelProps) {
  const [filterWeekendOnly, setFilterWeekendOnly] = useState<boolean>(false);

  if (!summary) return null;

  const dealsToDisplay = filterWeekendOnly
    ? summary.twoWeekDeals.filter(d => d.isWeekend)
    : summary.twoWeekDeals;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-full max-w-md bg-[#131927]/95 backdrop-blur-2xl border border-slate-700/70 rounded-2xl shadow-2xl flex flex-col z-30 overflow-hidden text-slate-100 transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-1">
            <span>{originCity.namePl}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span>{destinationCity.namePl}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {destinationCity.namePl}
            <span className="text-xs font-normal text-slate-400">({destinationCity.voivodeship})</span>
          </h2>
          <div className="text-xs text-slate-400 mt-0.5">
            Station: {destinationCity.primaryStationName} · Rail distance: ~{summary.distanceKm} km
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2-Week Lowest Price Highlight Card */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 to-slate-900/60 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Cheapest in Next 2 Weeks
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-300 font-mono">
                {summary.minPriceNext2WeeksPln} zł
              </span>
              <span className="text-xs text-slate-400 line-through">
                {summary.standardPricePln} zł base
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                -{summary.savingsPercent}%
              </span>
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Best day to travel: <strong className="text-white">{summary.bestTravelDay}</strong>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Fastest journey</div>
            <div className="text-base font-bold text-sky-400 font-mono">
              {Math.floor(summary.fastestDurationMinutes / 60)}h {summary.fastestDurationMinutes % 60}m
            </div>
            <div className="text-[10px] text-slate-400">
              {summary.directAvailable ? "Direct connection" : "1 change"}
            </div>
          </div>
        </div>
      </div>

      {/* Filter / View Bar for the 14-day calendar */}
      <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs bg-slate-900/40">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          <span>Daily Lowest Fares (Next 14 Days)</span>
        </div>
        <button
          onClick={() => setFilterWeekendOnly(!filterWeekendOnly)}
          className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
            filterWeekendOnly
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
          }`}
        >
          {filterWeekendOnly ? "Weekends only (Active)" : "Show weekends only"}
        </button>
      </div>

      {/* 14-Day Calendar List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {dealsToDisplay.map((deal) => {
          const isCheapestDay = deal.lowestFarePln === summary.minPriceNext2WeeksPln;

          let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
          if (deal.fareTier === "Super Promo") {
            badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold";
          } else if (deal.fareTier === "Promo") {
            badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
          }

          return (
            <div
              key={deal.date}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isCheapestDay
                  ? "bg-emerald-950/20 border-emerald-500/50 ring-1 ring-emerald-500/30"
                  : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${deal.isWeekend ? "text-amber-300" : "text-white"}`}>
                    {deal.dayOfWeek}
                  </span>
                  {deal.isWeekend && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/30">
                      Weekend
                    </span>
                  )}
                  {isCheapestDay && (
                    <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black tracking-wide">
                      LOWEST
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 font-mono">
                  <span>{deal.sampleTrain.departureTime} → {deal.sampleTrain.arrivalTime}</span>
                  <span>·</span>
                  <span>{deal.fastestDurationFormatted}</span>
                  <span>·</span>
                  <span className="text-slate-300">{deal.sampleTrain.number}</span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {deal.lowestFarePln} zł
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${badgeColor}`}>
                    {deal.fareTier}
                  </span>
                </div>

                <a
                  href={deal.koleoBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-0.5 font-medium"
                >
                  <span>Book KOLEO</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelectAsNewOrigin(destinationCity.id)}
          className="w-full py-2 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-sky-500/20"
        >
          <MapPin className="w-3.5 h-3.5" />
          Explore from {destinationCity.namePl} instead
        </button>
      </div>
    </div>
  );
}

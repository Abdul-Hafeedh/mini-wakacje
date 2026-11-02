"use client";

import React, { useState } from "react";
import { Train, Heart, Info, MapPin, Compass, X } from "lucide-react";

export function ChronotrainsHeader() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <header className="h-12 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between z-30 shrink-0 shadow-xs select-none">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          {/* Chronotrains ticket-style train badge */}
          <div className="flex items-center">
            <div className="h-6 w-9 bg-emerald-600 rounded-sm flex items-center justify-center relative overflow-hidden shadow-xs border border-emerald-700">
              {/* Ticket cutouts on the sides */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
              {/* Stylized train window bar */}
              <div className="h-1.5 w-4 bg-emerald-200 rounded-xs"></div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="font-bold text-slate-900 text-lg tracking-tight font-sans">
              Mini Wakacje
            </span>
          </div>
        </div>

        {/* Navigation links matching Chronotrains header */}
        <nav className="flex items-center gap-4 md:gap-6 text-xs text-slate-600 font-medium">
          <button
            onClick={() => {
              // scroll to explorer / clear filters if clicked
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="hover:text-slate-900 transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Odkrywaj trasy</span>
          </button>

          <button
            onClick={() => setShowAbout(true)}
            className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>O projekcie</span>
          </button>

          <a
            href="https://koleo.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2.5 py-1 rounded-full transition-all text-xs font-semibold shadow-xs"
          >
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span>Bilety na KOLEO</span>
          </a>
        </nav>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-9 bg-emerald-600 rounded-sm flex items-center justify-center relative overflow-hidden shadow-xs border border-emerald-700">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
                <div className="h-1.5 w-4 bg-emerald-200 rounded-xs"></div>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Mini Wakacje (Polska)</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Interaktywny eksplorator najtańszych połączeń kolejowych po Polsce w perspektywie najbliższych 14 dni, inspirowany platformą <em>Chronotrains</em>.
            </p>
            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 font-mono">
              <div>✓ Prawdziwe taryfy i bilety z platformy KOLEO</div>
              <div>✓ Rozkłady PKP Intercity, KM, Polregio, ŁKA i KD</div>
              <div>✓ Filtr destynacji turystycznych i weekendowych</div>
            </div>
            <div className="text-right">
              <button
                onClick={() => setShowAbout(false)}
                className="text-xs font-semibold px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


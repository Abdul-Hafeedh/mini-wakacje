"use client";

import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { City, DestinationRouteSummary } from "@/types/rail";
import { generateCurvedGeoJSON } from "@/lib/rail-utils";
import { generateIsochroneZonesGeoJSON } from "@/lib/isochrone";

interface RailMapProps {
  cities: City[];
  originCity: City;
  destinations: DestinationRouteSummary[];
  selectedDestCityId: string | null;
  onSelectCity: (cityId: string) => void;
  maxTravelHours: number;
}

export function RailMap({
  cities,
  originCity,
  destinations,
  selectedDestCityId,
  onSelectCity,
  maxTravelHours
}: RailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [currentZoom, setCurrentZoom] = useState<number>(6.5);

  // Initialize MapLibre with light cartography and Poland-centric view
  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "esri-light-base": {
            type: "raster",
            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "Esri, HERE, Garmin, © OpenStreetMap contributors"
          },
          "esri-light-labels": {
            type: "raster",
            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: "esri-light-base-layer",
            type: "raster",
            source: "esri-light-base",
            minzoom: 0,
            maxzoom: 18,
            paint: {
              "raster-opacity": 0.98
            }
          },
          {
            id: "esri-light-labels-layer",
            type: "raster",
            source: "esri-light-labels",
            minzoom: 0,
            maxzoom: 18,
            paint: {
              "raster-opacity": 0.35
            }
          }
        ]
      },
      center: [19.3, 52.1], // Poland center
      zoom: 6.5,
      minZoom: 5.5,
      maxZoom: 13,
      pitchWithRotate: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("zoom", () => {
      setCurrentZoom(map.getZoom());
    });

    map.on("load", () => {
      // 1. Isochrone travel time coverage layers
      map.addSource("isochrones", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });

      map.addLayer({
        id: "isochrones-fill",
        type: "fill",
        source: "isochrones",
        paint: {
          "fill-color": ["get", "fillColor"],
          "fill-outline-color": ["get", "strokeColor"]
        }
      });

      map.addLayer({
        id: "isochrones-stroke",
        type: "line",
        source: "isochrones",
        paint: {
          "line-color": ["get", "strokeColor"],
          "line-width": 1.5,
          "line-opacity": 0.6
        }
      });

      // 2. Rail transit connection line for active route
      map.addSource("rail-routes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });

      map.addLayer({
        id: "rail-routes-glow",
        type: "line",
        source: "rail-routes",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#0284c7",
          "line-width": 6,
          "line-opacity": 0.25,
          "line-blur": 3
        }
      });

      map.addLayer({
        id: "rail-routes-line",
        type: "line",
        source: "rail-routes",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#0284c7",
          "line-width": 2.5,
          "line-opacity": 0.95
        }
      });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update Chronotrains isochrone coverage rings
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("isochrones") as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    const data = generateIsochroneZonesGeoJSON(originCity, maxTravelHours);
    source.setData(data);
  }, [originCity, maxTravelHours]);

  // Update selected route line
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("rail-routes") as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    if (!selectedDestCityId) {
      source.setData({ type: "FeatureCollection", features: [] });
      return;
    }

    const selectedDest = destinations.find(d => d.destinationCityId === selectedDestCityId);
    if (!selectedDest) {
      source.setData({ type: "FeatureCollection", features: [] });
      return;
    }

    const coords = generateCurvedGeoJSON(
      [originCity.lng, originCity.lat],
      [selectedDest.lng, selectedDest.lat]
    );

    source.setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coords
          }
        }
      ]
    });
  }, [originCity, destinations, selectedDestCityId]);

  // Update Chronotrains-style elegant pins
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const destMap = new Map<string, DestinationRouteSummary>(
      destinations.map(d => [d.destinationCityId, d])
    );

    // At zoom < 7.2, avoid heavy overlaps in dense metropolitan areas like Upper Silesia
    // by prioritizing primary regional hub cities (Katowice, Gliwice, Sosnowiec)
    const isLowZoom = currentZoom < 7.0;
    const silesiaSecondaryIds = new Set(["chorzow", "bytom", "zabrze", "ruda-slaska", "tychy", "dabrowa-gornicza", "jaworzno", "jastrzebie-zdroj"]);

    cities.forEach((city) => {
      const isOrigin = city.id === originCity.id;
      const destSummary = destMap.get(city.id);
      const isSelected = city.id === selectedDestCityId;

      // If low zoom and it's a tight secondary cluster neighbor, show a clean micro dot to keep map breathing
      const isClusteredMicro = isLowZoom && silesiaSecondaryIds.has(city.id) && !isSelected;

      const el = document.createElement("div");

      if (isOrigin) {
        // Chronotrains Origin Pin: Clean pill with black bullseye
        el.className = "cursor-default select-none z-10";
        el.innerHTML = `
          <div class="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1 rounded-full shadow-lg border border-slate-700 font-bold text-xs">
            <span class="w-2 h-2 rounded-full bg-white ring-2 ring-slate-400"></span>
            <span>${city.namePl}</span>
          </div>
        `;
      } else if (destSummary && !isClusteredMicro) {
        // Chronotrains Destination Pin: Static, jitter-free capsule
        el.className = "cursor-pointer select-none";
        
        const h = Math.floor(destSummary.fastestDurationMinutes / 60);
        const m = destSummary.fastestDurationMinutes % 60;
        const timeText = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;

        const activeStyles = isSelected
          ? "bg-slate-950 text-white ring-2 ring-sky-500 shadow-xl border-slate-950"
          : "bg-white text-slate-800 border-slate-300 shadow-sm hover:border-slate-500 hover:shadow-md";

        const priceColor = isSelected ? "text-emerald-300" : "text-emerald-700";
        const timeColor = isSelected ? "text-slate-300" : "text-slate-500";
        const dotBg = isSelected ? "bg-emerald-300" : "bg-emerald-600";

        el.innerHTML = `
          <div class="flex items-center gap-2 px-2.5 py-1 rounded-full border ${activeStyles} text-xs">
            <span class="w-1.5 h-1.5 rounded-full ${dotBg} shrink-0"></span>
            <span class="font-bold text-[12px] tracking-tight whitespace-nowrap">
              ${city.namePl}
            </span>
            <span class="text-[11px] ${timeColor} font-medium whitespace-nowrap">
              ${timeText}
            </span>
            <span class="font-black ${priceColor} font-mono text-[11px] whitespace-nowrap">
              ${destSummary.minPriceNext2WeeksPln} zł
            </span>
          </div>
        `;
      } else if (destSummary && isClusteredMicro) {
        // Micro pill for dense cluster at zoom < 7
        el.className = "cursor-pointer select-none";
        el.innerHTML = `
          <div class="flex items-center gap-1 bg-white border border-slate-300 px-1.5 py-0.5 rounded-full shadow-xs text-[10px]" title="${city.namePl}: ${destSummary.minPriceNext2WeeksPln} zł">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span class="font-bold text-slate-800">${city.namePl}</span>
          </div>
        `;
      } else {
        // Subtle minor dot for cities outside filter
        el.className = "cursor-pointer opacity-30 hover:opacity-100";
        el.innerHTML = `
          <div class="w-2 h-2 rounded-full bg-slate-400 border border-white shadow-xs" title="${city.namePl}"></div>
        `;
      }

      el.addEventListener("click", () => {
        onSelectCity(city.id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([city.lng, city.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

  }, [cities, originCity, destinations, selectedDestCityId, onSelectCity, currentZoom]);

  return (
    <div className="relative w-full h-full bg-[#f1f5f9]">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

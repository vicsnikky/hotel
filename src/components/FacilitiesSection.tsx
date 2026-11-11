import React from 'react';
import {
  BedDouble,
  Home,
  Sparkles,
  Trophy,
  Zap,
  Tv,
  Wifi,
  HeartHandshake,
  UtensilsCrossed,
  LucideIcon,
} from 'lucide-react';
import { FacilityItem } from '../types/hotel';

interface FacilitiesSectionProps {
  facilities: FacilityItem[];
  onBookClick: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  BedDouble,
  Home,
  Sparkles,
  Trophy,
  Zap,
  Tv,
  Wifi,
  HeartHandshake,
  UtensilsCrossed,
};

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ facilities, onBookClick }) => {
  return (
    <section id="facilities" className="py-24 bg-[#FAF8F5] text-[#1F2421] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#A4813D] mb-3">
            <span>Amenities & Hospitality</span>
            <span aria-hidden="true">·</span>
            <span>Uninterrupted Comfort</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#143621] tracking-tight mb-4">
            World-Class Facilities & Services
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            From round-the-clock electricity to ergonomic orthopaedic beds and our 24-hour restaurant, every service at Countryside Hotel is designed to make your stay effortless.
          </p>
        </div>

        {/* 9 Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, index) => {
            const Icon = ICON_MAP[fac.iconName] || Sparkles;
            return (
              <div
                key={fac.id}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Facility Image preview */}
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                    <span className="text-xs font-mono tabular-nums text-[#DFC794]">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-xs font-medium text-white/90">{fac.shortDesc}</span>
                  </div>
                </div>

                {/* Facility Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#143621]/5 text-[#143621] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#C5A059]" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[#143621]">
                        {fac.title}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span>Available to all guests</span>
                    <span className="text-[#A4813D] font-medium">Included</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner strip */}
        <div className="mt-16 bg-[#143621] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-serif font-bold text-[#DFC794] mb-2">
              Ready to unwind at Countryside Hotel?
            </h3>
            <p className="text-sm text-white/80 max-w-xl">
              Enjoy our club lounge, snooker games, 24-hour restaurant, and reliable electricity. Book your stay or contact our front desk today.
            </p>
          </div>
          <button
            type="button"
            onClick={onBookClick}
            className="px-6 py-3 bg-[#C5A059] hover:bg-[#DFC794] active:bg-[#A4813D] text-[#143621] font-semibold text-sm uppercase tracking-wider rounded transition-colors whitespace-nowrap shrink-0 shadow"
          >
            Reserve Your Room
          </button>
        </div>
      </div>
    </section>
  );
};

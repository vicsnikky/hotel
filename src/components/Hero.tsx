import React, { useState } from 'react';
import { ShieldCheck, Zap, BedDouble, Calendar, ArrowRight } from 'lucide-react';
import { HotelInfo } from '../types/hotel';

interface HeroProps {
  hotelInfo: HotelInfo;
  onOpenBookingWithDefaults?: (details: { checkIn: string; checkOut: string; guests: number }) => void;
  onExploreFacilities: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  hotelInfo,
  onOpenBookingWithDefaults,
  onExploreFacilities,
}) => {
  // Quick dates setup
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(1);

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenBookingWithDefaults) {
      onOpenBookingWithDefaults({ checkIn, checkOut, guests });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Depth Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_countryside_hotel_1794315266996.jpg"
          alt="Countryside Hotel entrance and grounds in Ogun State"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Measured Scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2214] via-[#0B2214]/65 to-[#0B2214]/75" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white my-auto">
        {/* Official Hotel & Lounge Crest Logo */}
        <div className="mb-4 inline-block">
          <img
            src="/logo.jpg"
            alt="Countryside Hotel & Lounge Crest"
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto object-cover rounded-full border-2 border-[#C5A059] shadow-2xl bg-black"
          />
        </div>

        {/* Editorial Subtitle / Trust Kicker (no pills) */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm tracking-widest uppercase text-[#DFC794] font-medium mb-3">
          <span>{hotelInfo.name} & Lounge</span>
          <span aria-hidden="true" className="text-[#C5A059]">·</span>
          <span>Ijoko Road, Ogun State</span>
          <span aria-hidden="true" className="text-[#C5A059]">·</span>
          <span>Est. {hotelInfo.established}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto text-balance">
          {hotelInfo.slogan}
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto font-normal leading-relaxed mb-9">
          Experience exceptional comfort, relaxation and hospitality at Countryside Hotel. Your peaceful home away from home in Ogun State, Nigeria.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            type="button"
            onClick={() => onOpenBookingWithDefaults?.({ checkIn, checkOut, guests })}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A059] hover:bg-[#DFC794] active:bg-[#A4813D] text-[#143621] font-semibold text-sm uppercase tracking-wider rounded transition-all duration-150 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group whitespace-nowrap"
          >
            <span>Book a Room</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={onExploreFacilities}
            className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/30 hover:border-white/60 font-medium text-sm rounded transition-all duration-150 backdrop-blur-sm whitespace-nowrap"
          >
            Explore Our Facilities
          </button>
        </div>

        {/* Quick Reservation Search Strip */}
        <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-5 shadow-2xl border border-[#C5A059]/30 text-[#1F2421]">
          <form onSubmit={handleQuickBook} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
            <div className="text-left">
              <label htmlFor="check-in" className="block text-xs font-semibold uppercase tracking-wider text-[#143621] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Check-In</span>
              </label>
              <input
                id="check-in"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                required
              />
            </div>

            <div className="text-left">
              <label htmlFor="check-out" className="block text-xs font-semibold uppercase tracking-wider text-[#143621] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Check-Out</span>
              </label>
              <input
                id="check-out"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                required
              />
            </div>

            <div className="text-left">
              <label htmlFor="guests-count" className="block text-xs font-semibold uppercase tracking-wider text-[#143621] mb-1.5">
                Guests
              </label>
              <select
                id="guests-count"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={5}>5+ Guests (Apartment)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#143621] hover:bg-[#1E4D30] text-[#DFC794] font-semibold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors shadow"
              >
                Check Availability
              </button>
            </div>
          </form>
        </div>

        {/* 4 Trust Markers Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-white/10 pt-6">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80">
            <BedDouble className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>20 Rooms & 3 Apartments</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80">
            <Zap className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>24-Hour Electricity</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>24/7 Gated Security</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0" />
            <span>Established October 2024</span>
          </div>
        </div>
      </div>
    </section>
  );
};

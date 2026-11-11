import React, { useState } from 'react';
import { Bed, Users, Tv, Zap, Check, ArrowRight, Sparkles } from 'lucide-react';
import { RoomCategory } from '../types/hotel';

interface RoomsSectionProps {
  rooms: RoomCategory[];
  onSelectRoomForBooking: (room: RoomCategory) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({ rooms, onSelectRoomForBooking }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'room' | 'apartment'>('all');

  const filteredRooms = rooms.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.type === activeFilter;
  });

  const totalRoomUnits = rooms
    .filter((r) => r.type === 'room')
    .reduce((acc, curr) => acc + curr.totalUnits, 0);

  const totalApartmentUnits = rooms
    .filter((r) => r.type === 'apartment')
    .reduce((acc, curr) => acc + curr.totalUnits, 0);

  return (
    <section id="rooms" className="py-24 bg-white text-[#1F2421] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#A4813D] mb-3">
              <span>Accommodations</span>
              <span aria-hidden="true">·</span>
              <span>20 Rooms & 3 Apartments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#143621] tracking-tight">
              Rooms & Spacious Apartments
            </h2>
            <p className="text-neutral-600 mt-3 text-base">
              Each accommodation is thoughtfully furnished with orthopaedic bedding, smart television, round-the-clock electricity, and full internet access.
            </p>
          </div>

          {/* Interactive Filter Control */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#143621] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Accommodations ({rooms.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('room')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeFilter === 'room'
                  ? 'bg-[#143621] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Guest Rooms ({totalRoomUnits} Units)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('apartment')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeFilter === 'apartment'
                  ? 'bg-[#143621] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Apartments ({totalApartmentUnits} Units)
            </button>
          </div>
        </div>

        {/* Accommodation Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {filteredRooms.map((room) => {
            const isApartment = room.type === 'apartment';
            return (
              <div
                key={room.id}
                className="group bg-[#FAF8F5] rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Photo Header */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top badges without pill sandwich */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-[#143621]/90 backdrop-blur-xs text-[#DFC794] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded">
                      {isApartment ? 'Spacious Apartment' : 'Guest Room'}
                    </span>
                    {room.totalUnits > 0 && (
                      <span className="bg-black/60 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded">
                        {room.totalUnits} Units
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded ${
                        room.status === 'Available'
                          ? 'bg-emerald-900/90 text-emerald-200'
                          : 'bg-amber-900/90 text-amber-200'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-4 text-xs text-white/90">
                      <span className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-[#DFC794]" />
                        <span>{room.bedType}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#DFC794]" />
                        <span>Up to {room.maxGuests} Guests</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Title and Price */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#143621]">
                        {room.name}
                      </h3>
                      <div className="text-right sm:shrink-0">
                        <div className="text-sm sm:text-base font-semibold text-[#A4813D]">
                          {room.pricePerNight}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {room.pricePerNight.includes('Request')
                            ? 'Management confirmed upon booking'
                            : 'Per night stay'}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                      {room.description}
                    </p>

                    {/* Features checklist */}
                    <div className="mb-6">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5">
                        Room Facilities & Amenities
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {room.facilities.map((fac, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                            <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                            <span>{fac}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <div className="pt-5 border-t border-neutral-200/80 flex items-center justify-between gap-4">
                    <div className="text-xs text-neutral-500">
                      <span>24h Electricity</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>Orthopaedic Bed</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectRoomForBooking(room)}
                      className="px-5 py-2.5 bg-[#143621] hover:bg-[#1E4D30] text-[#DFC794] font-semibold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-xs group"
                    >
                      <span>Book This Room</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on room pricing */}
        <div className="mt-12 p-4 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/30 text-xs text-neutral-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A4813D] shrink-0" />
            <span>
              <strong>Management Note:</strong> Room rates are maintained by the hotel administration. You can submit a booking reservation inquiry online without any upfront payment.
            </span>
          </div>
          <a href="#contact" className="text-[#143621] font-semibold hover:underline whitespace-nowrap">
            Contact Front Desk →
          </a>
        </div>
      </div>
    </section>
  );
};

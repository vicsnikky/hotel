import React from 'react';
import { Shield, Sparkles, HeartHandshake, Clock, Bed, Users } from 'lucide-react';
import { HotelInfo } from '../types/hotel';

interface AboutSectionProps {
  hotelInfo: HotelInfo;
  onBookClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ hotelInfo, onBookClick }) => {
  const pillars = [
    {
      title: 'Comfort & Rest',
      desc: 'Orthopaedic bedding and tranquil acoustics engineered to give you deep, restorative sleep.',
      icon: Bed,
    },
    {
      title: 'Uncompromised Security',
      desc: '24/7 guarded security, access management, and peaceful walled surroundings for your complete peace of mind.',
      icon: Shield,
    },
    {
      title: 'True Hospitality',
      desc: 'Attentive, courteous staff dedicated to making every minute of your stay seamless and pleasant.',
      icon: HeartHandshake,
    },
    {
      title: '24-Hour Reliability',
      desc: 'Continuous round-the-clock power supply and 24-hour restaurant culinary service whenever you need it.',
      icon: Clock,
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#FAF8F5] text-[#1F2421] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#A4813D] mb-3">
            <span>About Us</span>
            <span aria-hidden="true">·</span>
            <span>Est. {hotelInfo.established}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#143621] tracking-tight leading-tight mb-6">
            Welcome to Countryside Hotel – Your Comfort, Our Priority!
          </h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            Established in October 2024, Countryside Hotel is a home away from home, offering guests a perfect blend of comfort, relaxation, hospitality, and quality service.
          </p>
        </div>

        {/* 2-Column Story & Photographic Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          {/* Left Column: Hospitality Narrative */}
          <div className="lg:col-span-7 space-y-6 text-neutral-700 leading-relaxed text-base">
            <p>
              We are committed to providing a peaceful, secure, and welcoming environment where every guest feels valued and enjoys a memorable stay.
            </p>
            <p>
              With our well-maintained rooms, clean surroundings, modern entertainment facilities, and excellent hospitality services, we make your comfort our top priority.
            </p>
            <p>
              Whether you are visiting for business, leisure, relaxation, or a special occasion, Countryside Hotel provides the perfect environment for you to unwind and enjoy yourself.
            </p>
            <p className="font-serif italic text-lg text-[#143621] pt-2">
              "Experience comfort, convenience, and exceptional hospitality at Countryside Hotel."
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={onBookClick}
                className="px-6 py-3 bg-[#143621] hover:bg-[#1E4D30] text-[#DFC794] font-medium text-sm rounded shadow transition-colors"
              >
                Plan Your Stay
              </button>
              <div className="text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800">Location:</span> 5, Ilesanmi Close, Delman Bustop, Ijoko Road, Ogun State
              </div>
            </div>
          </div>

          {/* Right Column: Composite Visual Anchor with Authentic Photos */}
          <div className="lg:col-span-5 relative space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#C5A059]/30 relative group">
              <img
                src="/images/countryside_welcome_hallway.jpg"
                alt="Welcome to Countryside Hotel mural hallway"
                className="w-full h-72 sm:h-80 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#DFC794] block">
                  Signature Entrance Walkway
                </span>
                <span className="font-serif text-lg font-bold">Welcome to Countryside</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden shadow-md border border-neutral-200/80 group">
                <img
                  src="/images/countryside_actual_room.jpg"
                  alt="Countryside Hotel guest room and orthopaedic bed"
                  className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="p-2.5 bg-white text-[11px] text-neutral-700 font-medium">
                  Orthopaedic Bed & Lounge
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-md border border-neutral-200/80 group">
                <img
                  src="/images/countryside_garden_lounge.jpg"
                  alt="Countryside Hotel indoor garden lounge"
                  className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="p-2.5 bg-white text-[11px] text-neutral-700 font-medium">
                  Indoor Garden Terrace
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Brand Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-neutral-200">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 bg-white rounded-xl border border-neutral-200/80 shadow-xs hover:border-[#C5A059]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#143621]/5 text-[#143621] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h3 className="text-base font-semibold text-[#143621] mb-2">{pillar.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

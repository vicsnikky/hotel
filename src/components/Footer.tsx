import React from 'react';
import { MapPin, Phone, Mail, Shield, ExternalLink, Heart } from 'lucide-react';
import { HotelInfo } from '../types/hotel';

interface FooterProps {
  hotelInfo: HotelInfo;
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
  onOpenLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  hotelInfo,
  onOpenAdmin,
  onOpenBooking,
  onOpenLookup,
}) => {
  return (
    <footer className="bg-[#0B2214] text-white border-t border-[#C5A059]/25 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Slogan Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Countryside Hotel & Lounge Logo"
                className="w-12 h-12 object-cover rounded-full border border-[#C5A059]/50 bg-black shadow-md shrink-0"
              />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {hotelInfo.name} & Lounge
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#DFC794] font-semibold">
              {hotelInfo.slogan}
            </p>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Established in October 2024. Offering 20 comfortable guest rooms, 3 spacious apartments, 24-hour electricity, club room & snooker lounge, and 24-hour restaurant hospitality in Ogun State, Nigeria.
            </p>

            {/* TikTok Social */}
            <div className="pt-2">
              <a
                href={hotelInfo.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/15 text-xs text-neutral-300 hover:text-white transition-colors border border-white/10"
              >
                <svg className="w-4 h-4 fill-current text-[#DFC794]" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.65a8.28 8.28 0 0 0 4.9 1.58V6.78c-.33 0-.67-.03-1-.09z"/>
                </svg>
                <span>Follow on TikTok: {hotelInfo.tiktokHandle}</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DFC794]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-white transition-colors">Guest Rooms (20 Units)</a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-white transition-colors">Spacious Apartments (3 Units)</a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition-colors">Facilities & Amenities</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">Photo Gallery</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Location & Contact</a>
              </li>
            </ul>
          </div>

          {/* Guest Services & Location Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DFC794]">
              Guest Care & Inquiries
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{hotelInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{hotelInfo.phonePlaceholder}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{hotelInfo.emailPlaceholder}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-3.5 py-1.5 bg-[#C5A059] text-[#143621] font-semibold text-xs rounded hover:bg-[#DFC794] transition-colors"
              >
                Book a Room
              </button>
              <button
                type="button"
                onClick={onOpenLookup}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
              >
                Track Booking
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs rounded transition-colors"
              >
                <Shield className="w-3 h-3 text-[#C5A059]" />
                <span>Staff Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEO Tagline & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} Countryside Hotel. All rights reserved. Your Comfort, Our Priority.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
            <span>Hotels in Ijoko</span>
            <span>·</span>
            <span>Delman Bustop Accommodation</span>
            <span>·</span>
            <span>Ogun State Hotels</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

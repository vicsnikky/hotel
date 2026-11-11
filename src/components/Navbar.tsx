import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, CalendarCheck } from 'lucide-react';
import { HotelInfo } from '../types/hotel';

interface NavbarProps {
  hotelInfo: HotelInfo;
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hotelInfo,
  onOpenBooking,
  onOpenLookup,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Rooms & Suites', href: '#rooms' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location & Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#143621]/95 backdrop-blur-md shadow-lg border-b border-[#C5A059]/20 py-3.5'
            : 'bg-gradient-to-b from-[#0B2214]/90 via-[#0B2214]/60 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar 3-Zone Contract */}
          <div className="flex items-center justify-between gap-8">
            {/* Zone 1: Brand Logo & Title */}
            <a
              href="#"
              className="text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tight text-white hover:text-[#DFC794] transition-colors whitespace-nowrap shrink-0 flex items-center gap-3"
            >
              <img
                src="/logo.jpg"
                alt="Countryside Hotel & Lounge Crest"
                className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full border border-[#C5A059]/50 bg-black shadow-md shrink-0"
              />
              <span className="flex flex-col">
                <span className="leading-tight">{hotelInfo.name}</span>
                <span className="text-[10px] tracking-widest uppercase font-sans font-medium text-[#DFC794]/90">Hotel & Lounge</span>
              </span>
            </a>

            {/* Zone 2: Single-line text navigation links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/90">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-[#C5A059] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#C5A059]"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={onOpenLookup}
                className="flex items-center gap-1.5 text-xs text-[#DFC794] hover:text-white transition-colors whitespace-nowrap shrink-0 px-2 py-1 rounded border border-[#C5A059]/30 hover:border-[#C5A059]"
                title="Check your reservation status"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Track Booking</span>
              </button>
            </nav>

            {/* Zone 3: Primary Action & Admin trigger */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors px-2.5 py-1.5 rounded border border-white/10 hover:border-white/30 whitespace-nowrap shrink-0"
                title="Management Portal"
              >
                <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Staff Portal</span>
              </button>

              <button
                type="button"
                onClick={onOpenBooking}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#143621] bg-[#C5A059] hover:bg-[#DFC794] active:bg-[#A4813D] rounded transition-all duration-150 shadow-md whitespace-nowrap shrink-0"
              >
                Book a Room
              </button>

              {/* Mobile menu hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white/90 hover:text-[#C5A059] transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B2214] border-b border-[#C5A059]/30 px-5 pt-3 pb-6 mt-3 space-y-3 shadow-2xl">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/90 hover:text-[#C5A059] text-base font-medium py-1.5 border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLookup();
                }}
                className="w-full text-left py-2 text-sm text-[#DFC794] flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Find / Track My Reservation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-left py-2 text-sm text-white/70 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#C5A059]" />
                <span>Hotel Administrator Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full mt-2 py-3 text-center text-sm font-semibold tracking-wider uppercase text-[#143621] bg-[#C5A059] rounded"
              >
                Book a Room Now
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

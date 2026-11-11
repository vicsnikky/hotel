/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { storage } from './services/storage';
import { HotelInfo, RoomCategory, FacilityItem, GalleryItem, Reservation, ContactEnquiry } from './types/hotel';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { RoomsSection } from './components/RoomsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { BookingLookupModal } from './components/BookingLookupModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>(storage.getHotelInfo());
  const [rooms, setRooms] = useState<RoomCategory[]>(storage.getRooms());
  const [facilities, setFacilities] = useState<FacilityItem[]>(storage.getFacilities());
  const [gallery, setGallery] = useState<GalleryItem[]>(storage.getGallery());
  const [reservations, setReservations] = useState<Reservation[]>(storage.getReservations());
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(storage.getEnquiries());

  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<RoomCategory | null>(null);
  const [defaultBookingDates, setDefaultBookingDates] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);

  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync state from storage
  const refreshAllData = useCallback(() => {
    setHotelInfo(storage.getHotelInfo());
    setRooms(storage.getRooms());
    setFacilities(storage.getFacilities());
    setGallery(storage.getGallery());
    setReservations(storage.getReservations());
    setEnquiries(storage.getEnquiries());
  }, []);

  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshAllData();
    };

    window.addEventListener('countryside_data_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('countryside_data_updated', handleStorageUpdate);
    };
  }, [refreshAllData]);

  // Handler for opening booking from Hero search bar
  const handleOpenBookingWithDefaults = (details: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    setDefaultBookingDates(details);
    setSelectedRoomForBooking(null);
    setIsBookingOpen(true);
  };

  // Handler for booking a specific room
  const handleSelectRoomForBooking = (room: RoomCategory) => {
    setSelectedRoomForBooking(room);
    setIsBookingOpen(true);
  };

  const scrollToFacilities = () => {
    const el = document.getElementById('facilities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2421] font-sans selection:bg-[#C5A059] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        hotelInfo={hotelInfo}
        onOpenBooking={() => {
          setSelectedRoomForBooking(null);
          setIsBookingOpen(true);
        }}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <Hero
          hotelInfo={hotelInfo}
          onOpenBookingWithDefaults={handleOpenBookingWithDefaults}
          onExploreFacilities={scrollToFacilities}
        />

        {/* About Us Section */}
        <AboutSection
          hotelInfo={hotelInfo}
          onBookClick={() => {
            setSelectedRoomForBooking(null);
            setIsBookingOpen(true);
          }}
        />

        {/* Rooms & Apartments Section */}
        <RoomsSection
          rooms={rooms}
          onSelectRoomForBooking={handleSelectRoomForBooking}
        />

        {/* Facilities Section */}
        <FacilitiesSection
          facilities={facilities}
          onBookClick={() => {
            setSelectedRoomForBooking(null);
            setIsBookingOpen(true);
          }}
        />

        {/* Photo Gallery Section */}
        <GallerySection gallery={gallery} />

        {/* Location & Contact Section */}
        <ContactSection hotelInfo={hotelInfo} />
      </main>

      {/* Footer */}
      <Footer
        hotelInfo={hotelInfo}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={() => {
          setSelectedRoomForBooking(null);
          setIsBookingOpen(true);
        }}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp hotelInfo={hotelInfo} />

      {/* Booking / Reservation Modal */}
      <ReservationModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedRoomForBooking(null);
        }}
        rooms={rooms}
        hotelInfo={hotelInfo}
        preSelectedRoom={selectedRoomForBooking}
        defaultDates={defaultBookingDates}
      />

      {/* Booking Lookup / Status Tracking Modal */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        hotelInfo={hotelInfo}
      />

      {/* Hotel Administrator Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        hotelInfo={hotelInfo}
        rooms={rooms}
        facilities={facilities}
        gallery={gallery}
        reservations={reservations}
        enquiries={enquiries}
        onDataRefresh={refreshAllData}
      />
    </div>
  );
}

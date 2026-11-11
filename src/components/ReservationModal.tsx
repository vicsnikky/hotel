import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  MessageSquare,
  ShieldAlert,
  Bed,
  Users,
} from 'lucide-react';
import { RoomCategory, Reservation, HotelInfo } from '../types/hotel';
import { storage } from '../services/storage';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: RoomCategory[];
  hotelInfo: HotelInfo;
  preSelectedRoom?: RoomCategory | null;
  defaultDates?: { checkIn: string; checkOut: string; guests: number } | null;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  rooms,
  hotelInfo,
  preSelectedRoom,
  defaultDates,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [checkInDate, setCheckInDate] = useState(defaultDates?.checkIn || today);
  const [checkOutDate, setCheckOutDate] = useState(defaultDates?.checkOut || tomorrow);
  const [numberOfGuests, setNumberOfGuests] = useState(defaultDates?.guests || 1);
  const [specialRequests, setSpecialRequests] = useState('');

  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync pre-selected room
  useEffect(() => {
    if (preSelectedRoom) {
      setSelectedRoomId(preSelectedRoom.id);
    } else if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [preSelectedRoom, rooms, selectedRoomId]);

  // Sync default dates if provided
  useEffect(() => {
    if (defaultDates) {
      if (defaultDates.checkIn) setCheckInDate(defaultDates.checkIn);
      if (defaultDates.checkOut) setCheckOutDate(defaultDates.checkOut);
      if (defaultDates.guests) setNumberOfGuests(defaultDates.guests);
    }
  }, [defaultDates]);

  if (!isOpen) return null;

  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Calculate nights
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const created = storage.createReservation({
        guestName,
        phone,
        email,
        roomId: currentRoom.id,
        roomName: currentRoom.name,
        checkInDate,
        checkOutDate,
        numberOfGuests: Number(numberOfGuests),
        specialRequests,
      });

      setConfirmedReservation(created);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const cleanWhatsapp = hotelInfo.whatsappPlaceholder.replace(/[^0-9]/g, '');
  const whatsappBookingMsg = confirmedReservation
    ? encodeURIComponent(
        `Hello Countryside Hotel, I just submitted reservation ${confirmedReservation.bookingRef} for ${confirmedReservation.roomName} (${confirmedReservation.checkInDate} to ${confirmedReservation.checkOutDate}). Please confirm room availability.`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#143621] text-white p-6 flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Countryside Hotel Logo"
              className="w-11 h-11 object-cover rounded-full border border-[#C5A059]/50 bg-black shadow-md shrink-0"
            />
            <div>
              <div className="text-xs uppercase tracking-widest text-[#DFC794] font-semibold">
                Countryside Hotel & Lounge · Ogun State
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                {confirmedReservation ? 'Reservation Request Received' : 'Reserve Your Accommodation'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {confirmedReservation ? (
            /* Confirmation Screen */
            <div className="space-y-6">
              <div className="text-center py-4 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/30 p-6">
                <CheckCircle2 className="w-12 h-12 text-[#143621] mx-auto mb-3" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#A4813D]">
                  Booking Reference
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#143621] my-1 tracking-wider">
                  {confirmedReservation.bookingRef}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-100 text-amber-900 text-xs font-semibold mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: PENDING MANAGEMENT APPROVAL</span>
                </div>
              </div>

              {/* Crucial Hotel Policy Notice */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong>Important Reservation Notice:</strong>
                  <p>
                    Countryside Hotel prioritizes guest satisfaction and personal service. To prevent double-booking, our management team will review room availability and call or message you at <strong>{confirmedReservation.phone}</strong> to confirm your reservation before any payment is made.
                  </p>
                </div>
              </div>

              {/* Summary Receipt Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-neutral-50 px-4 py-2.5 font-semibold text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
                  Stay Details
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Guest Name:</span>
                    <span className="font-semibold text-neutral-900">{confirmedReservation.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Accommodation:</span>
                    <span className="font-semibold text-neutral-900">{confirmedReservation.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Check-In Date:</span>
                    <span className="font-semibold text-neutral-900">{confirmedReservation.checkInDate} (2:00 PM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Check-Out Date:</span>
                    <span className="font-semibold text-neutral-900">{confirmedReservation.checkOutDate} (12:00 PM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Duration:</span>
                    <span className="font-semibold text-neutral-900">{nights} Night{nights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Number of Guests:</span>
                    <span className="font-semibold text-neutral-900">{confirmedReservation.numberOfGuests}</span>
                  </div>
                  {confirmedReservation.specialRequests && (
                    <div className="flex justify-between pt-2 border-t border-neutral-100">
                      <span className="text-neutral-500">Special Request:</span>
                      <span className="text-neutral-800 italic max-w-xs text-right">
                        {confirmedReservation.specialRequests}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${whatsappBookingMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm rounded flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Hotel via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs sm:text-sm rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 bg-[#143621] hover:bg-[#1E4D30] text-[#DFC794] font-semibold text-xs sm:text-sm rounded transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Note on approval policy */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#C5A059]/30 rounded-lg text-xs text-neutral-700">
                <strong>Booking Assurance:</strong> No payment is required right now. Submit your reservation details and our hotel management will contact you to confirm room availability and finalize check-in.
              </div>

              {/* Guest Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Babatunde Adeleke"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Phone Number (WhatsApp Preferred) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. guest@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                />
              </div>

              {/* Preferred Room Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Preferred Room or Apartment *
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                  required
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.type === 'apartment' ? 'Apartment' : 'Guest Room'}) — {room.pricePerNight}
                    </option>
                  ))}
                </select>

                {currentRoom && (
                  <div className="mt-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{currentRoom.bedType}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Max {currentRoom.maxGuests} Guests</span>
                    </span>
                    <span className="font-semibold text-[#143621]">
                      {currentRoom.totalUnits} Units in Property
                    </span>
                  </div>
                )}
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Check-In *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Check-Out *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Guests *
                  </label>
                  <select
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Special Requests / Arrival Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Estimated arrival time, ground floor preference, quiet room, baby cot..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50 resize-y"
                />
              </div>

              {/* Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#143621] hover:bg-[#1E4D30] text-[#DFC794] font-semibold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Submitting Reservation...' : 'Submit Reservation Request'}</span>
                </button>
                <p className="text-[11px] text-center text-neutral-500 mt-2">
                  By clicking Submit, your booking reference will be generated and routed directly to Countryside Hotel management.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

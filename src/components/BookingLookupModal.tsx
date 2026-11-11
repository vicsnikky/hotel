import React, { useState } from 'react';
import { X, Search, Calendar, Bed, User, Phone, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { Reservation, HotelInfo } from '../types/hotel';
import { storage } from '../services/storage';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelInfo: HotelInfo;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  onClose,
  hotelInfo,
}) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Reservation | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanQuery = query.trim().toLowerCase();

    const reservations = storage.getReservations();
    const found = reservations.find(
      (r) =>
        r.bookingRef.toLowerCase() === cleanQuery ||
        r.phone.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, '')) ||
        r.email.toLowerCase() === cleanQuery
    );

    setResult(found || null);
  };

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CONFIRMED BY MANAGEMENT</span>
          </span>
        );
      case 'Checked In':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <Bed className="w-3.5 h-3.5" />
            <span>CHECKED IN</span>
          </span>
        );
      case 'Checked Out':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200 text-neutral-800 text-xs font-semibold">
            <span>CHECKED OUT</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>CANCELLED</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>PENDING REVIEW</span>
          </span>
        );
    }
  };

  const cleanWhatsapp = hotelInfo.whatsappPlaceholder.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-lg w-full my-8 shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#143621] text-white p-6 flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Countryside Hotel Logo"
              className="w-10 h-10 object-cover rounded-full border border-[#C5A059]/50 bg-black shadow-md shrink-0"
            />
            <div>
              <div className="text-xs uppercase tracking-widest text-[#DFC794] font-semibold">
                Countryside Hotel & Lounge
              </div>
              <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                Track Your Reservation
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Enter Booking Reference or Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. CSH-2024-8492 or phone number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#143621] hover:bg-[#1E4D30] text-[#DFC794] font-semibold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              Demo sample references: <strong>CSH-2024-8492</strong> (Confirmed) or <strong>CSH-2024-3019</strong> (Pending)
            </p>
          </form>

          {searched && (
            <div>
              {result ? (
                <div className="p-5 bg-[#FAF8F5] border border-[#C5A059]/40 rounded-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <div>
                      <div className="text-[11px] uppercase text-neutral-500">Reference Number</div>
                      <div className="font-mono text-lg font-bold text-[#143621]">{result.bookingRef}</div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Guest:</span>
                      <span className="font-semibold text-neutral-800">{result.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Accommodation:</span>
                      <span className="font-semibold text-neutral-800">{result.roomName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Check-In:</span>
                      <span className="font-semibold text-neutral-800">{result.checkInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Check-Out:</span>
                      <span className="font-semibold text-neutral-800">{result.checkOutDate}</span>
                    </div>
                    {result.adminNotes && (
                      <div className="pt-2 border-t border-neutral-200">
                        <span className="text-neutral-500 block mb-0.5 font-medium">Management Note:</span>
                        <p className="text-neutral-700 italic bg-white p-2 rounded border border-neutral-200">
                          {result.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                        `Hello Countryside Hotel, I am checking the status of my reservation ${result.bookingRef} for ${result.guestName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact Front Desk for this Booking</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500 space-y-2">
                  <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p>No reservation found for "{query}". Please check the reference code or phone number.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

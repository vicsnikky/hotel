import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  ExternalLink,
  Clock,
  Compass,
} from 'lucide-react';
import { HotelInfo } from '../types/hotel';
import { storage } from '../services/storage';

interface ContactSectionProps {
  hotelInfo: HotelInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ hotelInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      storage.createEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Countryside Hotel, I would like to inquire about room availability and reservations at your hotel in Ijoko Road, Ogun State.`
  );

  const cleanWhatsappNumber = hotelInfo.whatsappPlaceholder.replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="py-24 bg-[#FAF8F5] text-[#1F2421] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#A4813D] mb-3">
            <span>Location & Hospitality Contact</span>
            <span aria-hidden="true">·</span>
            <span>Ijoko Road, Ogun State</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#143621] tracking-tight mb-4">
            Connect With Countryside Hotel
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            We are readily available to assist you with room reservations, event bookings, group rates, or driving directions.
          </p>
        </div>

        {/* Contact Info + Form 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Official Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3.5">
                <img
                  src="/logo.jpg"
                  alt="Countryside Hotel Logo"
                  className="w-12 h-12 object-cover rounded-full border border-[#C5A059]/50 bg-black shadow-md shrink-0"
                />
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#143621] mb-0.5">
                    {hotelInfo.name} & Lounge
                  </h3>
                  <p className="text-xs text-[#A4813D] font-medium uppercase tracking-wider">
                    {hotelInfo.slogan}
                  </p>
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-neutral-100">
                <div className="w-9 h-9 rounded-lg bg-[#143621]/5 text-[#143621] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Hotel Address
                  </div>
                  <p className="text-sm font-medium text-neutral-800 leading-snug">
                    {hotelInfo.address}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Landmark: Delman Bustop, along Ijoko Road, Ogun State.
                  </p>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-neutral-100">
                <div className="w-9 h-9 rounded-lg bg-[#143621]/5 text-[#143621] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Phone Inquiries
                  </div>
                  <p className="text-sm font-medium text-neutral-800">
                    {hotelInfo.phonePlaceholder}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    (Contact management for immediate front desk coordination)
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-neutral-100">
                <div className="w-9 h-9 rounded-lg bg-[#143621]/5 text-[#143621] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Email Correspondence
                  </div>
                  <p className="text-sm font-medium text-neutral-800">
                    {hotelInfo.emailPlaceholder}
                  </p>
                </div>
              </div>

              {/* Front Desk Hours */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-neutral-100">
                <div className="w-9 h-9 rounded-lg bg-[#143621]/5 text-[#143621] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Operating Schedule
                  </div>
                  <p className="text-sm font-medium text-neutral-800">
                    24/7 Front Desk, Security & Restaurant
                  </p>
                  <p className="text-xs text-neutral-500">
                    Check-in: {hotelInfo.checkInTime} · Check-out: {hotelInfo.checkOutTime}
                  </p>
                </div>
              </div>

              {/* Direct Buttons: WhatsApp & TikTok */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm rounded flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>

                <a
                  href={hotelInfo.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-black hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm rounded flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.65a8.28 8.28 0 0 0 4.9 1.58V6.78c-.33 0-.67-.03-1-.09z"/>
                  </svg>
                  <span>TikTok {hotelInfo.tiktokHandle}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-7 sm:p-9 rounded-2xl border border-neutral-200/80 shadow-xs">
              <h3 className="font-serif text-2xl font-bold text-[#143621] mb-2">
                Send Us a Message
              </h3>
              <p className="text-sm text-neutral-600 mb-6">
                Have a question regarding rooms, rates, dining, or events? Fill out the form below and our hotel team will respond promptly.
              </p>

              {submitted ? (
                <div className="p-6 bg-[#FAF8F5] border border-[#C5A059]/40 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#143621] mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-[#143621]">
                    Message Sent Successfully
                  </h4>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto">
                    Thank you for reaching out to Countryside Hotel! Your enquiry has been received and our management team will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#143621] bg-[#C5A059] rounded hover:bg-[#DFC794] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samuel Adebayo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +234 803 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Room Inquiry / Extended Stay"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Message / Inquiry Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please let us know your requirements, dates, or specific questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] bg-neutral-50 resize-y"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3 bg-[#143621] hover:bg-[#1E4D30] text-[#DFC794] font-semibold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Submitting...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Embed & Location Landmark Info */}
        <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs">
          <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#A4813D] mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Interactive Location Map</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#143621]">
                Finding Countryside Hotel in Ogun State
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Located at 5, Ilesanmi Close, Delman Bustop, along Ijoko Road, Ogun State. Conveniently accessible from Sango Ota, Abeokuta expressway, and Lagos border.
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Ijoko+Road+Ogun+State+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#143621] bg-[#FAF8F5] border border-neutral-300 hover:border-[#C5A059] rounded transition-colors shrink-0"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Responsive Map Frame */}
          <div className="relative w-full h-80 sm:h-96 bg-neutral-100">
            <iframe
              title="Countryside Hotel Location Map - Ijoko Road, Ogun State"
              src="https://maps.google.com/maps?q=Ijoko%20Road,%20Ogun%20State,%20Nigeria&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

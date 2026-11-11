import React from 'react';
import { MessageSquare } from 'lucide-react';
import { HotelInfo } from '../types/hotel';

interface FloatingWhatsAppProps {
  hotelInfo: HotelInfo;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ hotelInfo }) => {
  const cleanNumber = hotelInfo.whatsappPlaceholder.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    `Hello Countryside Hotel, I would like to inquire about room reservations at your hotel in Ijoko Road, Ogun State.`
  );

  return (
    <aside
      aria-label="Direct WhatsApp Hospitality Contact"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      <a
        href={`https://wa.me/${cleanNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform group-hover:scale-105"
        title="Chat with Countryside Hotel Front Desk on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide">
          WhatsApp Front Desk
        </span>
      </a>
    </aside>
  );
};

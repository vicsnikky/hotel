import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, MessageSquare, ArrowRight } from 'lucide-react';
import { HotelInfo } from '../types/hotel';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface VideoTourSectionProps {
  hotelInfo: HotelInfo;
  onBookClick: () => void;
}

export const VideoTourSection: React.FC<VideoTourSectionProps> = ({
  hotelInfo,
  onBookClick,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const whatsappUrl = buildWhatsAppUrl(
    hotelInfo.whatsappPlaceholder,
    'Hello Countryside Hotel & Lounge, I just watched your property video tour and would like to inquire about room availability.'
  );

  return (
    <section id="video-tour" className="py-20 bg-[#143621] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Introduction */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#DFC794]">
              <span>Virtual Walkthrough</span>
              <span aria-hidden="true">·</span>
              <span>Ijoko Road, Ogun State</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight text-balance">
              Tour Countryside Hotel &amp; Noir City Club
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Step inside our property at 5, Ilesanmi Close, Delman Bustop. Explore our signature guest suites (Gold, Diamond, and Platinum rooms), tranquil green walkway, 24-hour power &amp; security systems, and the vibrant Noir City Club &amp; Lounge.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-white/15 text-xs sm:text-sm text-white/85">
              <div className="flex items-center justify-between py-1">
                <span className="text-white/65">Guest Accommodation</span>
                <span className="font-medium text-[#DFC794]">20 Rooms &amp; 3 Apartments</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-white/10">
                <span className="text-white/65">Entertainment &amp; Nightlife</span>
                <span className="font-medium text-[#DFC794]">Noir City Club &amp; Snooker</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-white/10">
                <span className="text-white/65">WhatsApp Direct Desk</span>
                <span className="font-mono font-medium text-[#DFC794]">{hotelInfo.whatsappPlaceholder}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onBookClick}
                className="px-6 py-3 bg-[#C5A059] hover:bg-[#DFC794] text-[#143621] font-semibold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
              >
                <span>Book a Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm rounded transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp ({hotelInfo.whatsappPlaceholder})</span>
              </a>
            </div>
          </div>

          {/* Right Column: Featured Video Player */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden bg-black border border-[#C5A059]/35 shadow-2xl">
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  src="/assets/aistudio/WhatsApp_Video_2026-11-12_at_1.16.13_PM_ea405cc6.mp4"
                  poster="/src/assets/images/exterior_countryside_signage_1794425260949.jpg"
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                >
                  Your browser does not support embedded video playback.
                </video>
              </div>

              {/* Clean Video Control Bar */}
              <div className="px-4 py-3 bg-[#0B2214] border-t border-white/10 flex items-center justify-between gap-4 text-xs">
                <div className="text-white/80 truncate">
                  <span className="font-semibold text-[#DFC794]">Countryside Hotel &amp; Lounge</span>
                  <span aria-hidden="true" className="mx-2 text-white/30">·</span>
                  <span>Official Property Tour</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play Tour'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    title={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

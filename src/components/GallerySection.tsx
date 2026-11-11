import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types/hotel';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Exterior',
    'Rooms',
    'Apartments',
    'Club Room & Snooker',
    'Restaurant',
    'Surroundings',
  ];

  const filteredItems = gallery.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const showNext = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
  }, [activeLightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex(
      (activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length
    );
  }, [activeLightboxIndex, filteredItems.length]);

  // Handle ESC and Arrow keys in Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, showNext, showPrev]);

  return (
    <section id="gallery" className="py-24 bg-white text-[#1F2421] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#A4813D] mb-3">
              <span>Visual Showcase</span>
              <span aria-hidden="true">·</span>
              <span>Photo Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#143621] tracking-tight">
              Glimpse Into Countryside Hotel
            </h2>
            <p className="text-neutral-600 mt-3 text-base">
              Explore our guest rooms, apartments, snooker entertainment lounge, dining areas, and peaceful surroundings.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#143621] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 bg-neutral-100"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Hover Zoom Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-[#DFC794]" />
              </div>

              {/* Caption Text */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-[#DFC794] mb-1">
                  {item.category}
                </div>
                <h3 className="text-base font-serif font-bold text-white line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-sm">
            No photographs available under this category.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white pb-4 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-xs font-mono text-[#DFC794]">
                {activeLightboxIndex + 1} / {filteredItems.length}
              </span>
              <h4 className="text-sm sm:text-base font-serif font-bold">
                {filteredItems[activeLightboxIndex].title}
              </h4>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image Frame */}
          <div
            className="relative w-full max-w-5xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[activeLightboxIndex].image}
              alt={filteredItems[activeLightboxIndex].title}
              className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />

            {/* Prev Button */}
            {filteredItems.length > 1 && (
              <button
                type="button"
                onClick={showPrev}
                className="absolute left-2 sm:-left-12 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Button */}
            {filteredItems.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                className="absolute right-2 sm:-right-12 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Caption underneath */}
          <div
            className="max-w-2xl text-center text-xs sm:text-sm text-neutral-300 pt-4 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredItems[activeLightboxIndex].caption}
          </div>
        </div>
      )}
    </section>
  );
};

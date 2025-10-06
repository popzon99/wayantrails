'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface HeroGalleryProps {
  images: string[];
  resortName: string;
}

export default function HeroGallery({ images, resortName }: HeroGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Desktop Gallery - Hidden on mobile */}
      <section className="hidden lg:grid grid-cols-2 gap-2 h-[500px] rounded-lg overflow-hidden">
        {/* Main large image */}
        <div
          className="relative cursor-pointer group overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            alt={`${resortName} - Main view`}
            priority
          />
        </div>

        {/* Grid of 4 smaller images */}
        <div className="grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => openLightbox(idx + 1)}
            >
              <Image
                src={img}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                alt={`${resortName} - View ${idx + 2}`}
              />
              {/* Overlay on last thumbnail */}
              {idx === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/70 transition-colors">
                  <button className="text-white font-semibold text-sm px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-colors">
                    View all {images.length} photos
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Gallery - Visible only on mobile */}
      <section className="lg:hidden relative h-[300px]">
        <Swiper
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          modules={[Pagination]}
          className="h-full rounded-lg"
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} onClick={() => openLightbox(idx)}>
              <div className="relative w-full h-full cursor-pointer">
                <Image
                  src={img}
                  fill
                  className="object-cover"
                  alt={`${resortName} - View ${idx + 1}`}
                  priority={idx === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Photo count badge */}
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
          {currentImageIndex + 1} / {images.length}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-20 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentImageIndex]}
                fill
                className="object-contain"
                alt={`${resortName} - View ${currentImageIndex + 1}`}
                priority
              />
            </motion.div>

            {/* Thumbnail strip - Desktop only */}
            <div className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20 gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg max-w-4xl overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`relative w-20 h-16 flex-shrink-0 rounded overflow-hidden transition-all ${
                    idx === currentImageIndex
                      ? 'ring-2 ring-white scale-105'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    fill
                    className="object-cover"
                    alt={`Thumbnail ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

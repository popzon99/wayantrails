'use client';

import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import StickyBookingCard from './StickyBookingCard';

interface RoomType {
  name: string;
  price: number;
  capacity: number;
  features: string[];
  availability: string;
  roomsLeft: number;
}

interface StickyBottomBarProps {
  minPrice: number;
  resortName: string;
  roomTypes: RoomType[];
  onReserve?: () => void;
}

export default function StickyBottomBar({
  minPrice,
  resortName,
  roomTypes,
  onReserve
}: StickyBottomBarProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleReserveClick = () => {
    if (onReserve) {
      onReserve();
    } else {
      setShowBookingModal(true);
    }
  };

  return (
    <>
      {/* Sticky Bottom Bar - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-xs text-gray-600">From</div>
            <div className="text-xl font-bold text-gray-900">
              ₹{minPrice.toLocaleString()}
              <span className="text-sm font-normal text-gray-600">/night</span>
            </div>
          </div>
          <button
            onClick={handleReserveClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Reserve
          </button>
        </div>
      </div>

      {/* Booking Modal - Mobile Only */}
      <AnimatePresence>
        {showBookingModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[70] max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Book Your Stay</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Booking Card Content */}
              <div className="p-4">
                <StickyBookingCard
                  resortName={resortName}
                  roomTypes={roomTypes}
                  isModal={true}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

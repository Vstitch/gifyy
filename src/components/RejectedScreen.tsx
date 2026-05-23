import { useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { GiftSettings } from '../types';
import { IMAGES } from '../utils/assets';
import { playBoop, playRejectSigh } from '../utils/audio';

interface RejectedScreenProps {
  settings: GiftSettings;
  onTryAgain: () => void;
  isSoundMuted: boolean;
}

export default function RejectedScreen({ settings, onTryAgain, isSoundMuted }: RejectedScreenProps) {
  useEffect(() => {
    if (!isSoundMuted) {
      playRejectSigh();
    }
  }, [isSoundMuted]);

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto z-10 w-full">
      {/* Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', damping: 12 }}
        className="space-y-1"
      >
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter font-rounded uppercase select-none leading-none py-4">
          HOW DARE YOU!
        </h1>
      </motion.div>

      {/* Sad Puppy Frame */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
        className="relative my-6 flex items-center justify-center"
      >
        <div className="absolute -inset-4 bg-red-100 rounded-full blur-2xl opacity-40 animate-pulse" />
        
        <div className="relative w-64 h-64 bg-red-50/50 rounded-[48px] border-[8px] border-white shadow-2xl flex flex-col items-center justify-center overflow-hidden">
          <img
            src={IMAGES.puppySad}
            alt="Meme sad puppy eyes golden retriever"
            referrerPolicy="no-referrer"
            className="w-56 h-56 object-cover relative select-none pointer-events-none filter drop-shadow-md rounded-[32px]"
          />
        </div>
      </motion.div>

      {/* Try Again CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full mt-4"
      >
        <motion.button
          onClick={() => {
            if (!isSoundMuted) playBoop();
            onTryAgain();
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto px-12 py-5 bg-[#0052CC] hover:bg-[#0043a4] text-white rounded-[24px] text-lg font-black font-rounded tracking-widest border-b-4 border-blue-900 shadow-xl transition-all cursor-pointer mx-auto"
          id="rejection-try-again-btn"
        >
          TRY AGAIN
        </motion.button>
      </motion.div>
    </div>
  );
}

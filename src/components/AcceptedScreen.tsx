import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Gift, Heart } from 'lucide-react';
import { GiftSettings } from '../types';
import { IMAGES } from '../utils/assets';
import { playYay } from '../utils/audio';
import { getColorTheme } from '../utils/theme';

interface AcceptedScreenProps {
  settings: GiftSettings;
  onOpenGift: () => void;
  isSoundMuted: boolean;
}

export default function AcceptedScreen({ settings, onOpenGift, isSoundMuted }: AcceptedScreenProps) {
  const themeStyles = getColorTheme(settings.colorTheme);

  useEffect(() => {
    if (!isSoundMuted) {
      playYay();
    }
  }, [isSoundMuted]);

  // Determine appropriate title (Reel has "THATS A GOODGIRL", but let's make it customizable or adaptive)
  const successHeading = settings.receiverName.toLowerCase() === 'vinitha' 
    ? "THAT'S A GOODGIRL!" 
    : `THAT'S A GOOD GIRL!`;

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto z-10 w-full animate-fade-in">
      {/* Title block */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className="space-y-1"
      >
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter font-rounded uppercase select-none leading-none py-4">
          {successHeading}
        </h1>
      </motion.div>

      {/* Sweet Golden Retriever with beret & wildflower bouquet in mouth */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
        className="relative my-6 flex items-center justify-center"
      >
        <div className="absolute -inset-4 bg-rose-100 rounded-full blur-2xl opacity-40 animate-pulse" />
        
        <div className="relative w-64 h-64 bg-[#FCD34D]/30 rounded-[48px] border-[8px] border-white shadow-2xl flex flex-col items-center justify-center overflow-hidden">
          <img
            src={IMAGES.puppyFlowerBouquet}
            alt="Golden retriever holding a beautiful colorful bouquet of wildflowers in its mouth"
            referrerPolicy="no-referrer"
            className="w-56 h-56 object-cover relative select-none pointer-events-none filter drop-shadow-md rounded-[32px]"
          />
        </div>
      </motion.div>

      {/* NEXT Step CTA button matching reel exactly */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full mt-4"
      >
        <motion.button
          onClick={onOpenGift}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto px-16 py-5 bg-[#0052CC] hover:bg-[#0043a4] text-white rounded-[24px] text-lg font-black font-rounded tracking-widest border-b-4 border-blue-900 shadow-xl transition-all cursor-pointer mx-auto"
          id="accepted-next-btn"
        >
          NEXT
        </motion.button>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { GiftSettings } from '../types';
import { IMAGES } from '../utils/assets';
import { playBoop, playNoShake, playYay } from '../utils/audio';
import { getColorTheme } from '../utils/theme';

interface RequestScreenProps {
  settings: GiftSettings;
  onYes: () => void;
  onNo: () => void;
  isSoundMuted: boolean;
}

const NO_LABELS = [
  'NO 😢',
  'Wait, why? 💔',
  'Are you sure? 🥺',
  'Think of the puppy! 🐶',
  'But it is for you! 👉👈',
  'Really? 😔',
  'Click YES instead! 💕',
  'Stop running! 😂',
  'Choice blocked! 🚫',
  'Click yes please ✨',
  'Give up! 😜',
  'Never! 😠',
];

export default function RequestScreen({ settings, onYes, onNo, isSoundMuted }: RequestScreenProps) {
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const themeStyles = getColorTheme(settings.colorTheme);

  const handleNoHoverOrTap = () => {
    if (noCount >= 5) {
      // Allow them to easily click it now to see the Chihuahua screen!
      return;
    }
    if (!isSoundMuted) {
      playNoShake();
    }
    
    // Teleport with random translation offsets in bounding box
    // Keep offsets within standard limits so it stays visible but is hard to catch
    const randomX = (Math.random() * 300 - 150) + (Math.random() > 0.5 ? 40 : -40);
    const randomY = (Math.random() * 200 - 100) + (Math.random() > 0.5 ? 30 : -30);
    
    setNoOffset({ x: randomX, y: randomY });
    setNoCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    if (!isSoundMuted) {
      playYay();
    }
    onYes();
  };

  const handleActualNoClick = () => {
    if (!isSoundMuted) {
      playBoop();
    }
    onNo();
  };

  const currentNoLabel = NO_LABELS[noCount % NO_LABELS.length];

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto z-10 w-full relative">
      {/* Header Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}
        className="space-y-2"
      >
        {/* Recipient Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${themeStyles.accentBadge} shadow-xs`}>
          <span>For: {settings.receiverName}</span>
          <Heart className="w-3 h-3 fill-current animate-pulse" />
        </div>

        {/* Big Bold Playful Title */}
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter font-rounded select-none leading-none py-2 drop-shadow-xs">
          {settings.giftTitle}
        </h1>
      </motion.div>

      {/* Hero Character Frame */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 120, 
          damping: 12,
          delay: 0.3 
        }}
        className="relative my-6 flex items-center justify-center"
      >
        {/* High energy back glow overlay from design HTML */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-pink-200 to-yellow-100 rounded-full blur-2xl opacity-40 animate-pulse" />
        
        {/* Character Frame with solid premium white borders & cute card shape */}
        <div className="relative w-64 h-64 bg-[#FAD9C1]/50 rounded-[48px] border-[8px] border-white shadow-2xl flex flex-col items-center justify-center overflow-hidden">
          {/* Character Image */}
          <img
            src={IMAGES.puppyHatBouquet}
            alt="Adorably cute golden retriever puppy wearing a cap with a flower bouquet"
            referrerPolicy="no-referrer"
            className="w-56 h-56 object-cover relative select-none pointer-events-none filter drop-shadow-md rounded-[32px]"
          />
        </div>

        {/* Special delivery rotating badge from design HTML */}
        <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-pink-100 transform rotate-12 z-10">
          <p className="text-xs font-black text-pink-500 uppercase tracking-wider font-rounded">Special Delivery! 💐</p>
        </div>
      </motion.div>

      {/* Subheading & Subtext */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="space-y-1 mb-8"
      >
        <p className="text-2xl font-bold text-slate-600 italic font-rounded leading-snug">
          "I got something for you 👉👈"
        </p>
        <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
          From: {settings.senderName}
        </span>
      </motion.div>

      {/* Primary Rounded Buttons Area */}
      <div 
        className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full px-4 relative min-h-[100px]"
        id="buttons-container"
      >
        {/* YES button */}
        <motion.button
          onClick={handleYesClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full sm:w-auto px-12 py-5 rounded-[28px] text-xl font-black font-rounded tracking-wide transition-all shadow-xl active:translate-y-1 active:border-b-0 cursor-pointer z-10 border-b-4 border-indigo-800 ${themeStyles.btnPrimary} ${themeStyles.btnPrimaryGlow}`}
          id="accept-gift-yes-btn"
        >
          YES PLS! 💖
        </motion.button>

        {/* Dynamic Dodgers NO button */}
        <motion.button
          onMouseEnter={handleNoHoverOrTap}
          onTouchStart={handleNoHoverOrTap} // Instant teleport on mobile touch!
          onClick={handleActualNoClick} // Back up for manual click
          animate={{ x: noOffset.x, y: noOffset.y }}
          transition={{ type: 'spring', stiffness: 220, damping: 15 }}
          className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-slate-400 font-bold font-rounded text-lg rounded-[24px] shadow-md hover:translate-x-12 hover:-translate-y-12 transition-all duration-300 cursor-pointer z-20 min-w-[130px]"
          id="accept-gift-no-btn"
        >
          {currentNoLabel}
        </motion.button>
      </div>

      {/* Tiny helper for dodge fun */}
      {noCount > 0 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          className="text-[10px] text-gray-400 font-mono mt-4 font-bold"
        >
          Dodged attempts: {noCount} / 8 before complete block 😂
        </motion.p>
      )}
    </div>
  );
}

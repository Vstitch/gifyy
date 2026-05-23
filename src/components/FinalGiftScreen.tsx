import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, 
  Heart, 
  RotateCcw, 
  Sparkles, 
  Ticket, 
  Check, 
  Share2,
  Copy,
  Plus
} from 'lucide-react';
import { GiftSettings, Coupon } from '../types';
import { playBellChime, playYay, playBoop } from '../utils/audio';
import { getColorTheme } from '../utils/theme';

interface FinalGiftScreenProps {
  settings: GiftSettings;
  onReplay: () => void;
  isSoundMuted: boolean;
  onOpenCustomizer: () => void;
}

interface HeartShowerItem {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

export default function FinalGiftScreen({ settings, onReplay, isSoundMuted, onOpenCustomizer }: FinalGiftScreenProps) {
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [redeemedCoupons, setRedeemedCoupons] = useState<Record<string, boolean>>({});
  const [heartShower, setHeartShower] = useState<HeartShowerItem[]>([]);
  const [activeTab, setActiveTab] = useState<'letter' | 'coupons'>('letter');

  const themeStyles = getColorTheme(settings.colorTheme);

  // Custom typing effect for the message
  useEffect(() => {
    let index = 0;
    const fullText = settings.giftText;
    setTypedText('');
    setIsTypingDone(false);

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsTypingDone(true);
      }
    }, 25); // Speedy enough for excellent user experience

    return () => clearInterval(timer);
  }, [settings.giftText]);

  // Magical chime sound on mount
  useEffect(() => {
    if (!isSoundMuted) {
      setTimeout(() => {
        playBellChime();
      }, 200);
    }
  }, [isSoundMuted]);

  // Heart shower burst effect on "HUG?" click
  const triggerHeartShower = (e: MouseEvent<HTMLButtonElement>) => {
    if (!isSoundMuted) {
      playYay();
    }
    
    // Generate 15-20 flying hearts from button location
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top;

    const newHearts: HeartShowerItem[] = Array.from({ length: 18 }).map((_, i) => ({
      id: Math.random() + i,
      x: startX + (Math.random() * 60 - 30),
      y: startY - (Math.random() * 20),
      scale: Math.random() * 0.8 + 0.6,
      rotate: Math.random() * 120 - 60,
    }));

    setHeartShower((prev) => [...prev, ...newHearts]);

    // Keep array clean by timing out hearts
    setTimeout(() => {
      setHeartShower((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 2000);
  };

  const handleRedeem = (couponId: string) => {
    if (redeemedCoupons[couponId]) return;
    if (!isSoundMuted) {
      playBellChime();
    }
    
    setRedeemedCoupons((prev) => ({
      ...prev,
      [couponId]: true,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 max-w-xl mx-auto z-10 w-full relative">
      {/* Absolute Interactive Flying Heart Particles */}
      <AnimatePresence>
        {heartShower.map((h) => (
          <motion.div
            key={h.id}
            initial={{ 
              opacity: 1, 
              x: h.x - window.innerWidth / 2, 
              y: h.y - window.innerHeight / 2, 
              scale: h.scale, 
              rotate: h.rotate 
            }}
            animate={{ 
              opacity: 0, 
              y: h.y - window.innerHeight / 2 - 250 - Math.random() * 100, 
              x: h.x - window.innerWidth / 2 + (Math.random() * 200 - 100),
              rotate: h.rotate + (Math.random() * 180 - 90)
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="fixed pointer-events-none text-red-500 text-3xl select-none z-50"
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Decorative Sparkle Icons */}
      <span className="absolute top-0 right-10 text-xl animate-[spin_5s_linear_infinite] opacity-40">✨</span>
      <span className="absolute bottom-16 left-6 text-xl animate-pulse opacity-40">⭐</span>

      {/* Card Header Title */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-1 mb-5"
      >
        <span className="text-xs font-bold text-gray-400 font-mono tracking-wider">REVEAL COMPLETED 🎁</span>
        <h2 className="text-3xl font-black text-gray-800 font-rounded leading-tight">
          A Gift For {settings.receiverName}!
        </h2>
      </motion.div>

      {/* Glassmorphism Gift Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.7 }}
        className={`w-full bg-white/75 backdrop-blur-md rounded-3xl border ${themeStyles.border} shadow-xl overflow-hidden flex flex-col relative`}
        id="final-gift-reveal-card"
      >
        {/* Ribbon accent line */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${settings.colorTheme === 'blue' ? 'from-blue-400 via-indigo-400 to-indigo-500' : 'from-pink-400 via-rose-400 to-purple-400'}`} />

        {/* Tab Selector Inside Card */}
        <div className="flex border-b border-gray-100/60 bg-gray-50/50">
          <button
            onClick={() => { playBoop(); setActiveTab('letter'); }}
            className={`flex-1 py-3 text-sm font-bold font-rounded flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none ${
              activeTab === 'letter' 
                ? 'text-gray-800 bg-white border-b-2 border-indigo-500' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/30'
            }`}
            id="tab-letter"
          >
            💌 The Letter
          </button>
          <button
            onClick={() => { playBoop(); setActiveTab('coupons'); }}
            className={`flex-1 py-3 text-sm font-bold font-rounded flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none ${
              activeTab === 'coupons' 
                ? 'text-gray-800 bg-white border-b-2 border-indigo-500' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/30'
            }`}
            id="tab-coupons"
          >
            🎟️ Coupon Book ({settings.coupons.length})
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8 min-h-[290px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeTab === 'letter' ? (
              <motion.div
                key="letter-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                {/* Letter Body with typing effect */}
                <div className="space-y-3.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-gray-400 font-mono">
                    <span>DATE CODE: {new Date().toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="uppercase text-indigo-500">Sender: {settings.senderName}</span>
                  </div>
                  
                  {/* Realtime cute paragraph */}
                  <p className="text-gray-700 font-medium text-[15px] sm:text-base leading-relaxed font-rounded min-h-[110px] break-words">
                    {typedText}
                    {!isTypingDone && (
                      <span className="inline-block w-2.5 h-4 bg-indigo-400 ml-1 animate-[pulse_0.6s_infinite]" />
                    )}
                  </p>
                </div>

                {/* Sender signature / heart badge */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100/80 pt-4 gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-500 shadow-xs">
                      <Heart className="w-4 h-4 fill-current animate-pulse" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] block font-bold text-gray-400 uppercase font-mono leading-none">Made with love</span>
                      <span className="text-xs font-bold text-gray-600 font-rounded">{settings.senderName}</span>
                    </div>
                  </div>
                  
                  {/* HUG? CTA */}
                  <motion.button
                    onClick={triggerHeartShower}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 bg-red-400 hover:bg-red-500 text-white rounded-2xl text-xs font-black font-rounded tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    id="hug-action-btn"
                  >
                    HUG? ❤️
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="coupons-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-1 max-h-[340px] overflow-y-auto pr-1"
              >
                {/* Coupons Book Module */}
                <div className="text-center sm:text-left py-1">
                  <h3 className="text-sm font-bold text-gray-400 font-mono tracking-wide uppercase">REDEEM YOUR TICKETS</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Click "REDEEM" to claim. Let {settings.senderName} know your code! 🎯</p>
                </div>

                {settings.coupons.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50/50 border border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-1.5">
                    <Ticket className="w-8 h-8 text-gray-300" />
                    <span className="text-xs text-gray-400">No coupons added to this gift! Customize to insert coupon codes.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {settings.coupons.map((c) => {
                      const isClaimed = !!redeemedCoupons[c.id];
                      return (
                        <div
                          key={c.id}
                          className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-300 overflow-hidden bg-white/55 flex flex-col md:flex-row items-center md:items-stretch gap-4 ${
                            isClaimed 
                              ? 'border-emerald-300 opacity-90 filter brightness-95' 
                              : 'border-indigo-100 hover:border-indigo-300'
                          }`}
                        >
                          {/* Left ticket segment */}
                          <div className="flex-1 space-y-1.5 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-1">
                              <Ticket className={`w-3.5 h-3.5 ${isClaimed ? 'text-emerald-500' : 'text-indigo-400'}`} />
                              <span className={`text-[10px] font-bold font-mono ${isClaimed ? 'text-emerald-500' : 'text-indigo-400'}`}>COUPON PASS</span>
                            </div>
                            
                            <h4 className="text-sm font-black text-gray-800 font-rounded leading-tight">
                              {c.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-sans font-medium">
                              {c.description}
                            </p>
                          </div>

                          {/* Ticket Divider for Ticket Design */}
                          <div className="hidden md:flex flex-col justify-between items-center py-1.5">
                            <div className="w-3 h-3 rounded-full border border-dashed border-indigo-100 -mt-5 bg-[#faf9f6]" />
                            <div className="w-0.5 h-full border-l border-dashed border-gray-200" />
                            <div className="w-3 h-3 rounded-full border border-dashed border-indigo-100 -mb-5 bg-[#faf9f6]" />
                          </div>

                          {/* Right coupon action code */}
                          <div className="flex flex-col justify-center items-center gap-2 min-w-[125px] w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                            {isClaimed ? (
                              <motion.div 
                                initial={{ scale: 0.5, rotate: -15 }}
                                animate={{ scale: 1, rotate: -6 }}
                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-black text-[10px] tracking-wide rounded-lg border-2 border-emerald-400 uppercase font-mono relative my-1"
                              >
                                CLAIMED ✓
                              </motion.div>
                            ) : (
                              <button
                                onClick={() => handleRedeem(c.id)}
                                className="w-full py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs rounded-xl border border-indigo-200 tracking-wide cursor-pointer transition-all active:scale-95 text-center"
                                id={`coupon-redeem-${c.id}`}
                              >
                                REDEEM
                              </button>
                            )}

                            <span className="text-[9px] font-mono font-bold text-gray-400">
                              CODE: {c.code}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Replay Button Below */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 flex justify-center w-full"
      >
        <button
          onClick={() => {
            playBoop();
            onReplay();
          }}
          className="px-8 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-2xl text-xs font-bold font-rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
          id="replay-reveal-btn"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Replay Gift Reveal
        </button>
      </motion.div>
    </div>
  );
}

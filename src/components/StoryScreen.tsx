import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, ArrowRight } from 'lucide-react';
import { GiftSettings } from '../types';
import { playLyricTick } from '../utils/audio';

interface StoryScreenProps {
  settings: GiftSettings;
  onStoryComplete: () => void;
  isSoundMuted: boolean;
}

interface LyricSlide {
  text: string;
  bgClass: string;
  textClass: string;
  isCustomLove?: boolean;
  isCustomTill?: boolean;
}

export default function StoryScreen({ settings, onStoryComplete, isSoundMuted }: StoryScreenProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const stateRef = useRef({ currentSlideIndex, hasStarted });
  
  // Sync state with ref to avoid stale closure in interval
  useEffect(() => {
    stateRef.current = { currentSlideIndex, hasStarted };
  }, [currentSlideIndex, hasStarted]);

  const slides: LyricSlide[] = [
    { text: "i", bgClass: "bg-[#FFF9F5]", textClass: "text-slate-800 font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "fell", bgClass: "bg-[#002D62]", textClass: "text-[#E0F2FE] font-rounded lowercase md:text-9xl text-7xl font-black" },
    { text: "in", bgClass: "bg-[#1E1B4B]", textClass: "text-[#EEF2F6] font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "love", bgClass: "bg-[#4C0519]", textClass: "text-[#FECDD3] font-serif lowercase md:text-9xl text-7xl font-black italic", isCustomLove: true },
    { text: "but", bgClass: "bg-[#FEF3C7]", textClass: "text-[#78350F] font-rounded lowercase md:text-8xl text-6xl font-bold" },
    { text: "she", bgClass: "bg-[#0F172A]", textClass: "text-pink-300 font-rounded lowercase md:text-9xl text-7xl font-black" },
    { text: "left", bgClass: "bg-[#FFF1F2]", textClass: "text-[#9F1239] font-serif lowercase md:text-9xl text-7xl font-black italic" },
    { text: "me", bgClass: "bg-[#172554]", textClass: "text-[#FEF08A] font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "lonely", bgClass: "bg-[#3B0764]", textClass: "text-[#E9D5FF] font-rounded lowercase md:text-9xl text-7xl font-black tracking-wide" },
    { text: "tried", bgClass: "bg-[#020617]", textClass: "text-slate-100 font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "to", bgClass: "bg-[#FFedd5]", textClass: "text-[#9A3412] font-rounded lowercase md:text-7xl text-5xl font-black" },
    { text: "trust", bgClass: "bg-[#1E293B]", textClass: "text-[#EDF2F7] font-rounded lowercase md:text-9xl text-7xl font-black tracking-wider" },
    { text: "but", bgClass: "bg-[#FEF08A]", textClass: "text-[#422006] font-rounded lowercase md:text-7xl text-5xl font-extrabold" },
    { text: "it", bgClass: "bg-[#FAFAF9]", textClass: "text-[#44403C] font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "burned", bgClass: "bg-[#450A0A]", textClass: "text-[#FECACA] font-serif lowercase md:text-9xl text-7xl font-black italic" },
    { text: "me", bgClass: "bg-[#1C1917]", textClass: "text-[#FDA4AF] font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "slowly", bgClass: "bg-[#0C4A6E]", textClass: "text-[#FFFbeb] font-serif lowercase md:text-9xl text-7xl font-black tracking-wide" },
    { text: "i", bgClass: "bg-[#FAFAF9]", textClass: "text-slate-700 font-rounded lowercase md:text-7xl text-5xl font-semibold" },
    { text: "didn't", bgClass: "bg-[#0F172A]", textClass: "text-slate-200 font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "know", bgClass: "bg-[#FAF5FF]", textClass: "text-[#581C87] font-rounded lowercase md:text-9xl text-7xl font-black italic" },
    { text: "what", bgClass: "bg-[#1E3A8A]", textClass: "text-[#BFDBFE] font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "i", bgClass: "bg-[#064E3B]", textClass: "text-[#D1FAE5] font-rounded lowercase md:text-7xl text-5xl font-bold" },
    { text: "was", bgClass: "bg-[#2D0F02]", textClass: "text-[#FFDDD2] font-serif lowercase md:text-8xl text-6xl font-black" },
    { text: "looking", bgClass: "bg-[#0F172A]", textClass: "text-[#99F6E4] font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "for", bgClass: "bg-[#FEF9C3]", textClass: "text-[#713F12] font-rounded lowercase md:text-7xl text-5xl font-black" },
    { text: "till", bgClass: "bg-[#4C0519]", textClass: "text-[#FCD34D] font-serif lowercase md:text-9xl text-7xl font-black", isCustomTill: true },
    { text: "i", bgClass: "bg-[#1E1B4B]", textClass: "text-white font-rounded lowercase md:text-8xl text-6xl font-black" },
    { text: "found", bgClass: "bg-[#064E3B]", textClass: "text-[#D1FAE5] font-serif lowercase md:text-9xl text-7xl font-black italic" },
    { 
      text: settings.receiverName.toUpperCase(), 
      bgClass: "bg-[#030712]", 
      textClass: "text-amber-200 font-rounded uppercase md:text-7xl text-4xl font-extrabold tracking-widest leading-none drop-shadow-[0_8px_24px_rgba(251,191,36,0.3)] px-4" 
    },
  ];

  // Auto progression mechanism when user clicks PLAY
  useEffect(() => {
    if (!hasStarted) return;

    const interval = setInterval(() => {
      const idx = stateRef.current.currentSlideIndex;
      if (idx < slides.length - 1) {
        const nextIdx = idx + 1;
        setCurrentSlideIndex(nextIdx);
        if (!isSoundMuted) {
          playLyricTick(nextIdx);
        }
      } else {
        clearInterval(interval);
        // Completed lyric show! Automatically transition to final gift screen
        setTimeout(() => {
          onStoryComplete();
        }, 1200);
      }
    }, 450); // Matches snappy energetic music clip pace!

    return () => clearInterval(interval);
  }, [hasStarted, isSoundMuted]);

  const startPlaying = () => {
    setHasStarted(true);
    if (!isSoundMuted) {
      playLyricTick(0);
    }
  };

  const handleNextManually = () => {
    if (!hasStarted) return;
    if (currentSlideIndex < slides.length - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      if (!isSoundMuted) {
        playLyricTick(nextIdx);
      }
    } else {
      onStoryComplete();
    }
  };

  const activeSlide = slides[currentSlideIndex];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="story-pre-start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-slate-100 shadow-2xl max-w-md w-full text-center relative overflow-hidden"
          >
            {/* Pulsing visual glow ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-100/60 rounded-full blur-2xl pointer-events-none -z-10" />

            <div className="w-16 h-16 bg-[#030712] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Volume2 className="w-7 h-7 text-amber-200 animate-[bounce_1.5s_infinite]" />
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-rounded mb-2">
              Ready for Your Story?
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-6 px-4">
              Turn up your sound or put on headphones! We've prepared a synced melody presentation for you.
            </p>

            <motion.button
              onClick={startPlaying}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 px-8 bg-slate-900 hover:bg-slate-800 text-amber-200 font-bold font-rounded rounded-2xl shadow-xl flex items-center justify-center gap-2 tracking-wide cursor-pointer transition-colors"
              id="start-story-play-btn"
            >
              <Play className="w-5 h-5 fill-current" /> PLAY SYNCED MELODY
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="story-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 ${activeSlide.bgClass} transition-colors duration-300 relative select-none`}
            onClick={handleNextManually} // Click anywhere to advance/skip words faster!
          >
            {/* Top Bar Indicators (Tape reel style) */}
            <div className="w-full max-w-xl flex items-center justify-between pt-4 opacity-75">
              <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-slate-400">
                Lyrical Memory • Track 01
              </span>
              <div className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-500">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                <span>SYNCING PLAYBACK</span>
              </div>
            </div>

            {/* Lyric Core Block */}
            <div className="flex-1 flex flex-col items-center justify-center text-center w-full px-4">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={currentSlideIndex}
                  initial={{ opacity: 0, scale: 0.82, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.15, rotate: 3 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 18, 
                    duration: 0.25 
                  }}
                  className={`${activeSlide.textClass} max-w-2xl leading-none tracking-tight select-none cursor-pointer filter drop-shadow-sm flex items-center justify-center gap-1`}
                >
                  {/* Custom render conditions for exact design from original Reel */}
                  {activeSlide.isCustomLove ? (
                    <span className="flex items-center gap-2">
                      l<span className="text-red-400 text-6xl md:text-9xl animate-pulse">♥</span>ve
                    </span>
                  ) : activeSlide.isCustomTill ? (
                    <span className="flex items-center">
                      t<span className="text-amber-200 relative inline-block">i<span className="absolute -top-1 md:-top-4 left-0 text-red-400 text-lg md:text-4xl">♥</span></span>ll
                    </span>
                  ) : currentSlideIndex === slides.length - 1 ? (
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-xs font-mono uppercase tracking-[0.2em] opacity-40 text-amber-200/60 mb-2">
                        Till I found...
                      </span>
                      <span className="block animate-[pulse_2s_infinite] break-all max-w-[90vw]">
                        {activeSlide.text} 💖
                      </span>
                    </div>
                  ) : (
                    <span>{activeSlide.text}</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Control Progress Timeline Overlay */}
            <div className="w-full max-w-xl pb-6 flex flex-col gap-3">
              {/* Progress Bar Timeline */}
              <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
                />
              </div>

              {/* Skip and Next helpful instruction */}
              <div className="flex justify-between items-center text-[10px] font-mono uppercase font-black text-slate-400/80">
                <span>{currentSlideIndex + 1} / {slides.length} words</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Stop parent click trigger
                    onStoryComplete();
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1 bg-black/5 px-3 py-1.5 rounded-xl cursor-copy active:scale-95"
                >
                  Skip <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

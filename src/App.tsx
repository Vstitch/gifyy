import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  Heart,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

import { ScreenState, GiftSettings } from './types';
import RequestScreen from './components/RequestScreen';
import RejectedScreen from './components/RejectedScreen';
import AcceptedScreen from './components/AcceptedScreen';
import VideoScreen from './components/VideoScreen';
import StoryScreen from './components/StoryScreen';
import FinalGiftScreen from './components/FinalGiftScreen';
import Customizer from './components/Customizer';

import { playBoop, playYay } from './utils/audio';
import { DEFAULT_SETTINGS, decodeSettings } from './utils/url';
import { getColorTheme } from './utils/theme';
import herVideo from './assets/hervideo.mp4';

export default function App() {
  const [screenState, setScreenState] = useState<ScreenState>(ScreenState.REQUEST);
  const [settings, setSettings] = useState<GiftSettings>(DEFAULT_SETTINGS);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Parse custom parameters from share link (base64 in url hash) on mount and route change
  useEffect(() => {
    const parseHashSettings = () => {
      const hash = window.location.hash;
      if (!hash) return;

      let base64Data = '';
      if (hash.startsWith('#g=')) {
        base64Data = hash.slice(3);
      } else if (hash.startsWith('#settings=')) {
        base64Data = hash.slice(10);
      }

      if (base64Data) {
        const decoded = decodeSettings(base64Data);
        if (decoded) {
          setSettings(decoded);
        }
      }
    };

    parseHashSettings();

    window.addEventListener('hashchange', parseHashSettings);
    return () => window.removeEventListener('hashchange', parseHashSettings);
  }, []);

  const handleApplyCustomSettings = (newSettings: GiftSettings) => {
    setSettings(newSettings);
    setScreenState(ScreenState.REQUEST); // Returns back to home to see the preview live!
  };

  const toggleSound = () => {
    setIsSoundMuted((prev) => {
      const next = !prev;
      if (!next) {
        playBoop();
      }
      return next;
    });
  };

  const handleOpenCustomizer = () => {
    if (!isSoundMuted) {
      playBoop();
    }
    setIsCustomizerOpen(true);
  };

  const themeStyles = getColorTheme(settings.colorTheme);

  return (
    <div
      className={`min-h-screen bg-[#FFF9F5]/70 bg-gradient-to-tr ${themeStyles.background} relative flex flex-col items-center justify-between p-3 sm:p-4 sm:px-6 overflow-x-hidden md:py-8 select-none transition-all duration-700 font-sans`}
      style={{ contentVisibility: 'auto' }}
    >
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-pink-100/40 rounded-full filter blur-[60px] sm:blur-[100px] animate-[pulse_10s_infinite]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-100/40 rounded-full filter blur-[60px] sm:blur-[100px] animate-[pulse_12s_infinite]" />
      </div>

      {/* Floating Control Headers (Top Bar) */}
      <div className="w-full max-w-5xl flex items-center justify-between z-30 sticky top-2 py-2 px-2 sm:px-0">
        {/* Logo / Link Brand */}
        <div
          onClick={() => { playBoop(); setScreenState(ScreenState.REQUEST); }}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-2xl bg-white/80 hover:bg-white/95 backdrop-blur-md border border-slate-100 cursor-pointer shadow-xs transition-all active:scale-95"
          id="brand-logo-badge"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-pink-400 rounded-full flex items-center justify-center shadow-xs">
            <span className="text-white font-black text-xs text-center leading-none">🐶</span>
          </div>
          <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-rounded">puppy.gift</span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-md border border-gray-100 text-gray-500 hover:text-gray-700 shadow-xs cursor-pointer active:scale-95 transition-all outline-none"
            title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
            id="sound-toggle-btn"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Transition Screen Stages Area */}
      <main className="flex-1 w-full flex items-center justify-center py-6 md:py-12 z-10">
        <AnimatePresence mode="wait">
          {screenState === ScreenState.REQUEST && (
            <motion.div
              key="request-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <RequestScreen
                settings={settings}
                onYes={() => setScreenState(ScreenState.ACCEPTED)}
                onNo={() => setScreenState(ScreenState.REJECTED)}
                isSoundMuted={isSoundMuted}
              />
            </motion.div>
          )}

          {screenState === ScreenState.REJECTED && (
            <motion.div
              key="rejected-screen"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, type: 'spring', damping: 10, stiffness: 100 }}
              className="w-full flex justify-center"
            >
              <RejectedScreen
                settings={settings}
                onTryAgain={() => setScreenState(ScreenState.REQUEST)}
                isSoundMuted={isSoundMuted}
              />
            </motion.div>
          )}

          {screenState === ScreenState.ACCEPTED && (
            <motion.div
              key="accepted-screen"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <AcceptedScreen
                settings={settings}
                onOpenGift={() => setScreenState(ScreenState.VIDEO)}
                isSoundMuted={isSoundMuted}
              />
            </motion.div>
          )}

          {screenState === ScreenState.VIDEO && (
            <motion.div
              key="video-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <VideoScreen
                settings={settings}
                onNext={() => setScreenState(ScreenState.HER_VIDEO)}
                isSoundMuted={isSoundMuted}
              />
            </motion.div>
          )}

          {screenState === ScreenState.HER_VIDEO && (
            <motion.div
              key="her-video-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black z-50"
            >
              <video
                autoPlay
                muted={isSoundMuted}
                playsInline
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain max-w-full max-h-full"
                src={herVideo}
                onEnded={() => {
                  if (!isSoundMuted) {
                    playYay();
                  }
                  setTimeout(() => {
                    setScreenState(ScreenState.REQUEST);
                  }, 1000);
                }}
              />
            </motion.div>
          )}

          {screenState === ScreenState.STORY && (
            <motion.div
              key="story-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <StoryScreen
                settings={settings}
                onStoryComplete={() => setScreenState(ScreenState.REVEALED)}
                isSoundMuted={isSoundMuted}
              />
            </motion.div>
          )}

          {screenState === ScreenState.REVEALED && (
            <motion.div
              key="revealed-screen"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <FinalGiftScreen
                settings={settings}
                onReplay={() => setScreenState(ScreenState.REQUEST)}
                isSoundMuted={isSoundMuted}
                onOpenCustomizer={handleOpenCustomizer}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding Credit (Unobtrusive & Clean) */}
      <footer className="w-full max-w-2xl text-center py-2 z-10 px-4">
        <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold text-gray-400 font-sans tracking-wide break-all">
          <span>{settings.senderName} ❤️ {settings.receiverName}</span>
        </div>
      </footer>

      {/* Wholesome customization drawer/overlay */}
      <Customizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentSettings={settings}
        onSave={handleApplyCustomSettings}
      />
    </div>
  );
}

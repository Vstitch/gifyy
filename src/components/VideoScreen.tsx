import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';
import { GiftSettings } from '../types';
import { playBoop, playYay } from '../utils/audio';

interface VideoScreenProps {
  settings: GiftSettings;
  onNext: () => void;
  isSoundMuted: boolean;
}

export default function VideoScreen({ settings, onNext, isSoundMuted }: VideoScreenProps) {
  // Default cute golden retriever running in meadow public direct MP4 video link
  const defaultVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-golden-retriever-running-on-meadow-41578-large.mp4";
  
  const [videoSrc] = useState<string>(() => {
    // Try to restore from local storage if previously selected, or fall back to default
    return localStorage.getItem('puppy_card_video_url') || defaultVideoUrl;
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Auto-play might be blocked by browser due to user gesture policies, which is fine!
          setIsPlaying(false);
        });
    }
  }, [videoSrc]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    playBoop();
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Audio/video play blocked:", err);
        });
    }
  };

  const handleReplayVideo = () => {
    if (!videoRef.current) return;
    playBoop();
    videoRef.current.currentTime = 0;
    videoRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.error(err));
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto z-10 w-full animate-fade-in gap-6">
      
      {/* Modern Cinematically Polished Video Player Container */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative w-full rounded-[40px] border-[12px] border-white shadow-2xl bg-black overflow-hidden aspect-video flex items-center justify-center group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        id="video-player-frame"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          playsInline
          muted={isSoundMuted}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handlePlayPause}
          id="main-applet-video"
        />

        {/* Dynamic Center Play Overlay when paused */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={handlePlayPause}
              className="absolute inset-0 bg-black/35 backdrop-blur-[2px] flex items-center justify-center cursor-pointer z-20"
            >
              <div className="w-20 h-20 rounded-full bg-white/95 text-[#0052CC] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform duration-200">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Controls bar overlay */}
        <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-5 flex items-center justify-between gap-4 transition-opacity duration-300 z-10 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors touch-manipulation cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4.5 h-4.5 fill-current" /> : <Play className="w-4.5 h-4.5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={handleReplayVideo}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors touch-manipulation cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] font-mono font-bold text-white/80 tracking-widest uppercase">
            {videoSrc === defaultVideoUrl ? "TAPE_01_PLAYING.MOV" : "CUSTOM_UPLOADED_TAPE.MP4"}
          </div>
        </div>
      </motion.div>

      {/* Navigation Continue button to go to the lyrical slide */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        <motion.button
          onClick={() => {
            playYay();
            onNext();
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto px-16 py-5 bg-[#0052CC] hover:bg-[#0043a4] text-white rounded-[24px] text-lg font-black font-rounded tracking-widest border-b-4 border-blue-900 shadow-xl transition-all cursor-pointer mx-auto flex items-center justify-center gap-2"
          id="video-screen-next-btn"
        >
          NEXT <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}

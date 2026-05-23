/**
 * Play cute sounds programmatically using Web Audio API.
 * This guarantees offline support and instant response without asset-loading latency.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Try to resume if suspended (iOS/Safari policy)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playBoop(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // High-pitched cute cute boop
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

  osc.start();
  osc.stop(ctx.currentTime + 0.13);
}

export function playRejectSigh(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Sad sliding tone
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, ctx.currentTime); 
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

export function playNoShake(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Wobbly pitch
  osc.type = 'sine';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(330, now);
  osc.frequency.linearRampToValueAtTime(380, now + 0.05);
  osc.frequency.linearRampToValueAtTime(280, now + 0.1);
  osc.frequency.linearRampToValueAtTime(330, now + 0.15);

  gain.gain.setValueAtTime(0.06, now);
  gain.gain.linearRampToValueAtTime(0.0001, now + 0.15);

  osc.start();
  osc.stop(now + 0.16);
}

export function playYay(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const playNote = (freq: number, delay: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);
    
    gain.gain.setValueAtTime(0.0, now + delay);
    gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.02);
    gain.gain.linearRampToValueAtTime(0.0001, now + delay + duration);

    osc.start(now + delay);
    osc.stop(now + delay + duration);
  };

  // Upward sparkling bubble-gummy major chord
  playNote(523.25, 0.0, 0.15);  // C5
  playNote(659.25, 0.05, 0.15); // E5
  playNote(783.99, 0.10, 0.15); // G5
  playNote(1046.50, 0.15, 0.25); // C6
}

export function playBellChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const playTine = (freq: number, amplitude: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Warm bell sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(amplitude, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.3);
  };

  // Bell voice harmonics
  playTine(880, 0.08);   // Fundamental A5
  playTine(1320, 0.04);  // Fifth E6
  playTine(1760, 0.02);  // Octave A6
  playTine(2200, 0.01);  // Major Third C#7
}

// Synced melodic frequencies for Stephen Sanchez's "Until I Found You" theme
const RETRO_MELODY = [
  392.00,  // "i"      (G4)
  523.25,  // "fell"   (C5)
  587.33,  // "in"     (D5)
  659.25,  // "love"   (E5)
  523.25,  // "but"    (C5)
  440.00,  // "she"    (A4)
  493.88,  // "left"   (B4)
  523.25,  // "me"     (C5)
  392.00,  // "lonely" (G4)
  349.23,  // "tried"  (F4)
  392.00,  // "to"     (G4)
  440.00,  // "trust"  (A4)
  349.23,  // "but"    (F4)
  293.66,  // "it"     (D4)
  329.63,  // "burned" (E4)
  349.23,  // "me"     (F4)
  293.66,  // "slowly" (D4)
  392.00,  // "i"      (G4)
  440.00,  // "didnt"  (A4)
  493.88,  // "know"   (B4)
  523.25,  // "what"   (C5)
  587.33,  // "i"      (D5)
  659.25,  // "was"    (E5)
  698.46,  // "looking" (F5)
  783.99,  // "for"    (G5)
  523.25,  // "till"   (C5)
  587.33,  // "i"      (D5)
  659.25,  // "found"  (E5)
  1046.50, // "her"    (C6 - high sweet resolution chord note!)
];

export function playLyricTick(index: number): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freq = RETRO_MELODY[index % RETRO_MELODY.length];

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Set warm electronic sine/triangle combination voice style
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

  // Add subtle sub-harmonic resonant second tine for warmer acoustic feel
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.type = 'triangle';
  subOsc.frequency.setValueAtTime(freq / 2, now); // Octave below
  subGain.gain.setValueAtTime(0, now);
  subGain.gain.linearRampToValueAtTime(0.04, now + 0.01);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  osc.start(now);
  osc.stop(now + 0.65);

  subOsc.start(now);
  subOsc.stop(now + 0.45);
}


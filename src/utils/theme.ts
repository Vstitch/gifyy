export interface ThemeStyles {
  background: string;
  cardBg: string;
  border: string;
  text: string;
  subtext: string;
  btnPrimary: string;
  btnPrimaryGlow: string;
  accentBadge: string;
  ring: string;
}

export function getColorTheme(name: 'blue' | 'pink' | 'purple' | 'green' | 'amber'): ThemeStyles {
  switch (name) {
    case 'pink':
      return {
        background: 'from-rose-50 via-pink-50 to-purple-50',
        cardBg: 'bg-white/85 border-pink-100/80',
        border: 'border-pink-200',
        text: 'text-pink-600',
        subtext: 'text-pink-400',
        btnPrimary: 'bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-100',
        btnPrimaryGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
        accentBadge: 'bg-pink-50 text-pink-700 border-pink-200',
        ring: 'focus:ring-pink-300',
      };
    case 'purple':
      return {
        background: 'from-purple-50 via-fuchsia-50 to-indigo-50',
        cardBg: 'bg-white/85 border-purple-100/80',
        border: 'border-purple-200',
        text: 'text-purple-600',
        subtext: 'text-purple-400',
        btnPrimary: 'bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-100',
        btnPrimaryGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
        accentBadge: 'bg-purple-50 text-purple-700 border-purple-200',
        ring: 'focus:ring-purple-300',
      };
    case 'green':
      return {
        background: 'from-teal-50 via-emerald-50 to-cyan-50',
        cardBg: 'bg-white/85 border-emerald-100/80',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        subtext: 'text-emerald-500',
        btnPrimary: 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-100',
        btnPrimaryGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        accentBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        ring: 'focus:ring-emerald-300',
      };
    case 'amber':
      return {
        background: 'from-amber-50 via-orange-50 to-yellow-50',
        cardBg: 'bg-white/85 border-amber-100/80',
        border: 'border-amber-200',
        text: 'text-amber-700',
        subtext: 'text-amber-500',
        btnPrimary: 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-100',
        btnPrimaryGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        accentBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        ring: 'focus:ring-amber-300',
      };
    case 'blue':
    default:
      return {
        background: 'from-blue-50 via-indigo-50 to-violet-50',
        cardBg: 'bg-white/85 border-blue-100/80',
        border: 'border-blue-200',
        text: 'text-blue-600',
        subtext: 'text-blue-400',
        btnPrimary: 'bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-100',
        btnPrimaryGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        accentBadge: 'bg-blue-50 text-blue-700 border-blue-200',
        ring: 'focus:ring-blue-300',
      };
  }
}

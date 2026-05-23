import { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  RotateCcw,
  Sparkles,
  Gift
} from 'lucide-react';
import { GiftSettings, Coupon } from '../types';
import { playBoop, playYay } from '../utils/audio';
import { DEFAULT_SETTINGS, encodeSettings } from '../utils/url';

interface CustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: GiftSettings;
  onSave: (settings: GiftSettings) => void;
}

export default function Customizer({ isOpen, onClose, currentSettings, onSave }: CustomizerProps) {
  const [sender, setSender] = useState(currentSettings.senderName);
  const [receiver, setReceiver] = useState(currentSettings.receiverName);
  const [title, setTitle] = useState(currentSettings.giftTitle);
  const [message, setMessage] = useState(currentSettings.giftText);
  const [theme, setTheme] = useState(currentSettings.colorTheme);
  const [icon, setIcon] = useState(currentSettings.iconType);
  const [coupons, setCoupons] = useState<Coupon[]>([...currentSettings.coupons]);
  
  const [newCouponTitle, setNewCouponTitle] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Generate preview share link whenever active states edit
    const tempSettings: GiftSettings = {
      senderName: sender || 'Your Special Person',
      receiverName: receiver || 'My Favorite Human',
      giftTitle: title || 'PLS ACCEPT THE GIFT 🥺',
      giftText: message || 'This gift is just a small reminder that you are special! ❤️',
      iconType: icon,
      colorTheme: theme,
      coupons: coupons,
    };

    const b64 = encodeSettings(tempSettings);
    // Base it on the current URL path
    const url = new URL(window.location.href);
    url.hash = `g=${b64}`;
    setShareUrl(url.toString());
  }, [sender, receiver, title, message, theme, icon, coupons]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      playYay();
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const handleAddCoupon = () => {
    if (!newCouponTitle.trim()) return;
    playBoop();
    const newCoupon: Coupon = {
      id: Math.random().toString(36).substr(2, 9),
      title: newCouponTitle.trim(),
      description: newCouponDesc.trim() || 'Redeemable anytime for maximum wholesomeness.',
      code: `GIFT-${Math.floor(Math.random() * 900 + 100)}-${Date.now().toString().slice(-4)}`,
      isRedeemed: false,
    };
    setCoupons([...coupons, newCoupon]);
    setNewCouponTitle('');
    setNewCouponDesc('');
  };

  const handleRemoveCoupon = (id: string) => {
    playBoop();
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const handleReset = () => {
    playBoop();
    setSender(DEFAULT_SETTINGS.senderName);
    setReceiver(DEFAULT_SETTINGS.receiverName);
    setTitle(DEFAULT_SETTINGS.giftTitle);
    setMessage(DEFAULT_SETTINGS.giftText);
    setTheme(DEFAULT_SETTINGS.colorTheme);
    setIcon(DEFAULT_SETTINGS.iconType);
    setCoupons([...DEFAULT_SETTINGS.coupons]);
  };

  const handleApply = () => {
    playYay();
    const finalizedSettings: GiftSettings = {
      senderName: sender || 'Your Special Person',
      receiverName: receiver || 'My Favorite Human',
      giftTitle: title || 'PLS ACCEPT THE GIFT 🥺',
      giftText: message || 'This gift is just a small reminder that you are special! ❤️',
      iconType: icon,
      colorTheme: theme,
      coupons: coupons,
    };
    onSave(finalizedSettings);
    onClose();
  };

  const themes: Array<'blue' | 'pink' | 'purple' | 'green' | 'amber'> = [
    'blue',
    'pink',
    'purple',
    'green',
    'amber',
  ];

  const icons: Array<'heart' | 'star' | 'coffee' | 'cookie' | 'gift' | 'hug'> = [
    'heart',
    'star',
    'coffee',
    'cookie',
    'gift',
    'hug',
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-end z-50">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300"
        id="customizer-panel"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-[spin_3s_linear_infinite]" />
            <h2 className="text-xl font-bold text-gray-800 font-rounded">Customize Gift Card</h2>
          </div>
          <button 
            onClick={() => { playBoop(); onClose(); }}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 focus:outline-none"
            id="close-customizer-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Intro Box */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100/40 text-xs text-indigo-950 leading-relaxed">
            ✏️ Create a custom love card! Edit the texts, add personalized digital redeemable coupons, choose your style theme, and click <strong className="text-indigo-600">Copy Link</strong> to send it.
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">FROM (SENDER)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Me"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all font-medium"
                id="sender-input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">TO (RECEIVER)</label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="You"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all font-medium"
                id="receiver-input"
              />
            </div>
          </div>

          {/* Text Fields */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">MAIN QUESTION CARD TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="PLS ACCEPT THE GIFT 🥺"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all font-rounded"
              id="title-input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 font-sans">REVEALED GIFT STORY / PARAGRAPH</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="This gift is just a..."
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all leading-relaxed"
              id="message-input"
            />
          </div>

          {/* Style Customizer Theme Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 block">CARD COLOR THEME</label>
            <div className="flex gap-2.5">
              {themes.map((t) => {
                const colors = {
                  pink: 'bg-pink-400 ring-pink-100',
                  blue: 'bg-blue-400 ring-blue-100',
                  purple: 'bg-purple-400 ring-purple-100',
                  green: 'bg-emerald-400 ring-emerald-100',
                  amber: 'bg-amber-400 ring-amber-100',
                };
                return (
                  <button
                    key={t}
                    onClick={() => { playBoop(); setTheme(t); }}
                    className={`w-9 h-9 rounded-full ${colors[t]} cursor-pointer transform hover:scale-110 active:scale-95 transition-all outline-none ${
                      theme === t ? 'ring-4 ring-offset-2 scale-105' : 'opacity-80'
                    }`}
                    title={t}
                    id={`theme-btn-${t}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 block">FINAL CARD REVEAL EMBLEM</label>
            <div className="flex gap-2 flex-wrap">
              {icons.map((ic) => {
                const labels = {
                  heart: '❤️ Heart',
                  star: '✨ Star',
                  coffee: '☕ Coffee',
                  cookie: '🍪 Cookie',
                  gift: '🎁 Gift',
                  hug: '🧸 Hug Item',
                };
                return (
                  <button
                    key={ic}
                    onClick={() => { playBoop(); setIcon(ic); }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all transform hover:scale-102 cursor-pointer ${
                      icon === ic
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                    id={`icon-btn-${ic}`}
                  >
                    {labels[ic]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coupons Module */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div>
              <label className="text-xs font-semibold text-gray-500 block uppercase tracking-wide">
                Custom Coupon Book Gift ({coupons.length})
              </label>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Coupons that your favorite person can click to instantly redeem on screen.
              </p>
            </div>

            {/* Coupons List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {coupons.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-xs text-gray-400">
                  No coupons added yet. Add custom coupons below!
                </div>
              ) : (
                coupons.map((c) => (
                  <div 
                    key={c.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-xl transition-all"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-gray-700 font-rounded">{c.title}</h4>
                      <p className="text-[10px] text-gray-400">{c.description}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveCoupon(c.id)}
                      className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      id={`remove-coupon-${c.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Coupon fields */}
            <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 space-y-2">
              <input
                type="text"
                value={newCouponTitle}
                onChange={(e) => setNewCouponTitle(e.target.value)}
                placeholder="e.g. Back Massage 💆‍♂️"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 font-medium"
                id="coupon-title-input"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="Short description (e.g. Valid for 45 mins with high quality essential oils)"
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  id="coupon-desc-input"
                />
                <button
                  type="button"
                  onClick={handleAddCoupon}
                  className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                  id="add-coupon-btn"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Button & Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3 sticky bottom-0 z-10">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-indigo-500 block uppercase tracking-wider">YOUR MAGICAL SHARE LINK</span>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-500 overflow-ellipsis font-mono truncate select-all focus:outline-none"
                id="share-url-preview-input"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 transition-all cursor-pointer transform hover:scale-103 ${
                  copied ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : ''
                }`}
                id="copy-to-clipboard-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] font-semibold text-emerald-600 block text-right animate-pulse">
                ✨ Successfully copied link! Text it to your favorite human!
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 active:scale-95 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              id="reset-form-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Default
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-100 transition-all cursor-pointer"
              id="apply-changes-btn"
            >
              Apply Locally <Gift className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

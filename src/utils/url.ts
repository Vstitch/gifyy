import { GiftSettings, Coupon } from '../types';

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: '1',
    title: 'One Giant Hug 🫂',
    description: 'Redeem this for a warm, squeezy, double-wrap cuddle session anytime.',
    code: 'HUG-999-LOVE',
    isRedeemed: false,
  },
  {
    id: '2',
    title: 'Late Night Ice Cream Date 🍦',
    description: 'Redeem for 2 scoops of your favorite flavor, on me, even at 1 AM.',
    code: 'ICECREAM-321-SWEET',
    isRedeemed: false,
  },
  {
    id: '3',
    title: 'One Hour Foot Massage 👣',
    description: 'Valid after a long exhausting day. Complete relaxation guaranteed.',
    code: 'RELAX-777-SPA',
    isRedeemed: false,
  },
  {
    id: '4',
    title: 'Yes Day! 👍',
    description: 'I have to say YES to whatever you request for a continuous 24 hours.',
    code: 'YES-YES-YES-888',
    isRedeemed: false,
  },
];

export const DEFAULT_SETTINGS: GiftSettings = {
  senderName: 'Your Special Person',
  receiverName: 'My Favorite Human',
  giftTitle: 'PLS ACCEPT THE GIFT 🥺',
  giftText: 'This gift is just a small reminder that you are incredibly special of mine! I wanted to make you smile today, and I hope this playful card brought a little joy to your day. ❤️',
  iconType: 'heart',
  colorTheme: 'blue',
  coupons: DEFAULT_COUPONS,
};

/**
 * Encodes GiftSettings schema into a shareable URL Hash string
 */
export function encodeSettings(settings: GiftSettings): string {
  try {
    const jsonStr = JSON.stringify(settings);
    // Use encodeURIComponent to support non-ASCII characters, then convert to base64
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    const binString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binString);
  } catch (err) {
    console.error('Error encoding settings:', err);
    return '';
  }
}

/**
 * Decodes GiftSettings from base64 hash parameter
 */
export function decodeSettings(hash: string): GiftSettings | null {
  if (!hash) return null;
  try {
    const binString = atob(hash);
    const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr) as GiftSettings;
    
    // Ensure coupons list has IDs
    if (!Array.isArray(parsed.coupons)) {
      parsed.coupons = DEFAULT_COUPONS;
    }
    return parsed;
  } catch (err) {
    console.error('Error decoding settings:', err);
    return null;
  }
}

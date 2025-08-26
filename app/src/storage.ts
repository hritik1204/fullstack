import { MMKV } from "react-native-mmkv";
import "react-native-url-polyfill/auto"; // for URL support

export const storage = new MMKV();

export type WishlistItem = {
  id: string;
  title: string;
  image: string | null;
  price: string | null;
  currency: string | null;
  siteName: string;
  sourceUrl: string;
  createdAt: string;
  normalizedUrl: string;
};

// Normalize URL (deduplication)
export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = ""; // remove #fragment
    u.searchParams.forEach((_, key) => {
      if (key.startsWith("utm_")) u.searchParams.delete(key);
    });
    u.hostname = u.hostname.toLowerCase();
    return u.toString();
  } catch {
    return url;
  }
}

export function migrateWishlist(): WishlistItem[] {
  const raw = storage.getString("wishlist");
  if (!raw) return [];

  let items = JSON.parse(raw);
  items = items.map((item: any) => {
    if (!item.normalizedUrl) {
      return { ...item, normalizedUrl: normalizeUrl(item.sourceUrl) };
    }
    return item;
  });

  storage.set("wishlist", JSON.stringify(items));
  return items;
}

export function saveWishlist(items: WishlistItem[]) {
  storage.set("wishlist", JSON.stringify(items));
}

export function getWishlist(): WishlistItem[] {
  const raw = storage.getString("wishlist");
  return raw ? JSON.parse(raw) : [];
}

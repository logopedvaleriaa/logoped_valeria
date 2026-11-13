import type { Material } from '../types/material';

export const promotionPercent = 25;
export const promotionStartsAt = Date.parse('2026-11-13T00:00:00+03:00');
// The offer includes all of 14 November, through 23:59 Moscow time.
export const promotionEndsAt = Date.parse('2026-11-15T00:00:00+03:00');
type PricedMaterial = Pick<Material, 'price' | 'isFree' | 'isDemo'>;
export function isPromotionActive(now = Date.now()): boolean {
 return now >= promotionStartsAt && now < promotionEndsAt;
}
export function materialPrice(item: PricedMaterial, now = Date.now()): number | null {
 const price = item.price;
 if (price === null || !Number.isFinite(price)) return null;
 if (item.isFree || item.isDemo || price <= 0 || !isPromotionActive(now)) return price;
 return Math.round(Math.round(price * 100) * (100 - promotionPercent) / 100) / 100;
}
export function hasPromotionPrice(item: PricedMaterial, now = Date.now()): boolean {
 const price = materialPrice(item, now);
 return price !== null && item.price !== null && price < item.price;
}
export function promotionTimeLeft(now: number): { days: number; hours: number; minutes: number; seconds: number } {
 const total = Math.max(0, Math.ceil((promotionEndsAt - now) / 1000));
 return { days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 };
}

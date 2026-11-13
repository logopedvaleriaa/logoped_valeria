import type { Material } from '../types/material';
import { materialPrice, hasPromotionPrice, promotionPercent } from './pricing.ts';
import { materialFormatLabel } from './materialFormats.ts';
export function canOrder(item: Material): boolean {
 return !item.isDemo && !item.isFree && item.price !== null && Number.isFinite(item.price) && item.price > 0;
}
export function resolveCart(value: unknown, catalog: Material[]): Material[] {
 if (!Array.isArray(value)) return [];
 const ids = new Set(value.filter((id): id is string => typeof id === 'string'));
 return catalog.filter(item => ids.has(item.id) && canOrder(item));
}
export function cartOriginalTotal(items: Material[]): number {
 return items.reduce((sum, item) => sum + Math.round((item.price ?? 0) * 100), 0) / 100;
}
export function cartTotal(items: Material[], now = Date.now()): number {
 return items.reduce((sum, item) => sum + Math.round((materialPrice(item, now) ?? 0) * 100), 0) / 100;
}
export function rubles(value: number): string {
 return new Intl.NumberFormat('ru-RU', {style:'currency',currency:'RUB',minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);
}
export function orderMessage(items: Material[], name: string, comment: string, now = Date.now()): string {
 return [
  'Здравствуйте! Хочу оформить заявку на материалы.',
  name.trim() ? `Имя: ${name.trim()}` : '',
  '',
  ...items.map((item, index) => `${index+1}. ${item.title} (${materialFormatLabel(item)}) — ${rubles(materialPrice(item, now) ?? 0)}${hasPromotionPrice(item, now) ? ` (−${promotionPercent}%, вместо ${rubles(item.price!)})` : ''}`),
  '', `Материалов: ${items.length}`, `Итого по каталогу: ${rubles(cartTotal(items, now))}`,
  comment.trim() ? `\nКомментарий: ${comment.trim()}` : '',
  '\nПодтвердите, пожалуйста, доступность, стоимость и способ оплаты.',
 ].filter(line => line !== '').join('\n');
}
export function telegramDraft(contact: string | null, message: string): string | null {
 return contact ? `https://t.me/${contact.replace(/^@/, '')}?text=${encodeURIComponent(message)}` : null;
}

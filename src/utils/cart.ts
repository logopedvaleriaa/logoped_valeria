import type { Material } from '../types/material';
import { materialFormatLabel } from './materialFormats.ts';
export function canOrder(item: Material): boolean {
 return !item.isDemo && !item.isFree && item.price !== null && Number.isFinite(item.price) && item.price > 0;
}
export function resolveCart(value: unknown, catalog: Material[]): Material[] {
 if (!Array.isArray(value)) return [];
 const ids = new Set(value.filter((id): id is string => typeof id === 'string'));
 return catalog.filter(item => ids.has(item.id) && canOrder(item));
}
export function cartTotal(items: Material[]): number {
 return items.reduce((sum, item) => sum + Math.round((item.price ?? 0) * 100), 0) / 100;
}
export function rubles(value: number): string {
 return new Intl.NumberFormat('ru-RU', {style:'currency',currency:'RUB',minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);
}
export function orderMessage(items: Material[], name: string, comment: string): string {
 return [
  'Здравствуйте! Хочу оформить заявку на материалы.',
  name.trim() ? `Имя: ${name.trim()}` : '',
  '',
  ...items.map((item, index) => `${index+1}. ${item.title} (${materialFormatLabel(item)}) — ${rubles(item.price ?? 0)}`),
  '', `Материалов: ${items.length}`, `Итого по каталогу: ${rubles(cartTotal(items))}`,
  comment.trim() ? `\nКомментарий: ${comment.trim()}` : '',
  '\nПодтвердите, пожалуйста, доступность, стоимость и способ оплаты.',
 ].filter(line => line !== '').join('\n');
}
export function telegramDraft(contact: string | null, message: string): string | null {
 return contact ? `https://t.me/${contact.replace(/^@/, '')}?text=${encodeURIComponent(message)}` : null;
}

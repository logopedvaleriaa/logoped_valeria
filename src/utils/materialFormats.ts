import type { Format, Material } from '../types/material';

type MaterialFormats = Pick<Material, 'format' | 'additionalFormats'>;
export function materialFormats(item: MaterialFormats): Format[] {
 return [...new Set([item.format, ...(item.additionalFormats ?? [])])];
}
export function materialFormatLabel(item: MaterialFormats): string {
 return materialFormats(item).join(' + ');
}
export function materialFormatDescription(item: MaterialFormats): string {
 const labels: Record<Format, string> = { '3D': 'Браузерная игра', HTML: 'Браузерная игра', PPTX: 'Игра в PowerPoint', PDF: 'PDF для печати' };
 return materialFormats(item).map(format => labels[format]).join(' + ');
}

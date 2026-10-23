import type { Material } from '../types/material';
import { materialFormats } from '../utils/materialFormats.ts';
export function materialSounds(item: Pick<Material, 'sound' | 'sounds'>): string[] {
 return item.sounds?.length ? item.sounds : [item.sound];
}
export function uniqueMaterialCount(groups: Material[][]): number {
 return new Set(groups.flatMap(group => group.map(item => item.id))).size;
}
export function filterMaterials(materials: Material[], params: URLSearchParams): Material[] {
 const value = (key: string) => params.get(key) || '';
 return materials.filter(m =>
  `${m.title} ${m.subtitle ?? ''} ${m.description}`.toLocaleLowerCase('ru').includes(value('q').trim().toLocaleLowerCase('ru')) &&
  (!value('sound') || materialSounds(m).includes(value('sound'))) &&
  (!value('format') || materialFormats(m).some(format => value('format') === 'browser' ? format === '3D' || format === 'HTML' : format === value('format'))) &&
  (!value('age') || m.age === value('age')) &&
  (!value('new') || (m.isNew === true && !m.isDemo)) &&
  (!value('cost') || (value('cost') === 'free' ? m.isFree : !m.isFree))
 ).sort((a,b) => value('sort') === 'title' ? a.title.localeCompare(b.title,'ru') : Number(a.id)-Number(b.id));
}

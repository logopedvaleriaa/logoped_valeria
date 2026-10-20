import type { Material } from '../types/material';
export function filterMaterials(materials: Material[], params: URLSearchParams): Material[] {
 const value = (key: string) => params.get(key) || '';
 return materials.filter(m =>
  `${m.title} ${m.description}`.toLocaleLowerCase('ru').includes(value('q').trim().toLocaleLowerCase('ru')) &&
  (!value('sound') || m.sound === value('sound')) &&
  (!value('format') || m.format === value('format')) &&
  (!value('age') || m.age === value('age')) &&
  (!value('cost') || (value('cost') === 'free' ? m.isFree : !m.isFree))
 ).sort((a,b) => value('sort') === 'title' ? a.title.localeCompare(b.title,'ru') : Number(a.id)-Number(b.id));
}

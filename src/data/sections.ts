import type { Format, Material } from '../types/material';
import { materialFormats } from '../utils/materialFormats.ts';
export interface CatalogSection {
 format: 'browser' | 'PPTX' | 'PDF';
 formats: Format[];
 title: string;
 description: string;
 icon: string;
}
export const catalogSections: CatalogSection[] = [
 {format:'browser',formats:['3D','HTML'],title:'Браузерные игры',description:'3D- и другие интерактивные игры, которые открываются по ссылке.',icon:'⌘'},
 {format:'PPTX',formats:['PPTX'],title:'PowerPoint',description:'Презентации с речевыми заданиями.',icon:'▱'},
 {format:'PDF',formats:['PDF'],title:'Материалы для печати и скачивания',description:'Карточки и рабочие листы для занятий за столом.',icon:'▤'},
];
export function belongsToSection(item: Material, section: Pick<CatalogSection, 'formats'>): boolean {
 return materialFormats(item).some(format => section.formats.includes(format));
}

export const catalogTopics = [
 {id:'new',title:'Новинки',emptyMessage:'Новые материалы скоро появятся.'},
 {id:'articulation',title:'Артикуляционная гимнастика',emptyMessage:'Отдельные материалы по артикуляционной гимнастике скоро появятся.'},
 {id:'universal',title:'Универсальные игры',emptyMessage:'Универсальные игры скоро появятся.'},
] as const;
export function matchesCatalogTopic(item: Material, topic: string): boolean {
 if(topic==='new') return item.isNew === true && !item.isDemo;
 if(topic==='articulation' || topic==='universal') return item.topics?.includes(topic) ?? false;
 return false;
}

export const catalogNavigationOrder = ['new', 'browser', 'universal', 'PPTX', 'articulation', 'PDF'] as const;

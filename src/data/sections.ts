import type { Format } from '../types/material';
export const catalogSections: { format: Format; title: string; description: string; icon: string }[] = [
  {format:'3D',title:'3D-игры',description:'Объёмные миры для речевых приключений.',icon:'◇'},
  {format:'HTML',title:'Игры в браузере',description:'Интерактивные задания, которые открываются по ссылке.',icon:'⌘'},
  {format:'PPTX',title:'Игры в PowerPoint',description:'Презентации с историями и речевыми заданиями.',icon:'▱'},
  {format:'PDF',title:'Материалы для печати',description:'Карточки и рабочие листы для занятий за столом.',icon:'▤'},
];

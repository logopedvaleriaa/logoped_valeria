import type { Material } from '../types/material';
export const telegramContact: string | null = null;
type DemoInput = Pick<Material, 'id' | 'slug' | 'title' | 'description' | 'sound' | 'format' | 'age' | 'isFree' | 'cover' | 'tasks'>;
function demo(item: DemoInput): Material {
 return {price:null,isDemo:true,screenshots:[],playUrl:null,downloadUrl:null,telegramOrderUrl:null,...item};
}
export const materials: Material[] = ([
 {id:'1',slug:'forest-adventure',title:'Лесные приключения',description:'Отправляемся по лесной тропинке, знакомимся с её обитателями и тренируем звук Р в словах и предложениях. Пример будущей интерактивной 3D-игры.',sound:'Р',format:'3D',age:'5–6',isFree:false,cover:'covers/forest.svg',tasks:['Автоматизация звука Р','Развитие связной речи','Расширение словарного запаса']},
 {id:'2',slug:'treasure-island',title:'Остров сокровищ',description:'Небольшое путешествие по карте с речевыми заданиями. Пример презентации для индивидуальных и групповых занятий.',sound:'Р',format:'PPTX',age:'6–7',isFree:false,cover:'covers/island.svg',tasks:['Автоматизация звука Р','Составление предложений','Развитие слухового внимания']},
 {id:'3',slug:'fox-stories',title:'Лисьи истории',description:'Речевые истории с любознательным лисёнком. Пример браузерной игры для закрепления звука Л.',sound:'Л',format:'HTML',age:'4–5',isFree:true,cover:'covers/fox.svg',tasks:['Автоматизация звука Л','Развитие грамматического строя речи','Составление рассказа']},
 {id:'4',slug:'sunny-words',title:'Солнечные слова',description:'Светлая подборка заданий для печати: называем картинки, ищем нужный звук и составляем словосочетания.',sound:'С',format:'PDF',age:'4–5',isFree:true,cover:'covers/sun.svg',tasks:['Автоматизация звука С','Развитие фонематического восприятия']},
 {id:'5',slug:'quiet-forest',title:'Шёпот леса',description:'Пример интерактивной презентации с лесными героями и заданиями на звук Ш.',sound:'Ш',format:'PPTX',age:'5–6',isFree:false,cover:'covers/mushroom.svg',tasks:['Автоматизация звука Ш','Развитие речевого дыхания','Слуховое внимание']},
 {id:'6',slug:'speech-garden',title:'Сад красивой речи',description:'Пример набора карточек для развития речи. Рассматриваем, сравниваем, описываем и придумываем свои истории.',sound:'Другие',format:'PDF',age:'6–7',isFree:true,cover:'covers/garden.svg',tasks:['Развитие связной речи','Обогащение словаря','Формирование грамматических навыков']},
] satisfies DemoInput[]).map(demo);

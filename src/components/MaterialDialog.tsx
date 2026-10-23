import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Material } from '../types/material';
import AddToCart from './AddToCart';
import { canOrder, rubles } from '../utils/cart';
import { Cover } from './ui';
import GalleryControls from './GalleryControls';
import { materialFormatLabel, materialFormatDescription } from '../utils/materialFormats';
const DialogContext = createContext<(item: Material) => void>(() => {});
export const useMaterialDialog = () => useContext(DialogContext);
export default function MaterialDialogProvider({ children }: { children: ReactNode }) {
 const [item, setItem] = useState<Material | null>(null);
 const [image, setImage] = useState(0);
 const dialog = useRef<HTMLDialogElement>(null);
 const trigger = useRef<HTMLElement | null>(null);
 const location = useLocation();
 useEffect(() => { setItem(null); }, [location.pathname]);
 useEffect(() => {
  const node = dialog.current;
  if (!item || !node) return;
  const previousOverflow = document.body.style.overflow;
  node.showModal();
  document.body.style.overflow = 'hidden';
  return () => {
   node.close();
   document.body.style.overflow = previousOverflow;
   trigger.current?.focus();
  };
 }, [item]);
 const open = (material: Material) => { trigger.current = document.activeElement as HTMLElement; setImage(0); setItem(material); };
 const close = () => setItem(null);
 const images = item ? [item.cover, ...item.screenshots] : [];
 return <DialogContext.Provider value={open}>{children}<dialog ref={dialog} className="material-dialog" aria-labelledby="game-dialog-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}>
  {item && <div className={`dialog-content ${item.screenshots.length ? 'has-screenshots' : ''}`}><button autoFocus className="dialog-close" onClick={close} aria-label="Закрыть описание игры">✕</button>
   <div className="dialog-media"><div className="dialog-cover"><Cover fit={item.imageFit} key={images[image]} src={images[image]} alt={item.title}/><span className="dialog-image-badges">{item.isNew&&<span className="status-badge new-badge">Новинка</span>}<span className={`demo-tag ${item.isDemo ? '' : 'free-tag'}`}>{item.isDemo ? 'Демо' : item.isFree ? 'Бесплатно' : item.price===null ? 'Цена не указана' : rubles(item.price)}</span></span><GalleryControls count={images.length} current={image} onChange={setImage}/></div>
    {images.length>1&&<div className="dialog-thumbnails" aria-label="Выбрать скриншот">{images.map((src,i)=><button key={src} type="button" aria-label={`Показать скриншот ${i+1}`} aria-pressed={image===i} onClick={()=>setImage(i)}><Cover fit={item.imageFit} src={src} alt=""/></button>)}</div>}
   </div>
   <div className="dialog-body"><p className="eyebrow">{materialFormatLabel(item)} · {item.sound === 'Другие' ? (item.topics?.includes('articulation')?'Артикуляционная гимнастика':'Развитие речи') : `${item.sounds&&item.sounds.length>1?'Звуки':'Звук'} ${item.sound}`}</p><h2 id="game-dialog-title">{item.title}</h2>{item.subtitle && <p className="material-subtitle">{item.subtitle}</p>}
    <p className="dialog-format">{materialFormatDescription(item)}</p><div className="material-tags"><span>{materialFormatLabel(item)}</span><span>{item.sound==='Другие'?(item.topics?.includes('articulation')?'Артикуляционная гимнастика':'Развитие речи'):`${item.sounds&&item.sounds.length>1?'Звуки':'Звук'} ${item.sound}`} </span>{item.age&&<span>{item.age} лет</span>}</div>
<p>{item.description}</p>


    <div className="dialog-actions"><strong className={`dialog-price ${item.isFree&&!item.isDemo?'free-price':''}`}>{item.isDemo?'Демо':item.isFree?'Бесплатно':item.price===null?'Цена не указана':rubles(item.price)}</strong>{!item.isDemo && item.isFree && item.playUrl ? <><a className="button" href={item.playUrl} target="_blank" rel="noopener noreferrer">Играть бесплатно ↗</a><small>Бесплатно, заявка не нужна. Игра откроется в новой вкладке.</small></> : !item.isDemo && item.isFree && item.downloadUrl ? <a className="button" href={item.downloadUrl} download>Скачать</a> : canOrder(item) ? <AddToCart item={item} onNavigate={close}/> : <p className="dialog-unavailable">{item.isDemo ? 'Демонстрационная карточка. Игра или файл пока не добавлены.' : 'Материал пока недоступен.'}</p>}
    {!item.isFree && <Link className="text-link" onClick={close} to="/how-to-buy">Как купить</Link>}</div>
    {item.instructions&&<div className="game-instructions download-instructions"><h3>{item.format==='PDF'?'Как использовать':'Как запустить'}</h3><p>{item.instructions}</p></div>}
    {item.slug==='derevnya-r'&&<details className="dialog-help"><summary>Управление в игре</summary><p>На компьютере: WASD или стрелки — движение, E — взаимодействие. На сенсорном экране используйте джойстик и кнопки. Перед игрой можно выбрать артикуляционную гимнастику.</p></details>}
   </div>
  </div>}
 </dialog></DialogContext.Provider>;
}

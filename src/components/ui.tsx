import { useState } from 'react';
import AddToCart from './AddToCart';
import { materialFormatLabel } from '../utils/materialFormats';
import { canOrder, rubles } from '../utils/cart';
import { useMaterialDialog } from './MaterialDialog';
import type { Material } from '../types/material';
export function Cover({src,alt,fit,...props}: {src:string;alt:string;fit?:'cover'|'contain';className?:string}) {
 const [failed,setFailed]=useState(false);
 return failed ? <div className={`image-fallback ${props.className || ''}`} role="img" aria-label={alt}>✧<span>Обложка готовится</span></div> : <img {...props} style={fit==='contain'?{objectFit:fit,background:'var(--surface)'}:undefined} src={`${import.meta.env.BASE_URL}${src}`} alt={alt} loading="lazy" onError={()=>setFailed(true)}/>;
}
export function Card({item}:{item:Material}) {
 const open = useMaterialDialog();
 const playable = !item.isDemo && item.isFree && item.playUrl;
 const downloadable = !item.isDemo && item.isFree && item.downloadUrl;
 return <article className="material-card">
  <div className="card-edition"><span className="card-badges"><span className="format-badge">{materialFormatLabel(item)}</span>{item.isDemo ? <span className="status-badge">Демо</span> : item.isFree && <span className="status-badge free-badge">Бесплатно</span>}{item.isNew&&<span className="status-badge new-badge">Новинка</span>}</span></div>
  <button type="button" onClick={()=>open(item)} className={`cover-link ${item.screenshots.length ? 'screenshot-cover' : ''}`} aria-label={`Подробнее: ${item.title}`}>
   <Cover fit={item.imageFit} src={item.cover} alt={`Иллюстрация «${item.title}»`}/>
  </button>
  <div className="card-content">
   <h3><button className="card-title-button" onClick={()=>open(item)}>{item.title}</button></h3>
   <p className="material-subtitle">{item.subtitle || (item.sound==='Другие'?'Развитие речи':`Автоматизация звука ${item.sound}`)}</p>
   <p className={`card-price ${item.isFree&&!item.isDemo?'free-price':''}`}>{item.isDemo?'Демонстрационный материал':item.isFree?'Бесплатно':item.price===null?'Цена не указана':rubles(item.price)}</p>
   <div className="card-actions"><button className="card-more" onClick={()=>open(item)} aria-label={`Подробнее о материале «${item.title}»`}>Подробнее</button>
    {playable?<a className="button" href={playable} target="_blank" rel="noopener noreferrer" aria-label={`Играть: ${item.title} (в новой вкладке)`}>▸ Играть</a>:downloadable?<a className="button" href={downloadable} download>Скачать</a>:canOrder(item)?<AddToCart item={item}/>:<button className="button demo-details" onClick={()=>open(item)}>Описание</button>}
   </div>
  </div>
 </article>;
}
export function SectionTitle({kicker,title,children}:{kicker:string;title:string;children?:React.ReactNode}) {return <div className="section-heading"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>{children}</div>}

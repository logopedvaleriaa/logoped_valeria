import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Material } from '../types/material';
export function Cover({src,alt,...props}: {src:string;alt:string;className?:string}) {
 const [failed,setFailed]=useState(false);
 return failed ? <div className={`image-fallback ${props.className || ''}`} role="img" aria-label={alt}>✧<span>Обложка готовится</span></div> : <img {...props} src={`${import.meta.env.BASE_URL}${src}`} alt={alt} loading="lazy" onError={()=>setFailed(true)}/>;
}
export function Card({item}:{item:Material}) {return <article className="material-card"><Link to={`/materials/${item.slug}`} className="cover-link" aria-label={`Подробнее: ${item.title}`}><Cover src={item.cover} alt={`Иллюстрация «${item.title}»`}/><span className="demo-tag">Демо</span><span className="cover-arrow">↗</span></Link><div className="card-content"><p className="eyebrow">{item.format} <span>•</span> ЗВУК {item.sound === 'Другие' ? '— РАЗВИТИЕ РЕЧИ' : item.sound}</p><h3><Link to={`/materials/${item.slug}`}>{item.title}</Link></h3><div className="card-bottom"><span>{item.age} лет <b>·</b> {item.isFree ? 'Бесплатно' : 'Цена не задана'}</span><Link to={`/materials/${item.slug}`} aria-label={`Подробнее о материале «${item.title}»`}>Подробнее ↗</Link></div></div></article>}
export function SectionTitle({kicker,title,children}:{kicker:string;title:string;children?:React.ReactNode}) {return <div className="section-heading"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>{children}</div>}

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { materials } from '../data/materials';
import { filterMaterials, uniqueMaterialCount } from '../data/filterMaterials';
import { Card } from '../components/ui';
import Seo from '../components/Seo';
import WorkshopFlower from '../components/WorkshopFlower';
import { catalogSections, catalogTopics, matchesCatalogTopic, catalogNavigationOrder } from '../data/sections';
function SearchIcon(){return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>;}
function FilterIcon(){return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 6h18M6 12h12M10 18h4"/></svg>;}
export default function Catalog() {
 const [params,setParams]=useSearchParams();
 const [searchOpen,setSearchOpen]=useState(!!params.get('q'));
 const [filtersOpen,setFiltersOpen]=useState(!!params.get('cost'));
 const rawFormat=params.get('format') || '';
 const format=rawFormat==='3D'||rawFormat==='HTML'?'browser':rawFormat;
 const topic=catalogTopics.find(entry=>entry.id===params.get('topic'));
 const activeTopic=topic?.id || '';
 const thematic=!!topic;
 const cost=params.get('cost') || '';
 const query=params.get('q') || '';
 function update(key:string,value:string){const next=new URLSearchParams(params);if(key==='topic')next.delete('format');if(key==='format')next.delete('topic');if(value)next.set(key,value);else next.delete(key);setParams(next,{replace:true});}
 function visible(sectionFormat:string,inTopic=thematic){return filterMaterials(inTopic?materials.filter(item=>matchesCatalogTopic(item,activeTopic)):materials,new URLSearchParams({format:sectionFormat,cost,q:query}));}
 const sections=thematic?[{format:'',formats:[],title:topic!.title,description:'',icon:''}]:catalogSections.filter(section=>!format||section.format===format);
 function topicCount(id:string){return filterMaterials(materials.filter(item=>matchesCatalogTopic(item,id)),new URLSearchParams({cost,q:query})).length;}
 const navigationItems=[
  ...catalogTopics.map(entry=>({id:String(entry.id),filter:'topic',title:entry.title,selected:activeTopic===entry.id,count:topicCount(entry.id)})),
  ...catalogSections.map(section=>({id:String(section.format),filter:'format',title:section.title,selected:format===section.format,count:visible(section.format,false).length})),
 ].sort((a,b)=>catalogNavigationOrder.findIndex(id=>id===a.id)-catalogNavigationOrder.findIndex(id=>id===b.id));
 const shown=uniqueMaterialCount(sections.map(section=>visible(section.format)));
 const hasFilters=!!(thematic||format||query||cost);
 return <div className="container page section simple-catalog">
  <Seo title="Каталог игр" description="Логопедические игры Валерии Выстороп. Браузерные игры, PowerPoint, артикуляционная гимнастика и материалы для печати. Выберите раздел и найдите нужное пособие."/>
  <div className="catalog-heading"><div className="catalog-title"><p className="eyebrow">Авторская библиотека</p><h1>Каталог игр <WorkshopFlower className="catalog-flower"/></h1></div><p className="catalog-total" role="status" aria-live="polite">Показано: {shown} из {materials.length}</p></div>
  <div className="catalog-workspace">
  <aside className="compact-catalog-filter" aria-label="Выбор материалов">
   <div className="catalog-tools"><button className="filter-tool" aria-expanded={searchOpen} aria-controls="catalog-search" onClick={()=>setSearchOpen(!searchOpen)}><SearchIcon/>Поиск</button><button className="filter-tool" aria-expanded={filtersOpen} aria-controls="catalog-extra-filters" onClick={()=>setFiltersOpen(!filtersOpen)}><FilterIcon/>Фильтры</button></div>
   <div id="catalog-search" hidden={!searchOpen} className="compact-search"><label htmlFor="catalog-query">Поиск по названию или описанию</label><div><input id="catalog-query" type="search" value={query} placeholder="Название игры, звук…" onChange={e=>update('q',e.target.value)}/><button aria-label="Очистить поиск" onClick={()=>update('q','')}>✕</button></div></div>
   <div id="catalog-extra-filters" hidden={!filtersOpen} className="compact-extra">
    <div className="compact-filter-row" role="group" aria-label="Стоимость материалов"><span className="compact-filter-label">Цена</span><div className="filter-segments"><button aria-pressed={cost==='free'} onClick={()=>update('cost',cost==='free'?'':'free')}>Бесплатно</button><button aria-pressed={cost==='paid'} onClick={()=>update('cost',cost==='paid'?'':'paid')}>Платно</button></div></div>
    <div className="compact-filter-row" role="group" aria-label="Формат материалов"><span className="compact-filter-label">Формат</span><div className="filter-segments">{catalogSections.map(section=><button key={section.format} aria-pressed={format===section.format} onClick={()=>update('format',format===section.format?'':section.format)}>{section.format==='PPTX'?'PowerPoint':section.format==='PDF'?'PDF':section.format==='browser'?'Браузерные игры':section.format}</button>)}</div></div>
   </div>
   {hasFilters&&<button className="compact-reset" onClick={()=>setParams({},{replace:true})}>Сбросить всё</button>}
   <p className="catalog-index-label">Разделы</p>
   <nav className="catalog-shortcuts" aria-label="Разделы каталога">
    <button aria-pressed={!format&&!thematic} onClick={()=>update('format','')}>{!format&&!thematic&&<span aria-hidden="true">✓ </span>}Все <span className="filter-count">{uniqueMaterialCount(catalogSections.map(section=>visible(section.format,false)))}</span></button>
    {navigationItems.map(entry=><button key={entry.id} aria-pressed={entry.selected} onClick={()=>update(entry.filter,entry.selected?'':entry.id)}>{entry.selected&&<span aria-hidden="true">✓ </span>}{entry.title} <span className="filter-count">{entry.count}</span></button>)}
   </nav>
  </aside>
  <div className="catalog-sections">{sections.map(section=>{
   const items=visible(section.format);
   return <section key={section.format} className="catalog-section" aria-label={section.title}>
    <div className="catalog-section-heading"><div className="section-caption"><h2 id={`section-${section.format||activeTopic}`}>{section.title}</h2></div><span className="section-count">{items.length}</span></div>
    {items.length?<div className="material-grid">{items.map(item=><Card key={item.id} item={item}/>)}</div>:<div className="section-empty" role="status"><p>{topic&&topicCount(topic.id)===0&&!query&&!cost?topic.emptyMessage:'По выбранным условиям материалов пока нет.'}</p>{hasFilters&&<button className="text-link" onClick={()=>setParams({},{replace:true})}>Сбросить фильтры</button>}</div>}
   </section>;
  })}</div>
  </div>
  {!sections.length&&<div className="empty"><h2>Раздел не найден</h2><button className="button" onClick={()=>update('format','')}>Показать все разделы</button></div>}
 </div>;
}

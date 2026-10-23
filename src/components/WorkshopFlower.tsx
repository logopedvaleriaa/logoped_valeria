export default function WorkshopFlower({className}:{className?:string}) {
 return <svg className={className} viewBox="0 0 72 72" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
  {[0,60,120,180,240,300].map(angle=><ellipse key={angle} cx="36" cy="21" rx="8" ry="14" transform={`rotate(${angle} 36 36)`}/>)}
  <circle cx="36" cy="36" r="5" fill="currentColor" stroke="none"/>
 </svg>;
}

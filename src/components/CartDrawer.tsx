import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from './CartProvider';
import Cart from '../pages/Cart';
export default function CartDrawer(){
 const {drawerOpen,setDrawerOpen}=useCart();
 const dialog=useRef<HTMLDialogElement>(null);
 const session=useRef<{trigger:HTMLElement|null;overflow:string}|null>(null);
 const {pathname}=useLocation();
 const finishClose=useCallback(()=>{
  dialog.current?.close();
  if(session.current){
   const {trigger,overflow}=session.current;
   session.current=null;
   document.body.style.overflow=overflow;
   if(trigger?.isConnected)trigger.focus();
  }
 },[]);
 useEffect(()=>setDrawerOpen(false),[pathname,setDrawerOpen]);
 useEffect(()=>()=>finishClose(),[finishClose]);
 useEffect(()=>{
  const node=dialog.current;
  if(!node||(!drawerOpen&&!node.open))return;
  const wasOpen=node.open;
  const from=wasOpen?getComputedStyle(node).transform:'translateX(100%)';
  if(drawerOpen&&!wasOpen){
   session.current={trigger:document.activeElement as HTMLElement|null,overflow:document.body.style.overflow};
   node.showModal();
   document.body.style.overflow='hidden';
  }
  node.dataset.state=drawerOpen?'open':'closing';
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   node.style.transform='translateX(0)';
   if(!drawerOpen)finishClose();
   return;
  }
  const animation=node.animate(
   [{transform:from},{transform:drawerOpen?'translateX(0)':'translateX(100%)'}],
   {duration:drawerOpen?360:280,easing:drawerOpen?'cubic-bezier(.22,1,.36,1)':'cubic-bezier(.4,0,1,1)',fill:'forwards'},
  );
  animation.onfinish=()=>{if(!drawerOpen)finishClose();};
  return ()=>{
   if(node.open)node.style.transform=getComputedStyle(node).transform;
   animation.cancel();
  };
 },[drawerOpen,finishClose]);
 return <dialog ref={dialog} className="cart-drawer" aria-labelledby="cart-drawer-title" onCancel={event=>{event.preventDefault();setDrawerOpen(false);}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)setDrawerOpen(false);}}}>
  <div className="cart-drawer-inner"><button autoFocus className="drawer-close" aria-label="Закрыть корзину" onClick={()=>setDrawerOpen(false)}>✕</button><Cart embedded onClose={()=>setDrawerOpen(false)}/></div>
 </dialog>;
}

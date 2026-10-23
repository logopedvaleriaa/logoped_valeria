import type { Material } from '../types/material';
import { useCart } from './CartProvider';
import { canOrder } from '../utils/cart';
export default function AddToCart({item, onNavigate}:{item:Material;onNavigate?:()=>void}) {
 const {items,add,setDrawerOpen}=useCart();
 if(!canOrder(item)) return null;
 return items.some(entry=>entry.id===item.id)
  ? <button className="button cart-added" onClick={()=>{onNavigate?.();setTimeout(()=>setDrawerOpen(true),0);}}>В корзине · Открыть →</button>
  : <button className="button" onClick={()=>add(item)}>В корзину +</button>;
}

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { materials } from '../data/materials';
import type { Material } from '../types/material';
import { canOrder, resolveCart } from '../utils/cart';
const key = 'valeria-cart-v1';
interface CartState { drawerOpen: boolean; setDrawerOpen: (open: boolean) => void; items: Material[]; add: (item: Material) => void; remove: (id: string) => void; clear: () => void; }
const CartContext = createContext<CartState | null>(null);
export function useCart() { const cart = useContext(CartContext); if (!cart) throw new Error('CartProvider is required'); return cart; }
export default function CartProvider({ children }: { children: ReactNode }) {
 const [drawerOpen,setDrawerOpen]=useState(false);
 const [items, setItems] = useState<Material[]>(() => { try { return resolveCart(JSON.parse(localStorage.getItem(key) || '[]'), materials); } catch { return []; } });
 useEffect(() => { try { localStorage.setItem(key, JSON.stringify(items.map(item => item.id))); } catch { /* Cart still works in memory when storage is unavailable. */ } }, [items]);
 function add(item: Material) { if (canOrder(item)) setItems(current => current.some(entry => entry.id === item.id) ? current : [...current, item]); }
 return <CartContext.Provider value={{drawerOpen,setDrawerOpen,items,add,remove:id=>setItems(current=>current.filter(item=>item.id!==id)),clear:()=>setItems([])}}>{children}</CartContext.Provider>;
}

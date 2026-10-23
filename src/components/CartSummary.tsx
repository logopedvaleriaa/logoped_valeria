import { useLocation } from 'react-router-dom';
import { useCart } from './CartProvider';
import { cartTotal, rubles } from '../utils/cart';
export default function CartSummary(){const {items,setDrawerOpen}=useCart();const {pathname}=useLocation();if(!items.length||pathname==='/cart')return null;return <aside className="cart-summary" aria-label="Выбранные материалы"><span>В корзине: <strong>{items.length}</strong> · {rubles(cartTotal(items))}</span><button className="button" onClick={()=>setDrawerOpen(true)}>Оформить заявку →</button></aside>;}

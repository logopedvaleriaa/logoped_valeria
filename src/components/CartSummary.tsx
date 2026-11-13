import { useLocation } from 'react-router-dom';
import { useCart } from './CartProvider';
import { usePromotionTime } from './Promotion';
import { PriceAmount } from './MaterialPrice';
import { cartTotal, cartOriginalTotal } from '../utils/cart';
export default function CartSummary(){const {items,setDrawerOpen}=useCart();const now=usePromotionTime();const {pathname}=useLocation();if(!items.length||pathname==='/cart')return null;return <aside className="cart-summary" aria-label="Выбранные материалы"><span>В корзине: <strong>{items.length}</strong> · <PriceAmount price={cartTotal(items,now)} originalPrice={cartOriginalTotal(items)} showBadge={false}/></span><button className="button" onClick={()=>setDrawerOpen(true)}>Оформить заявку →</button></aside>;}

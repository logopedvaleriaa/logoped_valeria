import type { Material } from '../types/material';
import { rubles } from '../utils/cart';
import { materialPrice, promotionPercent } from '../utils/pricing';
import { usePromotionTime } from './Promotion';

export function PriceAmount({ price, originalPrice = price, showBadge = true }: { price: number; originalPrice?: number; showBadge?: boolean }) {
 const discounted = originalPrice > price;
 return <span className={`material-price${discounted ? ' has-discount' : ''}`}>
  {discounted && <del className="original-price"><span className="price-accessible-label">Старая цена: </span>{rubles(originalPrice)}</del>}
  <span className="current-price">{discounted && <span className="price-accessible-label">Цена со скидкой: </span>}{rubles(price)}</span>
  {discounted && showBadge && <span className="discount-badge">−{promotionPercent}%</span>}
 </span>;
}
export default function MaterialPrice({ item, showBadge = true }: { item: Material; showBadge?: boolean }) {
 const now = usePromotionTime();
 if (item.isDemo) return <>Демо</>;
 if (item.isFree) return <>Бесплатно</>;
 const price = materialPrice(item, now);
 if (price === null) return <>Цена не указана</>;
 return <PriceAmount price={price} originalPrice={item.price!} showBadge={showBadge}/>;
}

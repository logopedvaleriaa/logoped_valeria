import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { isPromotionActive, promotionPercent, promotionTimeLeft } from '../utils/pricing';

const PromotionClock = createContext<number | null>(null);
export function usePromotionTime(): number {
 const now = useContext(PromotionClock);
 if (now === null) throw new Error('PromotionProvider is required');
 return now;
}
export default function PromotionProvider({ children }: { children: ReactNode }) {
 const [now, setNow] = useState(() => Date.now());
 useEffect(() => {
  const update = () => setNow(Date.now());
  const interval = window.setInterval(update, 1000);
  window.addEventListener('focus', update);
  document.addEventListener('visibilitychange', update);
  return () => { window.clearInterval(interval); window.removeEventListener('focus', update); document.removeEventListener('visibilitychange', update); };
 }, []);
 return <PromotionClock.Provider value={now}>{children}</PromotionClock.Provider>;
}
export function PromotionBanner() {
 const now = usePromotionTime();
 if (!isPromotionActive(now)) return null;
 const left = promotionTimeLeft(now);
 const units = [[left.days, 'дни'], [left.hours, 'часы'], [left.minutes, 'мин'], [left.seconds, 'сек']] as const;
 return <aside className="promotion-banner" aria-label="Акция на платные материалы">
  <div className="container promotion-inner"><span className="promotion-mark">−{promotionPercent}%</span>
   <div className="promotion-copy"><strong>На все платные материалы</strong><p>До <time dateTime="2026-11-14T23:59:59+03:00">14 ноября, 23:59 МСК</time></p></div>
   <div className="promotion-countdown"><span className="promotion-timer-label">До конца акции</span><div className="promotion-clock" role="timer" aria-live="off" aria-label={`До конца акции: ${left.days} дн. ${left.hours} ч. ${left.minutes} мин. ${left.seconds} сек.`}>
    {units.map(([value, label]) => <span className="promotion-unit" key={label}><b>{String(value).padStart(2, '0')}</b><small>{label}</small></span>)}
   </div></div>
  </div>
 </aside>;
}

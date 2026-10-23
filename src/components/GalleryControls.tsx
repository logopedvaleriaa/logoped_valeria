interface Props {
 count: number;
 current: number;
 onChange: (index: number) => void;
}
export default function GalleryControls({count, current, onChange}: Props) {
 if (count < 2) return null;
 const move = (step: number) => onChange((current + step + count) % count);
 return <div className="gallery-controls" role="group" aria-label="Просмотр скриншотов" onKeyDown={event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
   event.preventDefault();
   move(event.key === 'ArrowLeft' ? -1 : 1);
  }
 }}>
  <button type="button" className="gallery-arrow gallery-prev" onClick={() => move(-1)} aria-label="Предыдущий скриншот">‹</button>
  <button type="button" className="gallery-arrow gallery-next" onClick={() => move(1)} aria-label="Следующий скриншот">›</button>
  <span className="gallery-counter" role="status" aria-live="polite" aria-atomic="true">{current + 1} / {count}</span>
 </div>;
}

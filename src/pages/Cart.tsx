import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartProvider';
import { Cover } from '../components/ui';
import Seo from '../components/Seo';
import { materialFormatLabel } from '../utils/materialFormats';
import { telegramContact, vkContactUrl } from '../data/materials';
import { cartTotal, orderMessage, rubles, telegramDraft } from '../utils/cart';
export default function Cart({embedded=false,onClose}:{embedded?:boolean;onClose?:()=>void}={}) {
 const {items,remove,clear}=useCart();
 const [channel,setChannel]=useState<'telegram'|'vk'>('telegram');
 const [name,setName]=useState('');
 const [comment,setComment]=useState('');
 const [copied,setCopied]=useState('');
 const [vkCopyFailed,setVkCopyFailed]=useState(false);
 const message=orderMessage(items,name,comment);
 const url=telegramDraft(telegramContact,message);
 async function openVk(){
  if(!vkContactUrl)return;
  try{
   await navigator.clipboard.writeText(message);
   setVkCopyFailed(false);
   setCopied('Заявка скопирована. Вставьте её в сообщения сообщества и отправьте.');
   window.location.assign(vkContactUrl);
  }catch{
   setVkCopyFailed(true);
   setCopied('Браузер не разрешил копирование. Скопируйте текст вручную ниже и откройте ВК.');
  }
 }
 async function copy(){try{await navigator.clipboard.writeText(message);setCopied('Заявка скопирована. Вставьте её в чат и отправьте.');}catch{setCopied('Не удалось скопировать автоматически. Выделите и скопируйте текст заявки ниже.');}}
 return <div className={embedded?"cart-page cart-embedded":"container page section cart-page"}>{!embedded&&<Seo title="Корзина" description="Выбранные платные игры и оформление заявки через Telegram или ВКонтакте."/>}<h1 id={embedded?"cart-drawer-title":undefined}>Выбранные игры</h1>
 {items.length===0?<div className="cart-empty"><span aria-hidden="true">▱</span><h2>В корзине пока нет материалов</h2><p>Добавляйте платные игры кнопкой «В корзину». Каждый материал достаточно выбрать один раз.</p><p>Выберите платный материал в каталоге. Бесплатные игры запускаются или скачиваются без корзины.</p><Link className="button" onClick={onClose} to="/catalog">Перейти в каталог →</Link></div>:<div className="cart-layout"><section aria-label="Выбранные материалы"><div className="cart-list-head"><p role="status">Выбрано материалов: {items.length}</p><button className="reset" onClick={clear}>Очистить корзину</button></div><ul className="cart-list">{items.map(item=><li key={item.id}><Cover src={item.cover} alt=""/><div><Link onClick={onClose} to={`/materials/${item.slug}`}>{item.title}</Link><p>{materialFormatLabel(item)} · {item.sounds&&item.sounds.length>1?'Звуки':'Звук'} {item.sound}</p><strong>{rubles(item.price!)}</strong></div><button className="remove-item" onClick={()=>remove(item.id)} aria-label={`Удалить «${item.title}» из корзины`}>Удалить</button></li>)}</ul>{embedded?<button className="text-link continue-choice" onClick={onClose}>← Продолжить выбор</button>:<Link className="text-link" to="/catalog">← Продолжить выбор</Link>}</section>
 <section className="checkout" aria-labelledby={embedded?"drawer-checkout-title":"checkout-title"}><h2 id={embedded?"drawer-checkout-title":"checkout-title"}>Оформить заявку</h2><div className="cart-total"><span>Итого</span><strong>{rubles(cartTotal(items))}</strong></div><p className="checkout-note">Оплата после согласования с автором. Файлы и ссылки на платные игры передаются после подтверждения оплаты.</p>
 <fieldset className="order-channel"><legend>Где вам удобнее написать?</legend><div><label><input type="radio" name={embedded?'drawer-channel':'page-channel'} checked={channel==='telegram'} onChange={()=>{setChannel('telegram');setCopied('');setVkCopyFailed(false);}}/>Telegram</label><label><input type="radio" name={embedded?'drawer-channel':'page-channel'} checked={channel==='vk'} onChange={()=>{setChannel('vk');setCopied('');setVkCopyFailed(false);}}/>ВКонтакте</label></div></fieldset>
 <label>Ваше имя<input placeholder="Как к вам обращаться" autoComplete="given-name" maxLength={80} value={name} onChange={e=>setName(e.target.value)}/></label><label>Комментарий<textarea className="order-comment" maxLength={500} rows={2} placeholder="Например, вопрос о версии PowerPoint" value={comment} onChange={e=>setComment(e.target.value)}/></label>
 <div className="order-channel-action" aria-live="polite">{channel==='telegram'?(url?<><a className="button checkout-button" href={url} target="_blank" rel="noopener noreferrer">Перейти в Telegram с заявкой ↗</a><p className="checkout-note">Откроется чат с @{telegramContact}. Для оформления <strong>нажмите «Отправить» в Telegram</strong>.</p></>:<p className="checkout-note">Связь через Telegram пока не настроена.</p>):(vkContactUrl?<><button type="button" className="button checkout-button" onClick={openVk}>Скопировать заявку и открыть ВК ↗</button><p className="checkout-note">Текст скопируется перед переходом. В сообщениях сообщества <strong>вставьте заявку и нажмите «Отправить»</strong>.</p>{vkCopyFailed&&<div className="vk-manual-copy"><label>Текст заявки<textarea readOnly rows={8} value={message} onFocus={event=>event.currentTarget.select()}/></label><a className="text-link" href={vkContactUrl} target="_blank" rel="noopener noreferrer">Открыть сообщения ВК ↗</a></div>}</>:<p className="checkout-note channel-pending">Связь через ВК пока не настроена. Можно оформить заявку через Telegram.</p>)}</div>
 <button className="copy-order" onClick={copy}>Скопировать текст заявки</button><p role="status" className="copy-status">{copied}</p><details className="order-preview"><summary>Посмотреть текст заявки</summary><pre>{message}</pre></details><p className="checkout-note">Сайт сам не отправляет заявку. Корзина сохраняется, пока вы её не очистите.</p>
 </section></div>}
 </div>;
}

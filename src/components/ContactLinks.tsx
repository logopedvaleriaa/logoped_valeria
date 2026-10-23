import { telegramContact, vkContactUrl } from '../data/materials';
export default function ContactLinks(){
 if(!telegramContact&&!vkContactUrl)return <p>Контакты для связи скоро появятся.</p>;
 return <div className="contact-links">
  {telegramContact&&<a className="button" href={`https://t.me/${telegramContact}`} target="_blank" rel="noopener noreferrer">Написать в Telegram ↗</a>}
  {vkContactUrl&&<a className="button vk-button" href={vkContactUrl} target="_blank" rel="noopener noreferrer">Написать в ВК ↗</a>}
 </div>;
}

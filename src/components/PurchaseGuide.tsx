import { Link } from 'react-router-dom';
import ContactLinks from './ContactLinks';
const steps = [
  ['01', 'Выберите материалы', 'Добавьте нужные игры в корзину.'],
  ['02', 'Отправьте заявку', 'Отправьте заявку из корзины в Telegram или ВКонтакте и согласуйте оплату.'],
  ['03', 'Получите игры', 'После оплаты я пришлю файлы или ссылки в чате.'],
];
export default function PurchaseGuide({ full = false }: { full?: boolean }) {
  return <section className={`purchase-guide ${full ? '' : 'container section'}`} aria-labelledby="purchase-heading">
    {!full && <div className="section-heading"><h2 id="purchase-heading">Как купить игру</h2><Link className="text-link" to="/how-to-buy">Подробнее ↗</Link></div>}
    <p className="guide-intro">Создаю логопедические игры на заказ — под ваши темы и задачи. Обсудить идею можно в Telegram или ВК.</p>
    <ol className="purchase-steps">{steps.map(([number, title, text]) => <li key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    <div className="purchase-note"><span aria-hidden="true">✧</span><div><strong>Бесплатные материалы — без заявки</strong><p>Откройте карточку и нажмите «Играть» или «Скачать».</p></div></div>
    {full && <><section className="faq-section" aria-labelledby="faq-title"><h2 id="faq-title">Вопросы и ответы</h2>
      {[
        ['Как получить бесплатный материал?', 'Откройте карточку и нажмите «Скачать», а у браузерной игры — «Играть». Заявка не нужна.'],
        ['Как оплатить покупку?', 'Напишите мне в Telegram или ВК. Стоимость и способ оплаты согласуем в переписке.'],
        ['Что я получу после оплаты?', 'Файл или ссылку на выбранный материал. Способ и срок передачи уточним перед оплатой.'],
        ['Какой формат выбрать?', '3D- и HTML-игры открываются в браузере. Для PPTX нужен PowerPoint. PDF можно открыть на экране или распечатать.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
    </section><div className="purchase-contact"><p>Есть вопрос? Напишите мне:</p><ContactLinks/></div></>}
  </section>;
}

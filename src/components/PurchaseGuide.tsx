import { Link } from 'react-router-dom';
import { telegramContact } from '../data/materials';
import { SectionTitle } from './ui';
const steps = [
  ['01', 'Выберите свою историю', 'Найдите игру в каталоге. На странице материала посмотрите описание, возраст, формат и речевые задачи.'],
  ['02', 'Напишите мне в Telegram', 'Откройте платный материал и нажмите «Купить». В сообщении укажите название игры — обсудим стоимость и способ оплаты.'],
  ['03', 'Получите материал', 'После подтверждения оплаты я отправлю файл или ссылку на игру в личной переписке. Можно начинать занятие!'],
];
export default function PurchaseGuide({ full = false }: { full?: boolean }) {
  return <section className={`purchase-guide ${full ? '' : 'container section'}`} aria-labelledby="purchase-heading">
    <SectionTitle kicker="ПОНЯТНО И ПО-ЧЕЛОВЕЧЕСКИ" title="Как купить игру">
      {!full && <Link className="text-link" to="/how-to-buy">Подробнее о покупке ↗</Link>}
    </SectionTitle>
    <p id="purchase-heading" className="guide-intro">От первого интереса до нового занятия — всего три шага.</p>
    <ol className="purchase-steps">{steps.map(([number, title, text]) => <li key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    <div className="purchase-note"><span aria-hidden="true">✧</span><div><strong>{telegramContact ? 'Общаемся лично' : 'Библиотека готовится к открытию'}</strong><p>{telegramContact ? 'Покупка оформляется в переписке с автором. Условия оплаты и получения уточняем перед оплатой.' : 'Сейчас в каталоге демопримеры. Покупки станут доступны после добавления реальных материалов, цен и Telegram-контакта.'}</p></div></div>
    {full && <><section className="faq-section" aria-labelledby="faq-title"><p className="eyebrow">ПЕРЕД ПЕРВЫМ ЗАНЯТИЕМ</p><h2 id="faq-title">Вопросы и <em>ответы</em></h2>
      {[
        ['Как получить бесплатный материал?', 'Откройте его страницу в каталоге. Если файл уже добавлен, появится кнопка «Скачать», а у браузерной игры — «Играть». У демопримеров пока нет файлов и игровых ссылок.'],
        ['Как оплатить покупку?', 'Сначала напишите автору в Telegram. Стоимость, доступность и способ оплаты подтверждаются в переписке до покупки. Онлайн-оплаты на сайте нет.'],
        ['Что я получу после оплаты?', 'Файл или ссылку на выбранный материал — в зависимости от его формата. Способ и срок передачи уточняем перед оплатой.'],
        ['Какой формат выбрать?', '3D- и HTML-игры запускаются по ссылке в браузере. Для PPTX понадобится совместимая версия PowerPoint; требования конкретного материала уточняйте перед покупкой. PDF можно открыть на устройстве или распечатать.'],
        ['Можно ли попробовать игру перед покупкой?', 'Если для материала предусмотрена пробная версия, ссылка будет на его странице. Обложки с отметкой «Демо» сейчас показывают примеры оформления каталога, а не доступную пробную игру.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
    </section><div className="purchase-contact"><div><p className="eyebrow">ПОМОГУ С ВЫБОРОМ</p><h2>Остались вопросы?</h2><p>Обсудим, какой материал подойдёт для вашего занятия.</p></div>{telegramContact ? <a className="button" href={`https://t.me/${telegramContact}`} target="_blank" rel="noopener noreferrer">Написать в Telegram ↗</a> : <p className="contact-pending">Telegram-контакт скоро появится.<br/>Заказы пока не принимаются.</p>}</div></>}
  </section>;
}

import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PurchaseGuide from '../components/PurchaseGuide';
export default function HowToBuy() {
  return <div className="container page section"><Seo title="Как купить игру" description="Как выбрать и заказать авторские логопедические игры Валерии Выстороп через Telegram. Форматы материалов, получение и ответы на вопросы."/><Link className="back-link" to="/catalog">← Выбрать материал</Link><p className="eyebrow">ОТ ВЫБОРА ДО ЗАНЯТИЯ</p><h1>Новая игра —<br/><em>новая история.</em></h1><p className="page-intro">Здесь всё о покупке, получении и форматах материалов.</p><PurchaseGuide full/></div>;
}

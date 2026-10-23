import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PurchaseGuide from '../components/PurchaseGuide';
export default function HowToBuy() {
  return <div className="container page section"><Seo title="Как купить игру" description="Добавьте материалы в корзину, отправьте заявку в Telegram или ВКонтакте и получите игры после оплаты. Бесплатные материалы доступны без заявки."/><Link className="back-link" to="/catalog">← Выбрать материал</Link><h1 id="purchase-heading">Как купить игру</h1><PurchaseGuide full/></div>;
}

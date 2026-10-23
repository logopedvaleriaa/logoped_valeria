import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import BookLogo from './components/BookLogo';
import Catalog from './pages/Catalog';
import CartSummary from './components/CartSummary';
import CartDrawer from './components/CartDrawer';
import CartProvider, { useCart } from './components/CartProvider';
import MaterialDialogProvider from './components/MaterialDialog';

import Cart from './pages/Cart';
function CartLink(){const {items,setDrawerOpen}=useCart();return <button className="cart-nav" onClick={()=>setDrawerOpen(true)}>Корзина <span aria-label={`Материалов: ${items.length}`}>{items.length}</span></button>;}
const Detail=lazy(()=>import('./pages/Detail'));
const About=lazy(()=>import('./pages/About'));
const HowToBuy=lazy(()=>import('./pages/HowToBuy'));
function RouteEffects(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0);},[pathname]);return null;}
function AppLayout(){const [open,setOpen]=useState(false);const location=useLocation();useEffect(()=>setOpen(false),[location]);return <MaterialDialogProvider><a className="skip-link" href="#main">К содержимому</a><header className="header"><div className="container header-inner"><Link className="brand" to="/"><span className="brand-icon" aria-hidden="true"><BookLogo/></span><span>Валерия Выстороп<small>ЛОГОПЕД · АВТОР МАТЕРИАЛОВ</small></span></Link><button className="menu-toggle" aria-expanded={open} aria-controls="navigation" onClick={()=>setOpen(!open)}>{open?'Закрыть ✕':'Меню ☰'}</button><nav id="navigation" className={open?'navigation open':'navigation'} aria-label="Основная навигация"><NavLink to="/" end>Каталог игр</NavLink><NavLink to="/how-to-buy">Как купить</NavLink><NavLink to="/about">Об авторе</NavLink><CartLink/></nav></div></header><RouteEffects/><main id="main"><Suspense fallback={<div className="container loading" role="status">Загружаем библиотеку…</div>}><Routes><Route path="/" element={<Home/>}/><Route path="/catalog" element={<Catalog/>}/><Route path="/cart" element={<Cart/>}/><Route path="/materials/:slug" element={<Detail/>}/><Route path="/about" element={<About/>}/><Route path="/how-to-buy" element={<HowToBuy/>}/><Route path="*" element={<div className="container empty"><h1>Страница не найдена</h1><Link className="button" to="/catalog">Вернуться в каталог ↗</Link></div>}/></Routes></Suspense></main><CartSummary/><CartDrawer/><footer><div className="container footer-top"><Link className="brand" to="/">Валерия Выстороп<small>ЛОГОПЕД · КАТАЛОГ ИГР</small></Link><div className="footer-links"><Link to="/how-to-buy">Как купить</Link><Link to="/catalog?cost=free">Бесплатные материалы</Link><Link to="/about#contacts">Контакты ↗</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Валерия Выстороп</span><span>Авторские логопедические материалы</span></div></footer></MaterialDialogProvider>}

export default function App(){return <CartProvider><AppLayout/></CartProvider>;}

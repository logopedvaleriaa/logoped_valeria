import test from 'node:test';
import assert from 'node:assert/strict';
import { canOrder, resolveCart, cartTotal, orderMessage, telegramDraft, rubles } from '../src/utils/cart.ts';
// Test fixtures only: these prices and materials are never part of the public catalog.
const paid={id:'test-ppt',title:'Тест «Р» & Л',format:'PPTX',price:125.5,isDemo:false,isFree:false};
const second={...paid,id:'test-pdf',title:'Тест PDF',format:'PDF',price:200};
test('only real paid materials with valid positive prices can enter the cart',()=>{
 assert.equal(canOrder(paid),true);
 for(const patch of [{isDemo:true},{isFree:true},{price:null},{price:0},{price:-1},{price:NaN},{price:Infinity}])assert.equal(canOrder({...paid,...patch}),false);
});
test('stored basket discards duplicates, missing games, demos and malformed data',()=>{
 const demo={...paid,id:'demo',isDemo:true};
 const catalog=[paid,second,demo];
 assert.deepEqual(resolveCart(['test-ppt','test-ppt','removed','demo',null,12],catalog),[paid]);
 for(const value of [null,{},'test-ppt',42])assert.deepEqual(resolveCart(value,catalog),[]);
 assert.deepEqual(resolveCart(['test-ppt'],[{...paid,isFree:true}]),[]);
});
test('basket reload uses current catalog prices and calculates total without float errors',()=>{
 const updated={...paid,price:150};
 assert.equal(resolveCart(['test-ppt'],[updated])[0].price,150);
 assert.equal(cartTotal([paid,second]),325.5);
 assert.equal(cartTotal([{price:0.1},{price:0.2}]),0.3);
 assert.equal(cartTotal([]),0);
});
test('Telegram draft has exact recipient, game names, amount and optional text',()=>{
 const text=orderMessage([paid,second],'  Анна  ',' Вопрос & спасибо! ');
 assert.ok(text.includes('Имя: Анна'));
 assert.ok(!text.includes('Кто я:'));
 assert.ok(!text.includes('Контакт:'));
 assert.ok(text.includes(paid.title));
 assert.ok(text.includes('Материалов: 2'));
 assert.ok(text.includes('325,50'));
 assert.ok(text.includes('Вопрос & спасибо!'));
 const url=new URL(telegramDraft('@llerrrrrrra',text));
 assert.equal(url.pathname,'/llerrrrrrra');
 assert.equal(url.searchParams.get('text'),text);
 assert.equal(telegramDraft(null,text),null);
 assert.ok(!orderMessage([paid],'','').includes('Комментарий:'));
});

test('whole ruble prices omit decimal zeros, fractional prices preserve kopecks',()=>{
 assert.equal(rubles(500).replace(/\s/g,' '),'500 ₽');
 assert.equal(rubles(1000).replace(/\s/g,' '),'1 000 ₽');
 assert.ok(rubles(125.5).includes('125,50'));
});

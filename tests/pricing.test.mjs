import test from 'node:test';
import assert from 'node:assert/strict';
import { materials } from '../src/data/materials.ts';
import { isPromotionActive, materialPrice, promotionStartsAt, promotionEndsAt, promotionTimeLeft } from '../src/utils/pricing.ts';
import { resolveCart, cartTotal, cartOriginalTotal, orderMessage, telegramDraft } from '../src/utils/cart.ts';
const during=Date.parse('2026-11-15T12:00:00+03:00');
const paid=materials.filter(m=>!m.isFree);

test('25% promotion applies to every real paid material and preserves base prices and free materials',()=>{
 assert.equal(paid.length,8);
 for(const item of paid){
  const base=item.price;
  assert.equal(materialPrice(item,during),new Map([[500,375],[300,225],[200,150]]).get(base));
  assert.equal(item.price,base);
 }
 for(const item of materials.filter(m=>m.isFree))assert.equal(materialPrice(item,during),0);
 const item=paid[0];
 assert.equal(materialPrice({...item,isDemo:true},during),item.price);
 for(const price of [null,NaN,Infinity])assert.equal(materialPrice({...item,price},during),null);
 assert.equal(materialPrice({...item,price:125.5},during),94.13);
});

test('Moscow deadline includes the entire 23:59 minute on November 15 and never restarts',()=>{
 assert.equal(isPromotionActive(promotionStartsAt-1),false);
 assert.equal(isPromotionActive(promotionStartsAt),true);
 assert.equal(isPromotionActive(Date.parse('2026-11-15T00:00:00+03:00')),true);
 assert.equal(isPromotionActive(Date.parse('2026-11-15T23:59:59.999+03:00')),true);
 assert.equal(promotionEndsAt,Date.parse('2026-11-15T21:00:00Z'));
 assert.equal(isPromotionActive(promotionEndsAt),false);
 assert.equal(isPromotionActive(promotionEndsAt+86400000),false);
 for(const item of paid){
  assert.equal(materialPrice(item,promotionStartsAt-1),item.price);
  assert.equal(materialPrice(item,promotionEndsAt),item.price);
 }
});

test('restored baskets use discounted totals once per bundle and recover normal prices at expiry',()=>{
 const bundle=paid.find(m=>m.slug==='flashlight');
 const restored=resolveCart([bundle.id,bundle.id],materials);
 assert.equal(restored.length,1);
 assert.equal(cartTotal(restored,during),225);
 assert.equal(cartTotal(restored,promotionEndsAt),300);
 assert.equal(cartOriginalTotal(paid),2300);
 assert.equal(cartTotal(paid,during),1725);
 assert.equal(cartTotal(paid,promotionEndsAt),2300);
});

test('Telegram and VK draft text use matching discounted line items and total, then remove the offer at expiry',()=>{
 const items=paid.filter(m=>['articulation-memory','volshebnaya-strana'].includes(m.slug));
 const message=orderMessage(items,'Анна','',during);
 assert.match(message,/Открой волшебство \(HTML\) — 225/);
 assert.match(message,/Волшебная страна \(3D\) — 375/);
 assert.match(message,/Итого по каталогу: 600/);
 assert.match(message,/−25%/);
 assert.equal(new URL(telegramDraft('llerrrrrrra',message)).searchParams.get('text'),message);
 const expired=orderMessage(items,'Анна','',promotionEndsAt);
 assert.match(expired,/Итого по каталогу: 800/);
 assert.ok(!expired.includes('−25%'));
});

test('countdown uses the fixed deadline and clamps to zero',()=>{
 assert.deepEqual(promotionTimeLeft(promotionEndsAt-90061000),{days:1,hours:1,minutes:1,seconds:1});
 assert.deepEqual(promotionTimeLeft(promotionEndsAt),{days:0,hours:0,minutes:0,seconds:0});
 assert.deepEqual(promotionTimeLeft(promotionEndsAt+1000),{days:0,hours:0,minutes:0,seconds:0});
});

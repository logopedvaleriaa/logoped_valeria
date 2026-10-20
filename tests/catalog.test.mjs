import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { materials } from '../src/data/materials.ts';
import { filterMaterials } from '../src/data/filterMaterials.ts';
const filter=query=>filterMaterials(materials,new URLSearchParams(query));
test('search ignores case and whitespace',()=>assert.equal(filter('q= ЛЕСНЫЕ ')[0].slug,'forest-adventure'));
test('combined filters and empty results',()=>{
 assert.deepEqual(filter('sound=Р&format=PPTX&age=6–7&cost=paid').map(m=>m.slug),['treasure-island']);
 assert.equal(filter('sound=Л&format=PDF').length,0);
});
test('free, paid, reset and alphabetical order',()=>{
 assert.equal(filter('cost=free').length,3);
 assert.equal(filter('cost=paid').length,3);
 assert.equal(filter('').length,6);
 const titles=filter('sort=title').map(m=>m.title);
 assert.deepEqual(titles,[...titles].sort((a,b)=>a.localeCompare(b,'ru')));
});
test('demo catalog has unique URLs, local covers and no invented commerce',()=>{
 assert.equal(new Set(materials.map(m=>m.slug)).size,6);
 for(const m of materials){
  assert.ok(existsSync(`public/${m.cover}`));
  assert.ok(readFileSync(`public/${m.cover}`,'utf8').includes('<svg'));
  assert.equal(m.isDemo,true);
  for(const field of ['price','playUrl','downloadUrl','telegramOrderUrl']) assert.equal(m[field],null);
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { materials } from '../src/data/materials.ts';
import { filterMaterials, uniqueMaterialCount } from '../src/data/filterMaterials.ts';
const filter=query=>filterMaterials(materials,new URLSearchParams(query));
test('search ignores case and whitespace',()=>assert.equal(filter('q= ДЕРЕВНЯ ')[0].slug,'derevnya-r'));
test('combined filters and empty results',()=>{
 assert.deepEqual(filter('sound=Л&format=3D&cost=paid').map(m=>m.slug),['volshebnaya-strana']);
 assert.equal(filter('sound=З&format=PDF&cost=free').length,0);
});
test('free, paid, reset and alphabetical order',()=>{
 assert.equal(filter('cost=free').length,14);
 assert.equal(filter('cost=paid').length,7);
 assert.equal(filter('').length,21);
 const titles=filter('sort=title').map(m=>m.title);
 assert.deepEqual(titles,[...titles].sort((a,b)=>a.localeCompare(b,'ru')));
});
test('catalog contains only real materials with unique URLs and existing local assets',()=>{
 assert.equal(new Set(materials.map(m=>m.slug)).size,materials.length);
 for(const m of materials){
  assert.ok(existsSync(`public/${m.cover}`));
  if(m.cover.endsWith('.svg')) assert.ok(readFileSync(`public/${m.cover}`,'utf8').includes('<svg'));
  for(const screenshot of m.screenshots) assert.ok(existsSync(`public/${screenshot}`));
  assert.equal(m.isDemo,false);
  if(m.isFree){
   assert.equal(m.price,0);
   assert.ok(m.playUrl||m.downloadUrl);
  }
  if(m.downloadUrl) assert.ok(existsSync('public/'+m.downloadUrl.replace(/^\.\//,'')));
 }
});

test('published free game is playable and found by its filters',()=>{
 const real=filter('sound=Р&format=3D&cost=free');
 assert.equal(real.length,1);
 assert.equal(real[0].slug,'derevnya-r');
 assert.equal(real[0].title,'Деревня');
 assert.equal(real[0].subtitle,'Звук Р в словах/словосочетаниях/предложениях');
 assert.equal(real[0].isDemo,false);
 assert.equal(real[0].playUrl,'https://logopedvaleriaa.github.io/derevnya_R/');
 assert.equal(real[0].price,0);
 assert.equal(real[0].age,null);
 assert.ok(!real[0].topics?.includes('articulation'));
 assert.equal(real[0].screenshots.length,4);
 assert.ok(real[0].cover.endsWith('derevnya-village.png'));
});

test('paid Magic Land is orderable and exposes no play or download URL', async()=>{
 const {canOrder,orderMessage,resolveCart}=await import('../src/utils/cart.ts');
 const item=materials.find(m=>m.slug==='volshebnaya-strana');
 assert.equal(item.price,500);
 assert.equal(item.isNew,true);
 assert.equal(item.screenshots.length,6);
 assert.ok(item.cover.endsWith('/world.png'));
 assert.equal(item.isDemo,false);
 assert.equal(item.sound,'Л');
 assert.equal(item.playUrl,null);
 assert.equal(item.downloadUrl,null);
 assert.ok(!item.topics?.includes('articulation'));
 assert.equal(canOrder(item),true);
 assert.deepEqual(resolveCart([item.id],materials),[item]);
 assert.ok(orderMessage([item],'','').includes('Волшебная страна'));
});

test('browser section combines 3D and HTML while preserving card formats', async()=>{
 const {catalogSections,belongsToSection}=await import('../src/data/sections.ts');
 const section=catalogSections.find(s=>s.format==='browser');
 assert.ok(section);
 assert.deepEqual(new Set(filter('format=browser').map(m=>m.slug)),new Set(['derevnya-r','volshebnaya-strana','flashlight','connect-four']));
 assert.deepEqual(filter('format=browser&cost=paid&sound=Л').map(m=>m.slug),['volshebnaya-strana','flashlight']);
 assert.equal(filter('format=browser&cost=free').length,2);
 assert.ok(filter('format=browser').every(m=>belongsToSection(m,section)));
 assert.equal(materials.find(m=>m.slug==='derevnya-r').format,'3D');
 const html={...materials[0],id:'test-html',slug:'test-html',format:'HTML'};
 assert.ok(belongsToSection(html,section));
 assert.deepEqual(filterMaterials([html],new URLSearchParams('format=browser')),[html]);
 assert.equal(uniqueMaterialCount(catalogSections.map(s=>materials.filter(m=>belongsToSection(m,s)))),materials.length);
});

test('new releases show only marked real materials and respect other filters',()=>{
 assert.deepEqual(filter('new=1').map(m=>m.slug),['volshebnaya-strana']);
 assert.equal(filter('new=1&cost=free').length,0);
 assert.equal(filter('new=1&format=browser&sound=Л').length,1);
 const demo={...materials[0],isDemo:true,isNew:true};
 assert.deepEqual(filterMaterials([demo],new URLSearchParams('new=1')),[]);
});

test('universal games form an explicit collection without reclassifying existing games', async()=>{
 const {catalogTopics,matchesCatalogTopic}=await import('../src/data/sections.ts');
 assert.ok(catalogTopics.some(topic=>topic.id==='universal'));
 assert.deepEqual(materials.filter(item=>matchesCatalogTopic(item,'universal')).map(item=>item.slug),['connect-four','pizzeria-universal','underwater-world-universal','flower-workshop-universal']);
 const universal={...materials[0],topics:['universal']};
 assert.ok(matchesCatalogTopic(universal,'universal'));
 assert.ok(!matchesCatalogTopic(universal,'articulation'));
 assert.equal(universal.format,'3D');
 assert.ok(matchesCatalogTopic(materials.find(m=>m.slug==='volshebnaya-strana'),'new'));
});

test('free Minecraft presentation belongs to articulation and offers an existing download', async()=>{
 const {matchesCatalogTopic}=await import('../src/data/sections.ts');
 const {canOrder}=await import('../src/utils/cart.ts');
 const item=materials.find(m=>m.slug==='articulation-minecraft');
 assert.equal(item.title,'Майнкрафт');
 assert.equal(item.format,'PPTX');
 assert.equal(item.price,0);
 assert.equal(item.isFree,true);
 assert.equal(item.isDemo,false);
 assert.ok(matchesCatalogTopic(item,'articulation'));
 assert.equal(canOrder(item),false);
 assert.equal(item.playUrl,null);
 assert.ok(item.instructions.includes('PowerPoint'));
 const path='public/'+item.downloadUrl.replace(/^\.\//,'');
 assert.ok(existsSync(path));
 assert.equal(readFileSync(path).subarray(0,2).toString(),'PK');
});

test('Help Bunny is a free articulation presentation with a gallery and downloadable file', async()=>{
 const {matchesCatalogTopic}=await import('../src/data/sections.ts');
 const {canOrder}=await import('../src/utils/cart.ts');
 const item=materials.find(m=>m.slug==='articulation-help-bunny');
 assert.equal(item.title,'Помоги зайке');
 assert.equal(item.format,'PPTX');
 assert.equal(item.isFree,true);
 assert.equal(item.isDemo,false);
 assert.equal(item.price,0);
 assert.equal(item.screenshots.length,2);
 assert.ok(matchesCatalogTopic(item,'articulation'));
 assert.equal(canOrder(item),false);
 assert.equal(item.playUrl,null);
 assert.ok(item.instructions.includes('PowerPoint'));
 assert.equal(readFileSync('public/'+item.downloadUrl.replace(/^\.\//,'')).subarray(0,2).toString(),'PK');
});


test('a material with several sounds matches each sound without duplicating catalog entries', async()=>{
 const {materialSounds}=await import('../src/data/filterMaterials.ts');
 const item=materials.find(m=>m.slug==='wimmelbuch-s-sh-l-r');
 const images=[item.cover,...item.screenshots];
 assert.equal(images.length,4);
 assert.equal(new Set(images).size,4);
 assert.deepEqual(materialSounds(item),['С','Ш','Л','Р']);
 for(const sound of materialSounds(item)){
  const results=filter(`sound=${sound}&format=PDF&cost=free`);
  assert.equal(results.filter(m=>m.id===item.id).length,1);
 }
 assert.equal(filter('sound=З&format=PDF').some(m=>m.id===item.id),false);
 assert.equal(readFileSync('public/'+item.downloadUrl.replace(/^\.\//,'')).subarray(0,5).toString(),'%PDF-');
});


test('a browser and print bundle appears in both sections but is ordered once for one price', async()=>{
 const {catalogSections,belongsToSection}=await import('../src/data/sections.ts');
 const {materialFormats,materialFormatLabel}=await import('../src/utils/materialFormats.ts');
 const {resolveCart,cartTotal,orderMessage}=await import('../src/utils/cart.ts');
 const item=materials.find(m=>m.slug==='flashlight');
 assert.deepEqual(materialFormats(item),['HTML','PDF']);
 assert.equal(materialFormatLabel(item),'HTML + PDF');
 for(const format of ['browser','PDF']){
  assert.deepEqual(filter(`format=${format}&cost=paid&sound=З`),[item]);
  assert.ok(belongsToSection(item,catalogSections.find(s=>s.format===format)));
 }
 assert.equal(uniqueMaterialCount([[item],[item]]),1);
 assert.equal(uniqueMaterialCount(catalogSections.map(s=>filter(`format=${s.format}`))),materials.length);
 const basket=resolveCart([item.id,item.id],materials);
 assert.equal(basket.length,1);
 assert.equal(cartTotal(basket),300);
 const message=orderMessage(basket,'','');
 assert.ok(message.includes('Фонарик (HTML + PDF)'));
 assert.ok(message.includes('Материалов: 1'));
 assert.equal(item.playUrl,null);
 assert.equal(item.downloadUrl,null);
});

(()=>{
'use strict';
const SAVE_KEY='kedaiku-parttimer-v1';
const GOAL=250000,SHIFT_SECONDS=120,SHIFT_PAY=120;
const FIXTURES=[
 ['rak','Fruit & Veg Rack','🥬','#70a75e',1800,'Buah dan sayur segar'],['rak','Fresh Herbs Rack','🌿','#67a86c',1500,'Herba segar'],['sejuk','Chiller Fridge (Drinks)','🧃','#5fa4c2',3800,'Minuman sejuk'],['sejuk','Chiller Fridge (Dairy)','🥛','#78b8cf',3800,'Produk tenusu'],['sejuk','Freezer (Ice Cream)','🍦','#6a9ed0',3100,'Aiskrim'],
 ['sejuk','Freezer (Frozen Food)','❄️','#86c3ca',3400,'Makanan beku'],['rak','Snack Rack','🍿','#d98362',1100,'Snek'],['rak','Confectionery Rack','🍫','#d78aa0',1100,'Manisan'],['rak','Dry Groceries Rack','🥫','#c9905c',1250,'Barangan kering'],['rak','Instant Food Rack','🍜','#e09a55',1200,'Makanan segera'],
 ['rak','Rice & Flour Rack','🌾','#d5ae7c',1300,'Beras dan tepung'],['rak','Beverage Rack','🥤','#62a8c6',1350,'Minuman botol'],['rak','Water & Soft Drink Rack','💧','#69a8d1',1450,'Air dan minuman ringan'],['display','Bakery Display','🥖','#bd8458',1800,'Roti dan pastri'],['display','Deli / Hot Food Counter','🍱','#d39755',2200,'Makanan panas'],
 ['sejuk','Meat Display Chiller','🥩','#c66e72',3500,'Daging segar'],['sejuk','Seafood Display Chiller','🐟','#72a7c4',3500,'Makanan laut'],['rak','Household Rack','🧻','#7ba68e',1250,'Barangan rumah'],['rak','Cleaning Supplies Rack','🧴','#5fa88a',1350,'Produk pembersihan'],['rak','Personal Care Rack','🧼','#d9a4c7',1350,'Penjagaan diri'],
 ['rak','Beauty & Cosmetics Rack','💄','#d78aa0',1500,'Kecantikan'],['rak','Health & Medicine Rack','🩹','#6a9ed0',1600,'Kesihatan'],['rak','Baby Products Rack','🍼','#83bdd0',1450,'Produk bayi'],['rak','Pet Supplies Rack','🐾','#d39755',1400,'Keperluan haiwan'],['display','Home & Lifestyle Rack','🌸','#70a75e',1700,'Pokok dan dekorasi'],
 ['display','Promo Rack','🏷️','#e1b34f',900,'Barang promosi'],['display','Magazine & Stationery Rack','📰','#708c9c',1000,'Majalah dan alat tulis'],['mesin','Storage Rack (Backroom)','📦','#6f7780',1900,'Rak stor belakang'],['mesin','Boxes & Pallets','📦','#a97854',800,'Kotak penghantaran'],['mesin','Staff Lockers','🗄️','#7188a1',2200,'Loker pekerja']
].map(([category,name,icon,color,price,desc],index)=>({id:index+1,category,name,icon,color,price,desc}));
const EQUIPMENT_ASSETS=[
 '01-fruit-veg-rack.png','02-fresh-herbs-rack.png','03-drinks-chiller.png','04-dairy-chiller.png','05-ice-cream-freezer.png',
 '06-frozen-food-freezer.png','07-snack-rack.png','08-confectionery-rack.png','09-dry-groceries-rack.png','10-instant-food-rack.png',
 '11-rice-flour-rack.png','12-beverage-rack.png','13-water-soft-drink-rack.png','14-bakery-display.png','15-deli-hot-food-counter.png',
 '16-meat-display-chiller.png','17-seafood-display-chiller.png','18-household-rack.png','19-cleaning-supplies-rack.png','20-personal-care-rack.png',
 '21-beauty-cosmetics-rack.png','22-health-medicine-rack.png','23-baby-products-rack.png','24-pet-supplies-rack.png','25-home-lifestyle-rack.png',
 '26-promo-rack.png','27-magazine-stationery-rack.png','28-backroom-storage-rack.png','29-boxes-pallets.png','30-staff-lockers.png'
];
const STOCK_META=[
 {id:'produce',name:'Buah & Sayur',items:[['Epal',24,20,20],['Sayur Pek',24,21,26]]},{id:'herbs',name:'Herba Segar',items:[['Daun Herba',18,15,18],['Cili Segar',18,16,16]]},
 {id:'drink',name:'Chiller Minuman',items:[['Air Mineral',18,18,32],['Air Gas',30,30,2]]},{id:'dairy',name:'Peti Ais Tenusu',items:[['Susu Segar',18,16,24],['Yogurt',16,14,18]]},
 {id:'icecream',name:'Freezer Aiskrim',items:[['Aiskrim',18,15,24],['Aiskrim Kon',16,13,18]]},{id:'frozen',name:'Freezer Makanan Beku',items:[['Nugget',20,18,20],['Kentang Beku',18,15,20]]},
 {id:'snack',name:'Rak Snek',items:[['Biskut',24,20,18],['Kerepek',20,17,22]]},{id:'confectionery',name:'Rak Manisan',items:[['Coklat',18,15,26],['Gula-gula',24,21,20]]},
 {id:'groceries',name:'Barangan Kering',items:[['Makanan Tin',20,17,24],['Sos',18,15,18]]},{id:'instant',name:'Makanan Segera',items:[['Mi Segera',24,19,36],['Bubur Segera',18,15,20]]},
 {id:'rice',name:'Beras & Tepung',items:[['Beras',16,14,18],['Tepung',18,16,20]]},{id:'beverage',name:'Rak Minuman',items:[['Jus Buah',18,15,22],['Minuman Isotonik',20,18,20]]},
 {id:'water',name:'Air & Minuman Ringan',items:[['Air Kotak',24,21,24],['Air Soda',24,20,20]]},{id:'bakery',name:'Bakery',items:[['Roti',16,14,20],['Pastri',18,15,18]]},
 {id:'deli',name:'Deli & Makanan Panas',items:[['Nasi Bungkus',16,13,16],['Ayam Panggang',12,10,12]]},{id:'meat',name:'Daging Segar',items:[['Daging',16,14,18],['Ayam',18,16,20]]},
 {id:'seafood',name:'Makanan Laut',items:[['Ikan',16,14,18],['Udang',14,12,16]]},{id:'home',name:'Barangan Rumah',items:[['Tisu',20,18,28],['Plastik Sampah',18,15,20]]},
 {id:'cleaning',name:'Produk Pembersihan',items:[['Sabun Baju',15,13,18],['Pencuci Lantai',16,14,18]]},{id:'care',name:'Penjagaan Diri',items:[['Syampu',12,11,16],['Ubat Gigi',18,16,22]]},
 {id:'beauty',name:'Kecantikan',items:[['Pencuci Muka',16,14,18],['Losyen',16,13,18]]},{id:'health',name:'Kesihatan',items:[['Vitamin',18,16,20],['Plaster Luka',20,18,20]]},
 {id:'baby',name:'Keperluan Bayi',items:[['Lampin Bayi',16,14,18],['Susu Bayi',14,12,16]]},{id:'pet',name:'Keperluan Haiwan',items:[['Makanan Kucing',18,16,20],['Pasir Kucing',14,12,16]]},
 {id:'lifestyle',name:'Rumah & Lifestyle',items:[['Pokok Hiasan',12,10,14],['Pasu Kecil',14,12,16]]},{id:'promo',name:'Rak Promosi',items:[['Pek Kombo',18,15,22],['Barang Diskaun',20,17,24]]},
 {id:'magazine',name:'Majalah & Alat Tulis',items:[['Majalah',18,15,20],['Buku Nota',20,18,22]]}
];
const fullStock=()=>Object.fromEntries(STOCK_META.map(station=>[station.id,station.items.map(([name,capacity,shelf,store])=>({name,capacity,shelf,store}))]));
const ORDER_META={
 'Biskut':[12,24],'Coklat':[12,30],'Air Mineral':[18,27],'Air Gas':[24,48],'Mi Segera':[18,36],'Minyak Masak':[8,40],
 'Roti':[12,24],'Bijirin':[12,36],'Sabun Baju':[10,40],'Tisu':[16,32],'Syampu':[8,40],'Ubat Gigi':[12,30],
 'Susu Segar':[12,36],'Yogurt':[12,30],'Jus Buah':[12,36],'Sayur Pek':[16,32],'Aiskrim':[12,48],'Nugget':[12,48]
};
const SALE_PRICE={'Biskut':4,'Coklat':5,'Air Mineral':2,'Air Gas':3,'Mi Segera':3,'Minyak Masak':9,'Roti':4,'Bijirin':7,'Sabun Baju':8,'Tisu':5,'Syampu':9,'Ubat Gigi':6,'Susu Segar':6,'Yogurt':5,'Jus Buah':6,'Sayur Pek':5,'Aiskrim':6,'Nugget':8};
const $=id=>document.getElementById(id);
const today=new Date();
const fresh=()=>({money:200,storeBudget:1200,orders:[],day:1,date:today.toISOString().slice(0,10),shift:'idle',shiftLeft:SHIFT_SECONDS,shiftsDone:0,shiftStats:{served:0,lost:0,items:0,sales:0,restockSpend:0,restockItems:0,openingStock:0,openingShelf:0,openingStore:0},stocks:fullStock()});
let state=fresh();
try{state={...state,...JSON.parse(localStorage.getItem(SAVE_KEY)||'null')};}catch{}
state.shiftStats={served:0,lost:0,items:0,sales:0,restockSpend:0,restockItems:0,openingStock:0,openingShelf:0,openingStore:0,...state.shiftStats};
state.storeBudget=Number(state.storeBudget??1200);state.orders=Array.isArray(state.orders)?state.orders:[];
state.stocks=state.stocks||{};
for(const station of STOCK_META){
 const previous=state.stocks[station.id]||[];
 state.stocks[station.id]=station.items.map(([name,capacity,initialShelf,initialStore],index)=>{
  const old=previous.find(item=>item.name===name)||previous[index];
  return{name,capacity,shelf:Math.min(capacity,Math.max(0,Number(old?.shelf??old?.qty??initialShelf))),store:Math.max(0,Number(old?.store??initialStore))};
 });
}
const save=()=>localStorage.setItem(SAVE_KEY,JSON.stringify(state));
function stockTotals(){return Object.values(state.stocks).flat().reduce((totals,item)=>{totals.shelf+=item.shelf;totals.store+=item.store;totals.total+=item.shelf+item.store;return totals;},{shelf:0,store:0,total:0});}
const totalStock=()=>stockTotals().total;
const formatDate=()=>new Intl.DateTimeFormat('ms-MY',{weekday:'short',day:'numeric',month:'short'}).format(new Date(`${state.date}T12:00:00`));
function gameHour(){return 8+(SHIFT_SECONDS-state.shiftLeft)/SHIFT_SECONDS*14;}
function gameTime(){const total=Math.min(22*60,Math.floor(gameHour()*60)),hours=Math.floor(total/60),mins=total%60;return`${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}`;}
function render(){
 $('hud-date').textContent=`Hari ${state.day} · ${formatDate()}`;
 $('hud-time').textContent=state.shift==='idle'?'08:00':state.shift==='ready'?'22:00':gameTime();
 $('hud-money').textContent=`RM${state.money.toLocaleString('en-MY')}`;
 $('hud-goal').textContent=`RM${state.money.toLocaleString('en-MY')} / RM${GOAL.toLocaleString('en-MY')}`;
 $('goal-progress').style.width=`${Math.min(100,state.money/GOAL*100)}%`;
 if(state.money>=GOAL){$('hud-job').textContent='Bakal owner';$('job-title').textContent='Modal sudah cukup!';$('job-detail').textContent='Anda sudah boleh membeli kedai sendiri.';return;}
 if(state.shift==='idle'){$('hud-job').textContent='Belum clock-in';$('job-title').textContent='Pergi ke kaunter cashier';$('job-detail').textContent=`Clock-in dan buka kedai · Gaji RM${SHIFT_PAY}.`;}
 else if(state.shift==='working'){$('hud-job').textContent=`Kedai dibuka · ${Math.ceil(state.shiftLeft)}s`;$('job-title').textContent='Layan pelanggan & jaga kedai';$('job-detail').textContent='Klik cashier untuk checkout · Restock rak · Klik kotoran untuk mop.';}
 else if(state.shift==='closing'){$('hud-job').textContent=`Last call · ${Math.ceil(state.shiftLeft)}s`;$('job-title').textContent='Pelanggan terakhir ke cashier';$('job-detail').textContent='Pintu ditutup untuk pelanggan baru. Layan baki queue sebelum 10 malam.';}
 else{const bonus=Math.min(80,state.shiftStats.served*3+state.shiftStats.items);$('hud-job').textContent='Shift selesai';$('job-title').textContent='Kutip gaji di cashier';$('job-detail').textContent=`Gaji RM${SHIFT_PAY} + bonus prestasi RM${bonus}.`;}
 const stats=game?.customerStats?.()||{active:0,waiting:0,dirt:0};$('store-state').textContent=state.shift==='working'?'🟢 Kedai Dibuka':state.shift==='closing'?'🟠 Sedang Tutup':state.shift==='ready'?'✅ Kedai Ditutup':'🔒 Kedai Belum Buka';$('customer-count').textContent=`${stats.active} / 20`;$('queue-count').textContent=stats.waiting;$('served-count').textContent=state.shiftStats.served;$('sales-count').textContent=`RM${state.shiftStats.sales}`;$('dirt-count').textContent=stats.dirt;
}
function nextDay(){const date=new Date(`${state.date}T12:00:00`);date.setDate(date.getDate()+1);state.date=date.toISOString().slice(0,10);state.day++;}
function cashierAction(){
 if(state.money>=GOAL)return;
 if(state.shift==='idle'){const opening=stockTotals();state.shift='working';state.shiftLeft=SHIFT_SECONDS;state.shiftStats={served:0,lost:0,items:0,sales:0,restockSpend:0,restockItems:0,openingStock:opening.total,openingShelf:opening.shelf,openingStore:opening.store};game?.setStoreOpen(true);$('job-title').textContent='Kedai dibuka!';}
 else if(state.shift==='working'||state.shift==='closing'){if(game?.serveNextCustomer())$('job-title').textContent='Checkout selesai!';else $('job-title').textContent='Belum ada pelanggan di queue.';}
 else if(state.shift==='ready')showDaySummary();
 save();render();
}
const categoryNames={all:'Semua 30',rak:'Rak',sejuk:'Chilled & Frozen',display:'Display',mesin:'Stor & Staff'};
let catalogCategory='all';
function renderCatalog(){
 const filters=$('catalog-filters');filters.replaceChildren();
 for(const [id,label] of Object.entries(categoryNames)){const button=document.createElement('button');button.type='button';button.textContent=label;button.classList.toggle('active',catalogCategory===id);button.onclick=()=>{catalogCategory=id;renderCatalog();};filters.append(button);}
 const visible=FIXTURES.filter(item=>catalogCategory==='all'||item.category===catalogCategory);
 $('catalog-count').textContent=`${visible.length} Fixture Tersedia`;
 const grid=$('catalog-grid');grid.replaceChildren();
 for(const item of visible){
  const card=document.createElement('article');card.className='catalog-card';
  card.innerHTML=`<div class="catalog-art"><img class="equipment-image" src="./assets/equipment-hd/${EQUIPMENT_ASSETS[item.id-1]}?v=3" alt="${item.name}" loading="lazy" decoding="async"></div><strong>${item.id}. ${item.name}</strong><small>${item.desc}</small><b>RM${item.price.toLocaleString('en-MY')}</b>`;
  grid.append(card);
 }
}
$('catalog-button').onclick=()=>{$('catalog-modal').hidden=false;renderCatalog();};
$('catalog-close').onclick=()=>{$('catalog-modal').hidden=true;};
$('catalog-modal').addEventListener('pointerdown',event=>{if(event.target===$('catalog-modal'))$('catalog-modal').hidden=true;});
window.addEventListener('keydown',event=>{if(event.key==='Escape')$('catalog-modal').hidden=true;});
window.addEventListener('kedaiku:cashier',cashierAction);
function orderStock(stationId,itemIndex){const item=state.stocks[stationId][itemIndex],[batch,cost]=ORDER_META[item.name]||[12,36];if(state.storeBudget<cost||state.orders.some(order=>order.stationId===stationId&&order.itemIndex===itemIndex))return;state.storeBudget-=cost;if(state.shift==='working'||state.shift==='closing'){state.shiftStats.restockSpend+=cost;state.shiftStats.restockItems+=batch;}state.orders.push({id:`${Date.now()}-${stationId}-${itemIndex}`,stationId,itemIndex,qty:batch,cost,arrivesAt:Date.now()+8000});save();renderStock();}
function renderStock(){
 $('stock-modal').querySelector('.stock-window>p').textContent=`Bajet Kedai: RM${state.storeBudget} · Order supplier masuk ke Stor selepas 8 saat.`;
 const root=$('stock-list');root.replaceChildren();
 for(const station of STOCK_META){
  const items=state.stocks[station.id],shelfTotal=items.reduce((n,item)=>n+item.shelf,0),capacity=items.reduce((n,item)=>n+item.capacity,0),storeTotal=items.reduce((n,item)=>n+item.store,0),card=document.createElement('article');card.className='stock-row';
  card.innerHTML=`<header><strong>${station.name}</strong><small>Rak ${shelfTotal}/${capacity} · Stor ${storeTotal}</small></header><div class="stock-meter"><i style="width:${shelfTotal/capacity*100}%"></i></div>`;
  const list=document.createElement('div');list.className='stock-items';items.forEach((item,index)=>{const [batch,cost]=ORDER_META[item.name]||[12,36],pending=state.orders.find(order=>order.stationId===station.id&&order.itemIndex===index),row=document.createElement('div');row.innerHTML=`<b>${item.name}</b><span>Rak ${item.shelf}/${item.capacity}</span><span>Stor ${item.store}</span>`;const order=document.createElement('button');order.type='button';order.className='stock-order';order.textContent=pending?`🚚 ${Math.max(1,Math.ceil((pending.arrivesAt-Date.now())/1000))}s`:`Order +${batch} · RM${cost}`;order.disabled=Boolean(pending)||state.storeBudget<cost;order.onclick=()=>orderStock(station.id,index);row.append(order);list.append(row);});card.append(list);
  const fill=document.createElement('button');fill.type='button';const canFill=items.some(item=>item.shelf<item.capacity&&item.store>0);fill.textContent=shelfTotal===capacity?'Rak Penuh':storeTotal===0?'Stor Kosong':'Isi Rak Dari Stor';fill.disabled=!canFill;fill.onclick=()=>{for(const item of items){const moved=Math.min(item.capacity-item.shelf,item.store);item.shelf+=moved;item.store-=moved;}save();renderStock();};card.append(fill);root.append(card);
 }
}
$('stock-button').onclick=()=>{$('stock-modal').hidden=false;renderStock();};$('stock-close').onclick=()=>{$('stock-modal').hidden=true;};$('stock-modal').addEventListener('pointerdown',event=>{if(event.target===$('stock-modal'))$('stock-modal').hidden=true;});
let game=null,last=performance.now(),lastOrderSecond=-1;
function updateStockBubble(){const bubble=$('stock-bubble');if(!game)return;const point=game.nearbyStock();if(!point){bubble.hidden=true;return;}const station=STOCK_META.find(item=>item.id===point.id);if(!station)return;const pos=game.screenPosition(point);bubble.style.left=`${pos.x}px`;bubble.style.top=`${pos.y}px`;bubble.innerHTML=`<strong>${station.name}</strong>${state.stocks[point.id].map(item=>`<span><i>${item.name}</i><b>Rak ${item.shelf}/${item.capacity}</b><em>Stor ${item.store}</em></span>`).join('')}`;bubble.hidden=false;}
window.addEventListener('kedaiku:customer-request',event=>{const {customerId,stationId}=event.detail,items=state.stocks[stationId]||[],available=items.filter(item=>item.shelf>0);if(!available.length){game?.resolveCustomerRequest(customerId,false);return;}const item=available[Math.floor(Math.random()*available.length)];item.shelf--;game?.resolveCustomerRequest(customerId,true,{name:item.name,price:SALE_PRICE[item.name]||5});save();});
let receiptTimer;
function showReceipt({lines=[],total=0}){const receipt=$('checkout-receipt'),list=$('receipt-lines');list.replaceChildren();for(const item of lines){const row=document.createElement('div'),name=document.createElement('span'),price=document.createElement('b');name.textContent=`${item.name} ×${item.qty}`;price.textContent=`RM${item.qty*item.price}`;row.append(name,price);list.append(row);}$('receipt-total').textContent=`RM${total}`;receipt.hidden=false;clearTimeout(receiptTimer);receiptTimer=setTimeout(()=>{receipt.hidden=true;},5000);}
window.addEventListener('kedaiku:customer-served',event=>{const sale=event.detail.total||0;state.storeBudget+=sale;state.shiftStats.sales+=sale;state.shiftStats.served++;state.shiftStats.items+=event.detail.items;showReceipt(event.detail);save();render();});
window.addEventListener('kedaiku:customer-lost',()=>{state.shiftStats.lost++;save();render();});
window.addEventListener('kedaiku:dirt-changed',render);
function showDaySummary(){const bonus=Math.min(80,state.shiftStats.served*3+state.shiftStats.items),pay=SHIFT_PAY+bonus,closing=stockTotals(),net=state.shiftStats.sales-state.shiftStats.restockSpend-pay;$('summary-day').textContent=`Hari ${state.day} · ${formatDate()}`;$('summary-sales').textContent=`RM${state.shiftStats.sales}`;$('summary-restock-cost').textContent=`RM${state.shiftStats.restockSpend}`;$('summary-restock-items').textContent=state.shiftStats.restockItems;$('summary-opening-stock').textContent=`Rak ${state.shiftStats.openingShelf} + Stor ${state.shiftStats.openingStore} = ${state.shiftStats.openingStock}`;$('summary-closing-stock').textContent=`Rak ${closing.shelf} + Stor ${closing.store} = ${closing.total}`;$('summary-pay').textContent=`RM${pay}`;$('summary-store-money').textContent=`RM${state.storeBudget} → RM${state.storeBudget-pay}`;$('summary-player-money').textContent=`RM${state.money} → RM${state.money+pay}`;const result=$('summary-result');result.textContent=`${net>=0?'Untung':'Rugi'} RM${Math.abs(net)}`;result.classList.toggle('loss',net<0);$('day-summary').hidden=false;}
function finishDay(){if(state.shift!=='closing'||state.shiftLeft>0||(game?.customerStats?.().active||0)>0)return;state.shift='ready';save();render();showDaySummary();}
window.addEventListener('kedaiku:store-empty',finishDay);
$('next-day').onclick=()=>{if(state.shift!=='ready')return;const bonus=Math.min(80,state.shiftStats.served*3+state.shiftStats.items),pay=SHIFT_PAY+bonus;state.money+=pay;state.storeBudget-=pay;state.shiftsDone++;nextDay();state.shift='idle';state.shiftLeft=SHIFT_SECONDS;$('day-summary').hidden=true;save();render();};
function tick(now){const dt=Math.min((now-last)/1000,.2),nowMs=Date.now();last=now;let delivered=false;state.orders=state.orders.filter(order=>{if(order.arrivesAt>nowMs)return true;const item=state.stocks[order.stationId]?.[order.itemIndex];if(item)item.store+=order.qty;delivered=true;return false;});if(delivered){save();if(!$('stock-modal').hidden)renderStock();$('job-title').textContent='Delivery stok sudah sampai di Stor!';}const orderSecond=Math.floor(nowMs/1000);if(orderSecond!==lastOrderSecond){lastOrderSecond=orderSecond;if(!$('stock-modal').hidden&&state.orders.length)renderStock();}if(state.shift==='working'||state.shift==='closing'){state.shiftLeft=Math.max(0,state.shiftLeft-dt);if(state.shift==='working'&&gameHour()>=21){state.shift='closing';game?.beginClosing();save();}if(!state.shiftLeft)game?.beginClosing();render();finishDay();}game?.setTimeOfDay(state.shift==='idle'?8:state.shift==='ready'?22:gameHour());updateStockBubble();requestAnimationFrame(tick);}
requestAnimationFrame(tick);
render();
const isFirst=!localStorage.getItem('kedaiku-welcome-seen');
$('welcome').hidden=!isFirst;
$('start-game').onclick=()=>{$('welcome').hidden=true;localStorage.setItem('kedaiku-welcome-seen','1');};
try{
 const canvas=$('world3d');game=window.Shop3D.create(canvas);if(state.shift==='working')game.setStoreOpen(true);else if(state.shift==='closing')game.setStoreOpen(false);render();
 const pointers=new Map();let pinched=false;
 function pinchDistance(){const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y);}
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,type:e.pointerType,dragged:false});if(pointers.size>1)pinched=true;});
 canvas.addEventListener('pointermove',e=>{const p=pointers.get(e.pointerId);if(!p)return;const before=pointers.size===2?pinchDistance():0,dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(Math.hypot(p.x-p.startX,p.y-p.startY)>=8)p.dragged=true;if(before>0&&pointers.size===2){game.panBy(dx/2,dy/2);game.zoomBy(pinchDistance()/before);}else if(pointers.size===1&&p.type!=='touch'&&p.dragged&&!pinched){game.panBy(dx,dy);}});
 function endPointer(e){const p=pointers.get(e.pointerId);if(!p)return;if(e.type==='pointerup'&&!pinched&&!p.dragged&&Math.hypot(e.clientX-p.startX,e.clientY-p.startY)<8)game.click(e.clientX,e.clientY);pointers.delete(e.pointerId);if(!pointers.size)pinched=false;}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,endPointer);
 canvas.addEventListener('wheel',e=>{e.preventDefault();game.zoomBy(Math.exp(-Math.max(-150,Math.min(150,e.deltaY))*.0015));},{passive:false});
 $('zoom-in').onclick=()=>game.zoomBy(1.2);$('zoom-out').onclick=()=>game.zoomBy(1/1.2);$('zoom-reset').onclick=()=>game.resetZoom();
 const pad=$('joystick'),knob=$('joystick-knob'),held=new Set();let active=null,joystick={x:0,y:0};
 function applyMovement(){let x=Number(held.has('KeyD'))-Number(held.has('KeyA')),y=Number(held.has('KeyS'))-Number(held.has('KeyW'));if(x||y){const l=Math.hypot(x,y);game.setStick(x/l,y/l);}else game.setStick(joystick.x,joystick.y);}
 function keyboard(e,pressed){if(!['KeyW','KeyA','KeyS','KeyD'].includes(e.code)||e.target?.closest('input,textarea,select'))return;e.preventDefault();pressed?held.add(e.code):held.delete(e.code);applyMovement();}
 window.addEventListener('keydown',e=>keyboard(e,true));window.addEventListener('keyup',e=>keyboard(e,false));
 function updatePad(e){if(e.pointerId!==active)return;const r=pad.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),scale=Math.min(1,36/(d||1)),x=dx*scale,y=dy*scale;knob.style.transform=`translate(${x}px,${y}px)`;joystick={x:x/36,y:y/36};applyMovement();}
 pad.addEventListener('pointerdown',e=>{e.preventDefault();active=e.pointerId;pad.setPointerCapture(active);updatePad(e);});pad.addEventListener('pointermove',updatePad);
 function resetPad(e){if(e&&e.pointerId!==active)return;active=null;knob.style.transform='translate(0,0)';joystick={x:0,y:0};applyMovement();}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(event,resetPad);
 canvas.style.cursor='default';document.querySelector('.move-hint').textContent='Klik objek/lantai · WASD: gerak · Drag: alih view';
}catch(error){$('scene-error').hidden=false;console.error(error);}
})();

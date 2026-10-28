import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
function create(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#fff0db');
 const shop={width:26,depth:18};
 const center=new THREE.Vector3((shop.width-1)/2,0,(shop.depth-1)/2);
 const camera=new THREE.OrthographicCamera(-18,18,13,-13,.1,120);camera.position.copy(center).add(new THREE.Vector3(13,19,21));camera.lookAt(center);
 const skyLight=new THREE.HemisphereLight(0xfff7e6,0x9e8270,2.4);scene.add(skyLight);
 const sun=new THREE.DirectionalLight(0xffedcd,3);sun.position.set(-3,12,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15});scene.add(sun);
 function box(name,x,y,z,w,h,d,color,r=.04){const obj=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,r),new THREE.MeshStandardMaterial({color,roughness:.85}));obj.name=name;obj.position.set(x,y,z);obj.castShadow=obj.receiveShadow=true;scene.add(obj);return obj;}
 function rotateSince(start,x,z,angle){
  if(!angle)return;
  const cos=Math.cos(angle),sin=Math.sin(angle);
  for(let i=start;i<scene.children.length;i++){
   const obj=scene.children[i],dx=obj.position.x-x,dz=obj.position.z-z;
   obj.position.x=x+dx*cos+dz*sin;obj.position.z=z-dx*sin+dz*cos;obj.rotation.y+=angle;
  }
 }
 function fixtureBounds(x,z,halfWidth,halfDepth,angle=0){return Math.abs(Math.sin(angle))>.5?[x-halfDepth,x+halfDepth,z-halfWidth,z+halfWidth]:[x-halfWidth,x+halfWidth,z-halfDepth,z+halfDepth];}
 box('Floor base',center.x,-.2,center.z,shop.width+.2,.4,shop.depth+.2,0xe5c7a0,.12);
 for(let x=0;x<shop.width;x++)for(let z=0;z<shop.depth;z++)box('Floor tile',x,.02,z,.98,.04,.98,(x+z)%2?0xf3e7d2:0xfaf1df,.015);
 box('Back wall',center.x,1.2,-.5,shop.width+.2,2.4,.18,0xe6c3a2);
 box('Left wall',-.5,1.2,center.z,.18,2.4,shop.depth+.2,0xefd3b5);
 box('Wall trim',center.x,2.42,-.5,shop.width+.3,.12,.25,0xcfa17f);
 box('Cashier counter',7.1,.5,5.9,2.6,1,1.1,0xd89e79,.1);
 box('Counter top',7.1,1.04,5.9,2.75,.12,1.2,0xfff2d9);
 box('Cashier screen',6.7,1.33,5.82,.65,.43,.12,0x668f91);
 box('Screen display',6.7,1.34,5.89,.53,.3,.015,0xc4e2d6,.006);
 box('Scanner',7.7,1.15,6.05,.45,.12,.4,0x53675e);
 // Wall details face into the shop.
 // Entrance on the near end of the left wall (bottom-left in the fixed view).
 box('Door frame',-.36,1.05,6.1,.16,2.1,1.45,0x967152);
 box('Glass door',-.25,1.03,6.1,.08,1.93,1.22,0x95cbd0);
 box('Door bottom',-.18,.3,6.1,.05,.5,1.22,0xc69a74);
 box('Door handle',-.12,1,6.56,.07,.3,.06,0xffe1a0);
 for(const z of [1.6,3.8,6.1,8.3,10.6,12.9]){
  box('Left window frame',-.35,1.4,z,.15,1.25,1.9,0xffefd5);
  box('Left window glass',-.24,1.4,z,.06,1.04,1.69,0xa6d8df);
  box('Left window mullion',-.18,1.4,z,.05,1.08,.07,0xffefd5);
  box('Left window sill',-.17,.76,z,.3,.1,2.02,0xffefd5);
 }
 for(const x of [1.6,4.3,7,9.7,12.4,15.1,17.8,20.5,23.2]){
  box('Window frame',x,1.4,-.35,1.9,1.25,.15,0xffefd5);
  box('Window glass',x,1.4,-.24,1.69,1.04,.06,0xa6d8df);
  box('Window mullion',x,1.4,-.18,.07,1.08,.05,0xffefd5);
  box('Window sill',x,.76,-.17,2.02,.1,.3,0xffefd5);
 }
 // Move the existing counter and entrance to the expanded front corners.
 const counterNames=['Cashier counter','Counter top','Cashier screen','Screen display','Scanner'];
 for(const obj of scene.children){
  if(counterNames.includes(obj.name)){obj.position.x+=15;obj.position.z+=8;}
  if(obj.name.startsWith('Door ')||obj.name==='Glass door')obj.position.z+=10;
 }
 // Keep a character-sized margin around the actual countertop footprint.
 const cashierSpot={x:22.1,z:12.65};
 const obstacles=[[20.475,23.725,13.05,14.75]];
 const signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=160;
 const signContext=signCanvas.getContext('2d');
 signContext.fillStyle='#fff1d5';signContext.fillRect(0,0,512,160);
 signContext.strokeStyle='#b98156';signContext.lineWidth=12;signContext.strokeRect(6,6,500,148);
 signContext.fillStyle='#634638';signContext.font='bold 72px sans-serif';signContext.textAlign='center';signContext.textBaseline='middle';signContext.fillText('CASHIER',256,84);
 const signTexture=new THREE.CanvasTexture(signCanvas);signTexture.colorSpace=THREE.SRGBColorSpace;
 const cashierSign=new THREE.Mesh(new THREE.BoxGeometry(1.25,.4,.06),[
  new THREE.MeshStandardMaterial({color:0xb98156}),new THREE.MeshStandardMaterial({color:0xb98156}),
  new THREE.MeshStandardMaterial({color:0xb98156}),new THREE.MeshStandardMaterial({color:0xb98156}),
  new THREE.MeshBasicMaterial({map:signTexture}),new THREE.MeshBasicMaterial({map:signTexture})
 ]);
 cashierSign.name='Cashier sign';cashierSign.position.set(22.1,1.36,14.22);scene.add(cashierSign);
 box('Sign stand',22.1,1.13,14.22,.65,.06,.25,0xb98156);
 function stockedRack(name,x,z,color,productColors,angle=0){
  const start=scene.children.length;
  box(name,x,.14,z,2.35,.28,.82,0x9b704f,.06);
  for(const shelfY of [.55,1.05,1.55]){
   box(`${name} shelf`,x,shelfY,z,2.3,.11,.76,0xe1a365,.03);
   for(let i=-4;i<=4;i++)box(`${name} product`,x+i*.24,shelfY+.18,z,.17,.28,.43,productColors[(i+4)%productColors.length],.025);
  }
  box(`${name} left`,x-1.12,.9,z,.1,1.72,.78,color,.03);
  box(`${name} right`,x+1.12,.9,z,.1,1.72,.78,color,.03);
  rotateSince(start,x,z,angle);obstacles.push(fixtureBounds(x,z,1.35,.62,angle));
 }
 const showProceduralFixtures=false;
 if(showProceduralFixtures){
 stockedRack('Rak Snek',4,3,0xe9a34c,[0xe65e4b,0xf2c84b,0x77a9d9,0x8dc26f]);
 stockedRack('Rak Minuman',8,3,0x62a8c6,[0x75b9de,0xe96458,0xf4cf58,0x72b87d]);
 stockedRack('Rak Keperluan',12,3,0xb38ac7,[0xaad7e8,0xf6d9a4,0xe6a2b2,0xb8d59e]);
 stockedRack('Rak Bakeri',16,3.2,0xce8b57,[0xe7b46a,0xd98d55,0xf2d39a,0xc47749],Math.PI/2);
 stockedRack('Rak Makanan Tin',19,3.7,0x719d79,[0x82b8a0,0xe7aa58,0xd96e61,0xf2d574],Math.PI/2);
 stockedRack('Rak Sarapan',4.5,6.5,0xd69b64,[0xefb45f,0xe77c52,0xf0d36c,0x98bd77]);
 stockedRack('Rak Rumah',8.6,6.3,0x75a89c,[0x7fc4ce,0xe99a61,0xb39bd6,0xf0cd69]);
 stockedRack('Rak Penjagaan',12.7,6.7,0xd78099,[0xf0aaba,0x9bc5dd,0xc1d88e,0xe9c77d]);
 stockedRack('Rak Bayi',16.5,7.1,0xe1a679,[0xf2d2a9,0xa8cfdf,0xf0b8c7,0xc5dda4],Math.PI/2);
 stockedRack('Rak Haiwan',20,7.2,0x9b826b,[0xd6a05f,0x7cb19b,0xe9c674,0xb88f70],Math.PI/2);
 }
 function dairyChiller(x,z,angle=0){
  const start=scene.children.length;
  box('Chiller tenusu',x,1.12,z,1.8,2.24,.62,0xe7eff0,.07);
  box('Pintu kiri',x-.43,1.08,z+.34,.79,1.88,.06,0x9dcfd7,.035);box('Pintu kanan',x+.43,1.08,z+.34,.79,1.88,.06,0x9dcfd7,.035);
  box('Pembahagi chiller',x,1.08,z+.39,.055,1.9,.05,0x6d878b,.01);box('Handle kiri',x-.1,1.08,z+.42,.035,.78,.04,0x536a70,.01);box('Handle kanan',x+.1,1.08,z+.42,.035,.78,.04,0x536a70,.01);
  for(let row=0;row<3;row++)for(let col=-3;col<=3;col++)box('Produk tenusu',x+col*.2,.52+row*.45,z+.4,.13,.22,.04,[0xf5e3a7,0x9dc9e1,0xa9d28c][(row+col+6)%3],.012);
  box('TENUSU',x,2.28,z+.3,1.3,.2,.08,0x5fa4c2,.025);rotateSince(start,x,z,angle);obstacles.push(fixtureBounds(x,z,1.05,.52,angle));
 }
 function openFreshChiller(x,z,angle=0){
  const start=scene.children.length;
  box('Open chiller',x,1,z,1.9,2,.72,0xdfe9e2,.06);box('Kanopi chiller',x,1.93,z+.12,1.92,.2,.92,0x70a976,.04);
  for(let row=0;row<4;row++){box('Shelf sejuk',x,.38+row*.43,z+.38,1.62,.07,.55,0xb7cbc0,.02);for(let col=-3;col<=3;col++)box('Produk segar',x+col*.21,.52+row*.43,z+.48,.14,.18,.12,[0x78ae68,0xe79755,0xd9c55d][(row+col+6)%3],.02);}
  box('SEGAR',x,2.1,z+.48,1.25,.19,.06,0x75b47d,.025);rotateSince(start,x,z,angle);obstacles.push(fixtureBounds(x,z,1.08,.58,angle));
 }
 function chestFreezer(x,z,angle=0){
  const start=scene.children.length;
  box('Chest freezer',x,.48,z,2.25,.96,1.02,0xdce8ea,.1);box('Bingkai freezer',x,.99,z,2.2,.11,1.02,0x6fa4ad,.035);
  box('Kaca kiri',x-.53,1.04,z,1.02,.08,.82,0x9ed5dc,.035);box('Kaca kanan',x+.53,1.04,z,1.02,.08,.82,0x9ed5dc,.035);box('Pemegang freezer',x,1.11,z+.22,.55,.05,.06,0x526e73,.015);
  box('FROZEN',x,.58,z+.55,1.25,.22,.06,0xd8889b,.025);rotateSince(start,x,z,angle);obstacles.push(fixtureBounds(x,z,1.28,.68,angle));
 }
 function uprightCooler(name,label,x,z,color,productColors,angle=0){
  const start=scene.children.length;
  box(name,x,1.12,z,1.8,2.24,.68,0xe3ecec,.07);box(`${name} header`,x,2.25,z+.33,1.48,.22,.09,color,.03);
  box(`${name} glass`,x,1.08,z+.38,1.55,1.84,.06,0xa8d7dc,.035);box(`${name} divider`,x,1.08,z+.42,.055,1.84,.04,0x66858a,.01);
  for(let row=0;row<4;row++)for(let col=-3;col<=3;col++)box(`${name} product`,x+col*.2,.4+row*.43,z+.44,.13,.2,.04,productColors[(row+col+6)%productColors.length],.012);
  box(label,x,2.27,z+.4,1.18,.14,.04,0xfff4dc,.02);rotateSince(start,x,z,angle);obstacles.push(fixtureBounds(x,z,1.03,.55,angle));
 }
 function islandDisplay(name,x,z,color,kind=0){
  if(kind===0){box(name,x,.35,z,1.75,.7,1.05,color,.09);for(let i=-2;i<=2;i++)box(`${name} item`,x+i*.3,.82,z,.22,.3,.62,[0xe6a45b,0xd96b5d,0xf0ce67][i+2>2?1:i+2],.04);}
  else if(kind===1){box(name,x,.22,z,1.8,.44,1.05,0xa97951,.05);for(let i=-2;i<=2;i++)sphere(scene,x+i*.3,.58,z,.21,[0xe6964d,0x76a767,0xd76152][(i+2)%3]);}
  else{box(name,x,.28,z,1.7,.56,1,0xd8b27b,.06);for(let i=-2;i<=2;i++)box(`${name} box`,x+i*.31,.68,z,.25,.3,.55,[color,0xf1ce72,0x7eb2a1][(i+2)%3],.035);}
  obstacles.push([x-1.05,x+1.05,z-.68,z+.68]);
 }
 function vendingMachine(name,x,z,color,accent,kind=0){
  box(name,x,1.05,z,1.05,2.1,.72,color,.08);box(`${name} face`,x,1.28,z+.39,.78,1.25,.05,kind%2?0x273f4b:0xc7e6e6,.025);
  if(kind%2){for(let row=0;row<3;row++)for(let col=-1;col<=1;col++)box(`${name} choice`,x+col*.21,1.12+row*.32,z+.43,.14,.2,.03,[accent,0xf1cf61,0x74b5a5][(row+col+4)%3],.015);}else sphere(scene,x,1.42,z+.43,.31,accent,1,.9,.15);
  box(`${name} panel`,x+.3,.65,z+.43,.16,.35,.04,0x4c5f64,.015);box(`${name} slot`,x,.28,z+.43,.5,.12,.04,accent,.015);obstacles.push([x-.68,x+.68,z-.52,z+.52]);
 }
 function utilityFixture(name,x,z,type=0){
  if(type===0){
   for(const y of [.35,.9,1.45])box(`${name} shelf`,x,y,z,1.45,.1,.62,0x616a70,.025);
   for(let row=0;row<3;row++)for(let col=-2;col<=2;col++)box(`${name} box`,x+col*.27,.53+row*.55,z,.22,.32,.45,[0xc88c50,0xe1ad68,0x8ca9b4][(row+col+5)%3],.025);
  }else if(type===1){
   for(let col=-1;col<=1;col++){box(name,x+col*.46,1,z,.43,2,.62,col===1?0x708aa4:0xd5d5ca,.035);box(`${name} vent`,x+col*.46,1.62,z+.33,.22,.05,.03,0x4f6572,.01);box(`${name} handle`,x+col*.46+.13,.92,z+.34,.035,.22,.03,0x4f6572,.01);}
  }else if(type===2){
   box(`${name} pallet`,x,.12,z,1.55,.24,.92,0x9b704f,.035);for(const [dx,dz,y] of [[-.45,-.2,.42],[.05,-.18,.42],[.45,.18,.42],[-.2,.2,.42],[.22,.05,.83]])box(name,x+dx,y,z+dz,.48,.58,.46,0xc78d55,.035);
  }else if(type===3){
   box(name,x,.22,z,1.45,.44,.72,0x9b704f,.05);for(let row=0;row<3;row++)for(let col=-2;col<=2;col++)box(`${name} magazine`,x+col*.25,.48+row*.35,z+.32,.18,.3,.04,[0xe46c64,0x69a7c4,0xe7ba58,0x8eb270][(row+col+5)%4],.015);
  }else if(type===4){
   box(name,x,.28,z,1.5,.56,.72,0xa97854,.05);for(let col=-2;col<=2;col++){box(`${name} pot`,x+col*.28,.68,z,.2,.24,.2,0xc98d6d,.035);sphere(scene,x+col*.28,.95,z,.2,[0xe27380,0xf0bb55,0x73a66c][(col+2)%3]);}
  }else{
   box(name,x,.3,z,1.5,.6,.8,0xc28a55,.06);for(let row=0;row<2;row++)for(let col=-3;col<=3;col++)box(`${name} product`,x+col*.2,.66+row*.34,z,.14,.24,.42,[0xe45c4f,0xf1c949,0x62a6c5,0x70aa69][(row+col+7)%4],.025);
  }
  obstacles.push([x-.9,x+.9,z-.58,z+.58]);
 }
 if(showProceduralFixtures){
 // Chilled fixtures hug two walls: five at the back and three down the left side.
 dairyChiller(3,0.75);openFreshChiller(5.6,.78);chestFreezer(8.3,.82);
 uprightCooler('Peti Ais Minuman','MINUMAN',10.9,.75,0x58a9c8,[0x72b9df,0xe56758,0xf2cc57]);
 uprightCooler('Peti Sejuk Daging','DAGING',13.25,.75,0xc96f69,[0xd97a73,0xf0aaa0,0xbd5f5c]);
 chestFreezer(.78,3.2,Math.PI/2);uprightCooler('Peti Ais Krim','AISKRIM',.75,6,0xd987b2,[0xf3b5ce,0x9cc8e7,0xf0d479],Math.PI/2);
 uprightCooler('Peti Sejuk Kek','DESSERT',.75,8.6,0xb792c7,[0xe7b4ca,0xd7b27c,0xbfa8dd],Math.PI/2);
 // Low promotional islands are staggered, leaving a broad route from entrance to cashier.
 islandDisplay('Bakul Promosi',3.2,11.1,0xd88762,0);islandDisplay('Display Buah',6.8,9.7,0x82a66e,1);islandDisplay('Kotak Bakeri',10.2,11.2,0xc68b58,2);islandDisplay('Display Tawaran',13.8,9.8,0x6f9fba,0);islandDisplay('Bakul Sayur',17.2,11.1,0x7ca56d,1);
 // Reference-matched support equipment replaces the old vending-machine wall.
 utilityFixture('Storage Rack',24.35,1.25,0);utilityFixture('Staff Lockers',24.35,3.35,1);utilityFixture('Boxes & Pallets',24.25,5.5,2);
 utilityFixture('Magazine & Stationery',24.25,7.65,3);utilityFixture('Home & Lifestyle',24.2,9.7,4);utilityFixture('Promo Rack',24.15,11.65,5);
 utilityFixture('Backroom Storage',21.5,10.2,0);
 }
 const textureLoader=new THREE.TextureLoader();
 function hdFixture(file,name,x,z,width=2.25,height=2.15,footWidth=1.65,footDepth=.85){
  const material=new THREE.SpriteMaterial({transparent:true,alphaTest:.035,depthTest:true,depthWrite:false});
  const sprite=new THREE.Sprite(material);sprite.name=name;sprite.center.set(.5,0);sprite.position.set(x,.06,z);sprite.scale.set(width,height,1);scene.add(sprite);
  textureLoader.load(`./assets/equipment-hd/${file}?v=3`,texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();material.map=texture;material.needsUpdate=true;});
  obstacles.push([x-footWidth/2,x+footWidth/2,z-footDepth/2,z+footDepth/2]);return sprite;
 }
 // Layout follows the mega-supermarket reference: facilities at the back,
 // produce on the left, grocery aisles in the middle and service areas on the right.
 // Back-wall fixtures share one baseline and one visual scale.
 hdFixture('28-backroom-storage-rack.png','Storage & Backroom',2.2,1.15,2.05,2,1.6,.75);
 hdFixture('03-drinks-chiller.png','Drinks Chiller',6.2,1.15,2.35,2.2,1.85,.7);
 hdFixture('04-dairy-chiller.png','Dairy Chiller',9.1,1.15,2.35,2.2,1.85,.7);
 hdFixture('05-ice-cream-freezer.png','Ice Cream Freezer',12,1.15,2.25,1.6,1.85,.85);
 hdFixture('06-frozen-food-freezer.png','Frozen Food Freezer',14.8,1.15,2.25,1.6,1.85,.85);
 hdFixture('30-staff-lockers.png','Staff Lockers',21.8,1.15,2.05,2,1.55,.7);
 hdFixture('29-boxes-pallets.png','Boxes & Pallets',24.1,1.2,1.9,1.55,1.5,.85);

 // Produce wall on the left.
 hdFixture('01-fruit-veg-rack.png','Fruit & Veg Rack',2.7,4.25,2.45,2.05,1.9,1.05);
 hdFixture('02-fresh-herbs-rack.png','Fresh Herbs Rack',2.7,7.05,2.3,2,1.8,.95);
 hdFixture('25-home-lifestyle-rack.png','Flowers & Plants',2.7,9.85,2.3,1.95,1.75,.9);

 // Main supermarket aisles: consistent rows and generous walking lanes.
 hdFixture('07-snack-rack.png','Snack Rack',6,4.75,2.05,2,1.55,.75);
 hdFixture('08-confectionery-rack.png','Confectionery Rack',9,4.75,2.05,2,1.55,.75);
 hdFixture('09-dry-groceries-rack.png','Dry Groceries Rack',12,4.75,2.05,2,1.55,.75);
 hdFixture('10-instant-food-rack.png','Instant Food Rack',15,4.75,2.05,2,1.55,.75);
 hdFixture('14-bakery-display.png','Bakery Display',18.2,4.75,2.3,1.95,1.8,.9);
 hdFixture('15-deli-hot-food-counter.png','Deli & Hot Food',21.4,4.75,2.3,1.85,1.8,.9);

 hdFixture('11-rice-flour-rack.png','Rice & Flour Rack',6,7.75,2.05,2,1.55,.75);
 hdFixture('12-beverage-rack.png','Beverage Rack',9,7.75,2.05,2,1.55,.75);
 hdFixture('13-water-soft-drink-rack.png','Water & Soft Drink Rack',12,7.75,2.05,2,1.55,.75);
 hdFixture('18-household-rack.png','Household Rack',15,7.75,2.05,2,1.55,.75);
 hdFixture('16-meat-display-chiller.png','Meat Display Chiller',18.2,7.75,2.3,1.65,1.8,.9);
 hdFixture('17-seafood-display-chiller.png','Seafood Display Chiller',21.4,7.75,2.3,1.65,1.8,.9);

 hdFixture('19-cleaning-supplies-rack.png','Cleaning Supplies Rack',6,10.75,2.05,2,1.55,.75);
 hdFixture('20-personal-care-rack.png','Personal Care Rack',9,10.75,2.05,2,1.55,.75);
 hdFixture('21-beauty-cosmetics-rack.png','Beauty & Cosmetics Rack',12,10.75,2.05,2,1.55,.75);
 hdFixture('22-health-medicine-rack.png','Health & Medicine Rack',15,10.75,2.05,2,1.55,.75);
 hdFixture('23-baby-products-rack.png','Baby Products Rack',18,10.75,2.05,2,1.55,.75);
 hdFixture('24-pet-supplies-rack.png','Pet Supplies Rack',21,10.75,2.05,2,1.55,.75);

 hdFixture('27-magazine-stationery-rack.png','Magazine & Stationery',7.5,13.65,2,1.9,1.5,.72);
 hdFixture('26-promo-rack.png','Promo Rack',11,13.65,2.15,1.85,1.65,.82);
 function zoneSign(text,x,y,z,color){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const context=canvas.getContext('2d');
  context.fillStyle=color;context.beginPath();context.roundRect(8,8,752,112,24);context.fill();context.strokeStyle='#fff7e8';context.lineWidth=8;context.stroke();
  context.fillStyle='#fff';context.font='bold 54px sans-serif';context.textAlign='center';context.textBaseline='middle';context.fillText(text,384,66);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const material=new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false});
  const sprite=new THREE.Sprite(material);sprite.position.set(x,y,z);sprite.scale.set(3.8,.64,1);sprite.renderOrder=20;scene.add(sprite);
 }
 zoneSign('CHILLED & FROZEN',10.5,2.65,1.45,'#27618d');zoneSign('FRESH PRODUCE',2.7,2.45,5.75,'#32814f');
 zoneSign('GROCERIES',10.5,2.5,5.45,'#76503c');zoneSign('BAKERY & DELI',19.8,2.45,5.4,'#9a592f');
 zoneSign('CARE & HOUSEHOLD',13.5,2.5,11.45,'#3b6577');
 const stockPoints=[
  {id:'snack',x:6,z:4.75,y:2.25},{id:'drink',x:9,z:7.75,y:2.25},{id:'essentials',x:12,z:4.75,y:2.25},
  {id:'breakfast',x:15,z:4.75,y:2.25},{id:'home',x:15,z:7.75,y:2.25},{id:'care',x:9,z:10.75,y:2.25},
  {id:'dairy',x:9.1,z:1.15,y:2.45},{id:'fresh',x:2.7,z:4.25,y:2.35},{id:'frozen',x:12,z:1.15,y:1.95}
 ];
 function sphere(parent,x,y,z,r,color,sx=1,sy=1,sz=1){const m=new THREE.Mesh(new THREE.SphereGeometry(r,20,16),new THREE.MeshStandardMaterial({color,roughness:.85}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
 for(const [x,z] of [[.2,.3],[18.1,.35],[24.7,15.8]]){
  box('Plant pot',x,.24,z,.48,.48,.48,0xcc9274,.08);
  box('Plant trunk',x,.66,z,.09,.65,.09,0x9b7752);
  sphere(scene,x,.98,z,.38,0x6fa978,1,1.3,1);
  sphere(scene,x-.22,.82,z+.08,.26,0x87b782);
  sphere(scene,x+.24,.89,z-.04,.26,0x91bf83);
  obstacles.push([x-.5,x+.5,z-.5,z+.5]);
 }
 const hero=new THREE.Group();hero.position.set(.85,.06,16.15);scene.add(hero);
 function part(x,y,z,w,h,d,color,parent=hero){const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,.06),new THREE.MeshStandardMaterial({color,roughness:.8}));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
 part(0,.69,0,.48,.57,.31,0xe69754);
 part(0,.66,.175,.33,.4,.04,0x6c9b8c);
 sphere(hero,0,1.2,0,.29,0xf2c7a3);
 sphere(hero,0,1.38,-.025,.29,0x654638,1,.65,1);
 sphere(hero,-.1,1.23,.26,.028,0x49392f);
 sphere(hero,.1,1.23,.26,.028,0x49392f);
 sphere(hero,0,1.14,.285,.045,0xe2aa83);
 const legs=[part(-.14,.25,0,.19,.4,.23,0x4f6876),part(.14,.25,0,.19,.4,.23,0x4f6876)];
 const arms=[part(-.34,.7,0,.15,.43,.19,0xf2c7a3),part(.34,.7,0,.15,.43,.19,0xf2c7a3)];
 const targetRing=new THREE.Mesh(new THREE.RingGeometry(.17,.22,32),new THREE.MeshBasicMaterial({color:0x70a591,side:THREE.DoubleSide}));targetRing.rotation.x=-Math.PI/2;targetRing.position.y=.065;targetRing.visible=false;scene.add(targetRing);
 const customerStations=[
  {id:'produce',x:2.7,z:4.25},{id:'herbs',x:2.7,z:5.55},{id:'drink',x:6,z:2.05},{id:'dairy',x:9.1,z:2.05},{id:'icecream',x:12,z:2.05},{id:'frozen',x:15,z:2.05},
  {id:'snack',x:6,z:5.55},{id:'confectionery',x:9,z:5.55},{id:'groceries',x:12,z:5.55},{id:'instant',x:15,z:5.55},{id:'bakery',x:18.2,z:5.55},{id:'deli',x:21.4,z:5.55},
  {id:'rice',x:6,z:8.55},{id:'beverage',x:9,z:8.55},{id:'water',x:12,z:8.55},{id:'home',x:15,z:8.55},{id:'meat',x:18.2,z:8.55},{id:'seafood',x:21.4,z:8.55},
  {id:'cleaning',x:6,z:11.55},{id:'care',x:9,z:11.55},{id:'beauty',x:12,z:11.55},{id:'health',x:15,z:11.55},{id:'baby',x:18,z:11.55},{id:'pet',x:21,z:11.55},
  {id:'magazine',x:7.5,z:14.45},{id:'promo',x:11,z:14.45},{id:'lifestyle',x:3.8,z:4.25}
 ];
 const customers=[],dirtSpots=[];let storeOpen=false,spawnClock=0,nextCustomerId=1,cleaningTarget=null,cashierAutoClock=0;
 function makeEmoji(text,parent){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const context=canvas.getContext('2d');context.font='92px sans-serif';context.textAlign='center';context.textBaseline='middle';context.fillText(text,64,67);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.position.set(0,1.75,0);sprite.scale.set(.8,.8,1);sprite.visible=false;sprite.renderOrder=30;parent.add(sprite);return sprite;}
 function createCustomer(){
  if(customers.length>=20)return;
  const group=new THREE.Group(),shirt=[0xe26f65,0x5b9ec9,0x72aa72,0xd69a55,0xa57ac0,0xe28ba6][nextCustomerId%6];scene.add(group);group.position.set(.75,.06,16.05);
  part(0,.68,0,.43,.55,.29,shirt,group);sphere(group,0,1.16,0,.26,[0xf2c7a3,0xc98f65,0x8e5d45][nextCustomerId%3]);sphere(group,0,1.34,-.02,.27,[0x4c352c,0x7a523c,0x2f2928][nextCustomerId%3],1,.62,1);
  part(-.12,.25,0,.16,.4,.2,0x4f6876,group);part(.12,.25,0,.16,.4,.2,0x4f6876,group);part(-.3,.7,0,.13,.4,.17,0xf2c7a3,group);part(.3,.7,0,.13,.4,.17,0xf2c7a3,group);
  const count=1+Math.floor(Math.random()*4),tasks=[];for(const station of [...customerStations].sort(()=>Math.random()-.5).slice(0,count))tasks.push(station);
  const customer={id:nextCustomerId++,group,tasks,taskIndex:0,basket:[],state:'entering',awaiting:false,target:{x:3.8,z:15.2},emoji:makeEmoji('😡',group),emojiUntil:0};customers.push(customer);
 }
 function removeCustomer(customer){scene.remove(customer.group);const index=customers.indexOf(customer);if(index>=0)customers.splice(index,1);if(!customers.length&&!storeOpen)window.dispatchEvent(new CustomEvent('kedaiku:store-empty'));}
 function showAngry(customer){customer.emoji.visible=true;customer.emojiUntil=performance.now()+2200;customer.state='leaving';customer.target={x:.55,z:16.05};window.dispatchEvent(new CustomEvent('kedaiku:customer-lost'));}
 function spawnDirt(x,z){if(dirtSpots.length>=8)return;const mesh=new THREE.Mesh(new THREE.CircleGeometry(.3,20),new THREE.MeshBasicMaterial({color:0x8b613d,transparent:true,opacity:.68,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.07,z);mesh.name='Dirt';scene.add(mesh);dirtSpots.push({mesh,x,z});window.dispatchEvent(new CustomEvent('kedaiku:dirt-changed',{detail:{count:dirtSpots.length}}));}
 function resolveCustomerRequest(id,success,itemInfo){const customer=customers.find(item=>item.id===id);if(!customer||!customer.awaiting)return;customer.awaiting=false;if(!success){showAngry(customer);return;}customer.basket.push(itemInfo||{name:'Barang',price:3});customer.taskIndex++;if(Math.random()<.18)spawnDirt(customer.group.position.x,customer.group.position.z);if(customer.taskIndex<customer.tasks.length){const station=customer.tasks[customer.taskIndex];customer.target={x:station.x,z:station.z};}else{customer.state='checkout';customer.target={x:21.7,z:15.55};}}
 function serveNextCustomer(){const customer=customers.find(item=>item.state==='waiting');if(!customer)return false;customer.state='leaving';customer.target={x:.55,z:16.05};const grouped=new Map;for(const item of customer.basket){const line=grouped.get(item.name)||{name:item.name,qty:0,price:item.price};line.qty++;grouped.set(item.name,line);}const lines=[...grouped.values()],total=lines.reduce((sum,item)=>sum+item.qty*item.price,0);window.dispatchEvent(new CustomEvent('kedaiku:customer-served',{detail:{items:customer.basket.length,lines,total}}));return true;}
 function updateCustomers(dt,time){
  if(storeOpen){spawnClock-=dt;if(spawnClock<=0&&customers.length<20){createCustomer();spawnClock=1.25+Math.random()*1.25;}}
  const waiting=customers.filter(item=>item.state==='waiting');waiting.forEach((customer,index)=>{customer.target={x:21.7-Math.floor(index/6)*.55,z:15.5+index%6*.3};});
  for(const customer of [...customers]){
   if(customer.emoji.visible&&time>customer.emojiUntil)customer.emoji.visible=false;if(customer.awaiting)continue;
   const dx=customer.target.x-customer.group.position.x,dz=customer.target.z-customer.group.position.z,distance=Math.hypot(dx,dz);if(distance>.07){const speed=customer.state==='checkout'?2.8:.82+customer.id%4*.06,step=Math.min(distance,dt*speed);customer.group.position.x+=dx/distance*step;customer.group.position.z+=dz/distance*step;customer.group.rotation.y=Math.atan2(dx,dz);continue;}
   if(customer.state==='leaving'){removeCustomer(customer);continue;}if(customer.state==='checkout'){customer.state='waiting';continue;}
   if(customer.state==='entering'){const station=customer.tasks[customer.taskIndex];customer.state='shopping';customer.target={x:station.x,z:station.z};continue;}
   if(customer.state==='shopping'){customer.awaiting=true;window.dispatchEvent(new CustomEvent('kedaiku:customer-request',{detail:{customerId:customer.id,stationId:customer.tasks[customer.taskIndex].id}}));}
  }
 }
 const canStand=(x,z)=>x>=-.12&&x<=shop.width-.88&&z>=-.12&&z<=shop.depth-.88&&!obstacles.some(([a,b,c,d])=>x>a&&x<b&&z>c&&z<d);
 let path=[],stick={x:0,y:0},cashierArrival=false;
 function walkTo(x,z){
  const step=.2,n=Math.ceil(shop.width/step),key=(x,z)=>z*n+x,grid=v=>Math.max(0,Math.min(n-1,Math.round(v/step)));
  if(!canStand(x,z))return;
  cashierArrival=false;
  const start=key(grid(hero.position.x),grid(hero.position.z)),goal=key(grid(x),grid(z)),queue=[start],prev=new Map([[start,null]]);
  for(let i=0;i<queue.length;i++){const at=queue[i];if(at===goal)break;const a=at%n,b=Math.floor(at/n);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const c=a+dx,d=b+dz,k=key(c,d);if(c<0||c>=n||d<0||d>=n||prev.has(k)||!canStand(c*step,d*step))continue;prev.set(k,at);queue.push(k);}}
  if(!prev.has(goal))return;
  path=[];for(let at=goal;at!==start;at=prev.get(at))path.push({x:(at%n)*step,z:Math.floor(at/n)*step});path.reverse();path.push({x,z});targetRing.position.set(x,.065,z);targetRing.visible=true;
 }
 const ray=new THREE.Raycaster(),floor=new THREE.Plane(new THREE.Vector3(0,1,0),-.06);
 const counterParts=scene.children.filter(obj=>[...counterNames,'Cashier sign','Sign stand'].includes(obj.name));
 function click(clientX,clientY){const rect=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1),camera);const dirtHit=ray.intersectObjects(dirtSpots.map(item=>item.mesh))[0];if(dirtHit){const dirt=dirtSpots.find(item=>item.mesh===dirtHit.object);walkTo(dirt.x,dirt.z);cleaningTarget=dirt;return;}if(ray.intersectObjects(counterParts).length){walkTo(cashierSpot.x,cashierSpot.z);cashierArrival=true;return;}const p=ray.ray.intersectPlane(floor,new THREE.Vector3());if(p)walkTo(p.x,p.z);}
 function setStick(x,y){stick={x,y};if(x||y){path=[];cashierArrival=false;targetRing.visible=false;}}
 let last=0,gait=0;
 function frame(time){const dt=Math.min((time-last)/1000||0,.04);last=time;updateCustomers(dt,time);const atCashier=Math.hypot(hero.position.x-cashierSpot.x,hero.position.z-cashierSpot.z)<1.15;if(atCashier){cashierAutoClock-=dt;if(cashierAutoClock<=0&&customers.some(item=>item.state==='waiting')){serveNextCustomer();cashierAutoClock=1.15;}}else cashierAutoClock=0;let dx=0,dz=0;const manual=Math.hypot(stick.x,stick.y);if(manual>.08){const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);const forward=camera.getWorldDirection(new THREE.Vector3()).negate();forward.y=0;forward.normalize();dx=right.x*stick.x+forward.x*stick.y;dz=right.z*stick.x+forward.z*stick.y;}else if(path.length){const p=path[0],dist=Math.hypot(p.x-hero.position.x,p.z-hero.position.z);if(dist<.04)path.shift();else{const speed=Math.min(1,dist/(dt*2.5||1));dx=(p.x-hero.position.x)/dist*speed;dz=(p.z-hero.position.z)/dist*speed;}}
  const before=hero.position.clone(),x=hero.position.x+dx*dt*2.5,z=hero.position.z+dz*dt*2.5;if(canStand(x,hero.position.z))hero.position.x=x;if(canStand(hero.position.x,z))hero.position.z=z;const moved=hero.position.distanceTo(before);if(moved>.0001){hero.rotation.y=Math.atan2(dx,dz);gait+=moved*12;}hero.position.y=.06+(moved>.0001?Math.abs(Math.sin(gait))*.035:0);legs.forEach((p,i)=>p.rotation.x=moved>.0001?Math.sin(gait+i*Math.PI)*.45:0);arms.forEach((p,i)=>p.rotation.x=moved>.0001?-Math.sin(gait+i*Math.PI)*.4:0);if(!path.length){targetRing.visible=false;if(cleaningTarget&&Math.hypot(hero.position.x-cleaningTarget.x,hero.position.z-cleaningTarget.z)<.55){scene.remove(cleaningTarget.mesh);dirtSpots.splice(dirtSpots.indexOf(cleaningTarget),1);cleaningTarget=null;window.dispatchEvent(new CustomEvent('kedaiku:dirt-changed',{detail:{count:dirtSpots.length}}));}}renderer.render(scene,camera);requestAnimationFrame(frame);
 }
 function alignAtCashier(){if(cashierArrival&&!path.length){hero.rotation.y=0;cashierArrival=false;window.dispatchEvent(new CustomEvent('kedaiku:cashier'));}requestAnimationFrame(alignAtCashier);}
 requestAnimationFrame(alignAtCashier);
 function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);const aspect=w/h,half=Math.max(12.5,16.5/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.render(scene,camera);}
 function zoomBy(factor){camera.zoom=THREE.MathUtils.clamp(camera.zoom*factor,.65,2.75);camera.updateProjectionMatrix();}
 const panOffset=new THREE.Vector3();
 function panBy(dx,dy){
  const width=canvas.clientWidth,height=canvas.clientHeight;if(!width||!height)return;
  const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
  const up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
  const delta=right.multiplyScalar(-dx*(camera.right-camera.left)/(camera.zoom*width)).add(up.multiplyScalar(dy*(camera.top-camera.bottom)/(camera.zoom*height)));
  const next=panOffset.clone().add(delta);next.clampLength(0,24);camera.position.add(next.clone().sub(panOffset));panOffset.copy(next);camera.updateMatrixWorld();
 }
 function resetZoom(){camera.position.sub(panOffset);panOffset.set(0,0,0);camera.zoom=1;camera.updateProjectionMatrix();camera.updateMatrixWorld();}
 function nearbyStock(){let best=null,distance=1.65;for(const point of stockPoints){const d=Math.hypot(hero.position.x-point.x,hero.position.z-point.z);if(d<distance){best=point;distance=d;}}return best;}
 function screenPosition(point){const projected=new THREE.Vector3(point.x,point.y,point.z).project(camera),rect=canvas.getBoundingClientRect();return{x:rect.left+(projected.x+1)*rect.width/2,y:rect.top+(1-projected.y)*rect.height/2};}
 function setStoreOpen(value){storeOpen=value;spawnClock=0;if(!value&&!customers.length)window.dispatchEvent(new CustomEvent('kedaiku:store-empty'));}
 function beginClosing(){storeOpen=false;spawnClock=Infinity;for(const customer of customers){if(customer.state==='entering'||customer.state==='shopping'){customer.awaiting=false;customer.state='checkout';customer.target={x:21.7,z:15.55};}}if(!customers.length)window.dispatchEvent(new CustomEvent('kedaiku:store-empty'));}
 function setTimeOfDay(hour){
  const phases=[
   {hour:8,bg:'#e7f5ff',sky:'#fff4d9',ground:'#a98d78',sun:'#ffe4b0',sunPower:2.25,skyPower:2.2,exposure:1},
   {hour:12,bg:'#bfe8ff',sky:'#fffaf0',ground:'#9a826e',sun:'#fff1cf',sunPower:3.35,skyPower:2.55,exposure:1.08},
   {hour:17,bg:'#f5d4ae',sky:'#ffe2bc',ground:'#8f735f',sun:'#ffb36c',sunPower:2.15,skyPower:1.9,exposure:.96},
   {hour:20,bg:'#65728d',sky:'#9aa8c6',ground:'#4f4850',sun:'#ffab70',sunPower:.85,skyPower:1.25,exposure:.82},
   {hour:22,bg:'#202a43',sky:'#657292',ground:'#302f3b',sun:'#8faeff',sunPower:.4,skyPower:.95,exposure:.72}
  ];
  let from=phases[0],to=phases.at(-1);for(let i=0;i<phases.length-1;i++)if(hour>=phases[i].hour&&hour<=phases[i+1].hour){from=phases[i];to=phases[i+1];break;}
  const mix=THREE.MathUtils.clamp((hour-from.hour)/(to.hour-from.hour||1),0,1),blend=(a,b)=>new THREE.Color(a).lerp(new THREE.Color(b),mix);
  scene.background=blend(from.bg,to.bg);skyLight.color.copy(blend(from.sky,to.sky));skyLight.groundColor.copy(blend(from.ground,to.ground));skyLight.intensity=THREE.MathUtils.lerp(from.skyPower,to.skyPower,mix);sun.color.copy(blend(from.sun,to.sun));sun.intensity=THREE.MathUtils.lerp(from.sunPower,to.sunPower,mix);renderer.toneMappingExposure=THREE.MathUtils.lerp(from.exposure,to.exposure,mix);document.body.style.backgroundColor=`#${scene.background.getHexString()}`;
 }
 function customerStats(){return{active:customers.length,waiting:customers.filter(item=>item.state==='waiting').length,dirt:dirtSpots.length};}
 new ResizeObserver(resize).observe(canvas);resize();setTimeOfDay(8);requestAnimationFrame(frame);return{scene,renderer,click,setStick,zoomBy,resetZoom,panBy,nearbyStock,screenPosition,setStoreOpen,beginClosing,setTimeOfDay,resolveCustomerRequest,serveNextCustomer,customerStats};
}
window.Shop3D={create};

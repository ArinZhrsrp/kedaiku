// Simple 3D versions of the stock fixtures, holding real product meshes that disappear one by
// one as stock drops. An alternative to the painted HD fixture sprites; scene3d.js toggles them.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// station: [fixture kind, product shape, footprint width, footprint depth, palette]
const STATIONS={
 produce:['crates','round',1.9,1.05,[0xd83b2d,0x8cc63f,0xf39a1e,0xe0452f,0xf6d743,0x5aa63c]],
 herbs:['plants','plant',1.8,.95,[0x4e9a3a,0x6db54a,0x3f8a4d,0x7a4f9a]],
 lifestyle:['plants','plant',1.75,.9,[0xe25d8a,0xf0c43b,0x8b6fd1,0x4e9a3a,0xf7f2ea]],
 drink:['fridge','bottle',1.85,.7,[0xf28c28,0xd8382e,0x4aa3df,0x5cb85c,0xf2c230]],
 dairy:['fridge','carton',1.85,.7,[0xf4f4f0,0x8fc3e8,0xf5b6c8,0xf7e08a,0x9ccf7a]],
 icecream:['freezer','tub',1.85,.85,[0xf7b6c9,0xa8e0c4,0x8b5a3c,0xf4e3a1,0xc7a7e8]],
 frozen:['freezer','flat',1.85,.85,[0xe5483a,0x2f7fd0,0x3aa35a,0xf0b429,0x8e5bd0]],
 snack:['rack','bag',1.55,.75,[0xe53935,0x1e6fd9,0x2fa34a,0xf5c518,0x8e44ad]],
 confectionery:['rack','jar',1.55,.75,[0xe85d9a,0x7b4a2f,0xf2a03d,0x5cc2d6,0xe94b3c]],
 groceries:['rack','jar',1.55,.75,[0xc0392b,0xe67e22,0xf1c40f,0x795548,0x27ae60]],
 instant:['rack','cup',1.55,.75,[0xe53935,0xf5c518,0x43a047,0xf57c00,0x1e88e5]],
 rice:['rack','sack',1.55,.75,[0xe8d7b0,0xd9c49a,0xf3ead2,0xc9a86a]],
 beverage:['rack','bottle',1.55,.75,[0xc0392b,0xf39c12,0x27ae60,0xf1c40f,0x8e44ad]],
 water:['rack','bottle',1.55,.75,[0x9fd3f0,0x7cc0ea,0x2ecc71,0xe74c3c,0xf39c12]],
 bakery:['rack','loaf',1.8,.9,[0xc8843e,0xd99a4e,0xb5702f,0xe8b56a]],
 deli:['counter','tray',1.8,.9,[0xd98e3a,0xa0522d,0xf2c14e,0x6b8e23,0xc0392b]],
 meat:['counter','tray',1.8,.9,[0xc0392b,0xe57373,0xb03a2e,0xf2a7a0]],
 seafood:['counter','tray',1.8,.9,[0xf08a5d,0xb0c4de,0xf4a261,0x7f8c8d,0xe76f51]],
 home:['rack','box',1.55,.75,[0xf7f7f2,0x8fc3e8,0xf5f0e1,0x6fcf97]],
 cleaning:['rack','bottle',1.55,.75,[0x1e6fd9,0xf5c518,0x2fa34a,0x8e44ad,0xf7f7f2]],
 care:['rack','bottle',1.55,.75,[0xf7a8c4,0x8fd3f0,0xf6c85f,0xa3e4a1,0xf7f7f2]],
 beauty:['rack','jar',1.55,.75,[0xf7c6d9,0xe8a0bf,0xf5e1c8,0xd4af37,0xc9b6e4]],
 health:['rack','jar',1.55,.75,[0xf7f7f2,0x8b4513,0xe74c3c,0x3498db,0x2ecc71]],
 baby:['rack','box',1.55,.75,[0x8fd3c7,0x9cc3f0,0xf7b6c9,0xf7e08a,0xc7a7e8]],
 pet:['rack','box',1.55,.75,[0xe53935,0x1e6fd9,0xf5c518,0x8e44ad,0x43a047]],
 promo:['rack','box',1.65,.82,[0xe53935,0xf5c518,0x1e88e5,0x43a047,0xff7043]],
 magazine:['rack','book',1.5,.72,[0x5dade2,0xf1948a,0xf7dc6f,0x82e0aa,0xbb8fce]]
};

// Product shapes: body geometry plus an optional second part (cap, lid, leaves...) with its offset.
const SHAPES={
 box:{body:[.16,.24,.12],top:null},
 bag:{body:[.17,.25,.07],top:null},
 book:{body:[.19,.26,.03],top:null},
 carton:{body:[.1,.2,.1],top:null},
 flat:{body:[.2,.07,.14],top:null},
 sack:{body:'sack',top:null},
 bottle:{body:'bottle',top:{geo:'cap',y:.15,color:0xffffff}},
 jar:{body:'jar',top:{geo:'lid',y:.095,color:0xd4af37}},
 cup:{body:'cup',top:{geo:'cupLid',y:.07,color:0xf4f1ea}},
 tub:{body:'tub',top:null},
 round:{body:'ball',top:null},
 loaf:{body:'loaf',top:null},
 plant:{body:'pot',top:{geo:'leaves',y:.13,color:'self'}},
 tray:{body:'tray',top:{geo:'food',y:.035,color:'self'}}
};
function geometry(spec){
 if(Array.isArray(spec))return new RoundedBoxGeometry(...spec,2,.015);
 switch(spec){
  case'bottle':return new THREE.CylinderGeometry(.045,.05,.26,12).translate(0,0,0);
  case'cap':return new THREE.CylinderGeometry(.025,.025,.04,10);
  case'jar':return new THREE.CylinderGeometry(.065,.065,.17,14);
  case'lid':return new THREE.CylinderGeometry(.068,.068,.03,14);
  case'cup':return new THREE.CylinderGeometry(.07,.05,.13,14);
  case'cupLid':return new THREE.CylinderGeometry(.072,.072,.015,14);
  case'tub':return new THREE.CylinderGeometry(.075,.065,.09,14);
  case'ball':return new THREE.SphereGeometry(.075,12,10);
  case'loaf':return new THREE.SphereGeometry(.09,12,10).scale(1.25,.75,.85);
  case'sack':return new THREE.SphereGeometry(.12,12,10).scale(.9,1.15,.8);
  case'pot':return new THREE.CylinderGeometry(.065,.05,.11,12);
  case'leaves':return new THREE.SphereGeometry(.1,10,8).scale(1,.9,1);
  case'tray':return new THREE.BoxGeometry(.32,.04,.24);
  case'food':return new THREE.BoxGeometry(.27,.05,.19);
 }
}
const shapeHeight={box:.24,bag:.25,book:.26,carton:.2,flat:.07,sack:.27,bottle:.26,jar:.17,cup:.13,tub:.09,round:.15,loaf:.13,plant:.11,tray:.04};

function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}

export function createShelves3D(scene,points){
 const root=new THREE.Group();root.visible=false;scene.add(root);
 const materials=new Map(),mat=(color,opts={})=>{const key=`${color}:${JSON.stringify(opts)}`;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.75,...opts}));return materials.get(key);};
 const wood=mat(0xc98c52),woodDark=mat(0x9b6a3c),metal=mat(0xd9dee2,{roughness:.4,metalness:.3}),darkMetal=mat(0x4b5560,{roughness:.5,metalness:.3});
 const glass=new THREE.MeshStandardMaterial({color:0xcfefff,transparent:true,opacity:.18,roughness:.05,depthWrite:false});
 const fixtures=new Map();

 function part(group,x,y,z,w,h,d,material,r=.02){const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/2,h/2,d/2)),material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=material!==glass;group.add(m);return m;}

 // Each builder adds the fixture body and returns product slots {x,y,z} (slot y = shelf surface).
 const builders={
  rack(g,w,d){
   // Three stepped tiers rising towards the back, like the painted racks.
   const td=d/3,slots=[];part(g,0,.05,0,w,.1,d,woodDark);
   for(let i=0;i<3;i++){
    const y=.28+i*.42,zc=d/2-td/2-i*td;
    part(g,0,y/2,zc,w-.08,y,td,wood,.03);
    part(g,0,y+.04,zc+td/2-.02,w-.06,.08,.04,woodDark);
    const cols=Math.max(5,Math.round((w-.2)/.2));
    for(let c=0;c<cols;c++)for(const dz of [.07,-.08])slots.push({x:-w/2+.12+c*(w-.24)/(cols-1),y,z:zc+dz});
   }
   part(g,-w/2+.03,.85,-d/2+td,.06,1.6,d*.75,woodDark);part(g,w/2-.03,.85,-d/2+td,.06,1.6,d*.75,woodDark);
   part(g,0,.95,-d/2+.03,w,1.75,.06,wood);
   return slots;
  },
  crates(g,w,d){
   const slots=[],td=d/3;
   for(let i=0;i<3;i++){
    const y=.3+i*.38,zc=d/2-td/2-i*td;
    part(g,0,y/2,zc,w-.06,y,td,woodDark,.03);
    for(let k=0;k<3;k++){const cx=-w/3+k*w/3;part(g,cx,y+.06,zc,w/3-.05,.12,td-.04,wood,.02);
     for(let a=0;a<3;a++)for(let b=0;b<2;b++)slots.push({x:cx-.13+a*.13,y:y+.03,z:zc-.06+b*.12,group:k+i*3});}
   }
   return slots;
  },
  plants(g,w,d){return builders.rack(g,w,d).filter((s,i)=>i%2===0);},
  fridge(g,w,d){
   const slots=[],h=2;
   // Cabinet: back, sides, top and base, open at the front behind a framed glass door.
   part(g,0,h/2,-d/2+.03,w,h,.06,metal,.02);part(g,-w/2+.03,h/2,0,.06,h,d,metal,.02);part(g,w/2-.03,h/2,0,.06,h,d,metal,.02);
   part(g,0,h-.07,0,w,.14,d,metal,.03);part(g,0,.09,0,w,.18,d,darkMetal,.03);
   for(const x of [-w/2+.05,0,w/2-.05])part(g,x,h/2+.02,d/2-.02,.04,h-.3,.04,darkMetal,.01);
   part(g,.07,h/2,d/2+.01,.03,.4,.04,mat(0xbfc6cc,{metalness:.6,roughness:.3}),.01);
   const inner=new THREE.Mesh(new THREE.BoxGeometry(w-.14,h-.32,d-.12),new THREE.MeshStandardMaterial({color:0xeaf6ff,emissive:0x9cc9e6,emissiveIntensity:.35,side:THREE.BackSide}));inner.position.set(0,h/2+.02,.03);g.add(inner);
   for(let s=0;s<4;s++){const y=.32+s*.42;part(g,0,y,.04,w-.16,.025,d-.16,metal,.01);for(let c=0;c<7;c++)slots.push({x:-w/2+.17+c*(w-.34)/6,y:y+.013,z:.1});}
   part(g,0,h/2+.02,d/2-.01,w-.1,h-.28,.02,glass);part(g,0,h-.08,d/2,w,.14,.04,mat(0x2f6fb0));
   return slots;
  },
  freezer(g,w,d){
   const slots=[];part(g,0,.38,0,w,.76,d,metal,.08);part(g,0,.79,0,w-.1,.02,d-.1,mat(0xdff3ff,{emissive:0x9cc9e6,emissiveIntensity:.3}),.01);
   // Raised rim around the open top, then products sit in the well.
   part(g,0,.86,d/2-.04,w,.16,.08,darkMetal,.02);part(g,0,.86,-d/2+.04,w,.16,.08,darkMetal,.02);
   part(g,-w/2+.04,.86,0,.08,.16,d,darkMetal,.02);part(g,w/2-.04,.86,0,.08,.16,d,darkMetal,.02);
   for(let r=0;r<3;r++)for(let c=0;c<7;c++)slots.push({x:-w/2+.18+c*(w-.36)/6,y:.8,z:-d/2+.17+r*(d-.34)/2});
   part(g,0,.95,0,w-.1,.02,d-.1,glass);
   return slots;
  },
  counter(g,w,d){
   const slots=[];part(g,0,.38,0,w,.76,d,mat(0xb87a45),.05);part(g,0,.78,0,w,.04,d,metal,.02);
   for(let r=0;r<2;r++)for(let c=0;c<5;c++)slots.push({x:-w/2+.2+c*(w-.4)/4,y:.8,z:-d/2+.25+r*(d-.5)});
   const front=part(g,0,1.0,d/2-.12,w-.04,.42,.02,glass);front.rotation.x=-.45;part(g,0,1.22,-.05,w-.04,.02,d*.6,glass);
   return slots;
  }
 };

 for(const point of points){
  const spec=STATIONS[point.id];if(!spec)continue;
  const [kind,shapeName,w,d,palette]=spec,g=new THREE.Group();g.position.set(point.x,.06,point.z);root.add(g);
  const slots=builders[kind](g,w,d),shape=SHAPES[shapeName],random=rng(point.id.length*131+slots.length);
  // Removal order is random; instances are written in that order so `count` hides the rest.
  const order=slots.map((s,i)=>i).sort(()=>random()-.5);
  const body=new THREE.InstancedMesh(geometry(shape.body),mat(0xffffff),slots.length);body.castShadow=true;g.add(body);
  const top=shape.top?new THREE.InstancedMesh(geometry(shape.top.geo),mat(0xffffff),slots.length):null;if(top){top.castShadow=true;g.add(top);}
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),color=new THREE.Color(),h=shapeHeight[shapeName],euler=new THREE.Euler();
  order.forEach((slotIndex,i)=>{
   const s=slots[slotIndex],tint=palette[(s.group??Math.floor(random()*palette.length))%palette.length];
   euler.set(shapeName==='book'?-.25:0,(random()-.5)*.25,0);q.setFromEuler(euler);
   const y=s.y+(shapeName==='plant'?h/2:h/2);
   m.compose(new THREE.Vector3(s.x,y,s.z),q,new THREE.Vector3(1,1,1));body.setMatrixAt(i,m);
   const bodyColor=shapeName==='plant'?0xc8693e:shapeName==='tray'?0xc9ced3:tint;body.setColorAt(i,color.set(bodyColor));
   if(top){m.compose(new THREE.Vector3(s.x,y+shape.top.y,s.z),q,new THREE.Vector3(1,1,1));top.setMatrixAt(i,m);top.setColorAt(i,color.set(shape.top.color==='self'?tint:shape.top.color));}
  });
  fixtures.set(point.id,{body,top,total:slots.length});
 }

 return{
  root,
  setLevel(id,ratio){const f=fixtures.get(id);if(!f)return;const count=ratio<=0?0:Math.max(1,Math.round(ratio*f.total));f.body.count=count;if(f.top)f.top.count=count;},
  setVisible(on){root.visible=on;}
 };
}

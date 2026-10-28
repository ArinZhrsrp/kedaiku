import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const stations = [
  { id: 'counter', x: 1.8, z: 2.45 },
  { id: 'scanner', x: 3.15, z: 2.45 },
  { id: 'shelf', x: 5.7, z: 2.5 },
  { id: 'dispatch', x: 7.25, z: 3.25 },
  { id: 'door', x: 6.55, z: 6.25 },
];
const clay = (color, roughness = .82) => new THREE.MeshPhysicalMaterial({ color, roughness, clearcoat: .12, clearcoatRoughness: .8 });
function mesh(parent, geometry, material, x = 0, y = 0, z = 0) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x, y, z); object.castShadow = true; object.receiveShadow = true;
  parent.add(object); return object;
}
function rounded(parent, x, y, z, w, h, d, color, radius = .08) {
  return mesh(parent, new RoundedBoxGeometry(w, h, d, 4, Math.min(radius, w/2, h/2, d/2)), clay(color), x, y, z);
}
function ball(parent, x, y, z, radius, color, sx = 1, sy = 1, sz = 1) {
  const shape = mesh(parent, new THREE.SphereGeometry(radius, 24, 18), clay(color), x, y, z);
  shape.scale.set(sx, sy, sz); return shape;
}
function curve(parent, points, radius, color) {
  return mesh(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 16, radius, 8, false), clay(color));
}
function sign(text) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d'); ctx.shadowColor = '#b96f5433'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#fff7e7'; ctx.beginPath(); ctx.roundRect(9, 8, 494, 108, 52); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.fillStyle = '#854f43'; ctx.font = '900 55px system-ui';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 256, 65, 460);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, toneMapped: false }));
  sprite.scale.set(1.6, .4, 1); return sprite;
}
function parcelBox(parent, x, y, z, size = 1) {
  const group = new THREE.Group(); group.position.set(x, y, z); group.scale.setScalar(size); parent.add(group);
  rounded(group, 0, .16, 0, .42, .32, .38, 0xd8a371, .035);
  rounded(group, 0, .325, 0, .075, .015, .38, 0xffe2b5, .005);
  rounded(group, .14, .19, .195, .13, .09, .01, 0xfff6e5, .006);
  return group;
}
function pet(kind = 'orange', size = 1) {
  const root = new THREE.Group(); root.scale.setScalar(size);
  const isCat = kind === 'strawberry', isBunny = kind === 'lemon';
  const fruit = isCat ? 0xdd4d68 : isBunny ? 0xf5d86c : 0xe34a4c;
  const cream = isBunny ? 0xffe5a6 : 0xffdfad;
  const dark = 0x3b5145;
  const body = ball(root, 0, .64, 0, .47, fruit, isBunny ? 1.04 : 1.12, isCat ? 1.06 : .97, .94);
  if (isCat) {
    for (const side of [-1, 1]) {
      const ear = mesh(root, new THREE.ConeGeometry(.20, .39, 4), clay(fruit), side*.32, 1.18, .01);
      ear.rotation.z = side * -.22; ear.rotation.y = Math.PI / 4;
      ball(root, side*.32, 1.16, .16, .08, 0xffa8a6, .7, 1.2, .24);
    }
  } else if (isBunny) {
    for (const side of [-1, 1]) {
      const ear = ball(root, side*.27, 1.27, .03, .17, cream, .7, 1.75, .45);
      ear.rotation.z = side*.19;
      const inner = ball(root, side*.27, 1.30, .11, .12, 0xf7af9f, .62, 1.55, .19);
      inner.rotation.z = side*.19;
    }
  } else {
    for (const side of [-1, 1]) {
      const ear = ball(root, side*.53, .79, .015, .24, cream, .7, 1.23, .47);
      ear.rotation.z = side * .24;
    }
  }
  ball(root, -.19, .72, .412, .105, dark, .86, 1.05, .48);
  ball(root, .19, .72, .412, .105, dark, .86, 1.05, .48);
  ball(root, -.215, .755, .465, .029, 0xffffff, 1, 1, .35);
  ball(root, .165, .755, .465, .029, 0xffffff, 1, 1, .35);
  ball(root, 0, .52, .44, .22, cream, 1.28, .72, .55);
  ball(root, 0, .59, .555, .075, dark, 1.1, .8, .52);
  curve(root, [[-.13,.48,.53],[-.055,.44,.55],[0,.48,.56],[.055,.44,.55],[.13,.48,.53]], .012, dark);
  for (const side of [-1, 1]) {
    ball(root, side*.34, .48, .355, .08, isBunny ? 0xf5b5a5 : 0xeaa29a, 1, .45, .35);
    ball(root, side*.37, .46, .394, .014, 0xc66867);
  }
  if (!isBunny) {
    curve(root, [[0,1.09,0],[.03,1.22,0],[.11,1.34,0]], .045, 0x795543);
    const leaf = ball(root, -.12, 1.27, 0, .20, 0x86ca8e, 1.08, .48, .55);
    leaf.rotation.z = -.35;
  }
  const paws = [];
  for (const side of [-1, 1]) for (const front of [-1, 1]) {
    const joint = new THREE.Group(); joint.position.set(side*.27, .27, front*.25); root.add(joint);
    ball(joint, 0, -.06, .04, .18, cream, .95, .77, 1.04);
    paws.push(joint);
  }
  const tail = ball(root, 0, .45, -.45, .16, cream, .85, .85, 1.1);
  root.userData = { body, paws, tail };
  return root;
}
function pose(character, phase, moving, carrying = false) {
  const { paws, body, tail } = character.userData;
  const step = moving ? Math.sin(phase) : 0;
  paws[0].rotation.x = step*.55; paws[3].rotation.x = step*.55;
  paws[1].rotation.x = -step*.55; paws[2].rotation.x = -step*.55;
  character.position.y = moving ? .035 + Math.abs(step)*.11 : Math.sin(phase*.25)*.012;
  character.rotation.z = moving ? step*.095 : Math.sin(phase*.18)*.015;
  body.rotation.z = moving ? -step*.04 : 0;
  tail.rotation.y = Math.sin(phase*1.8)*.25;
  if (carrying) { paws[2].rotation.x = -.38; paws[3].rotation.x = -.38; }
}
function create(canvas) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
  catch { return null; }
  const media = window.matchMedia('(max-width: 650px)');
  let mobile = media.matches;
  renderer.setSize(mobile ? 720 : 1000, mobile ? 660 : 620, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xffedce);
  function release(group){scene.remove(group);group.traverse(object=>{if(object.isMesh){object.geometry.dispose();object.material.dispose();}});}
  const camera = new THREE.PerspectiveCamera(48, canvas.width / canvas.height, .1, 100);
  const target = new THREE.Vector3(4.35, .2, 4.6);
  let yaw = .58, pitch = .64, overview = false;
  let distance = mobile ? 17 : 16;
  function placeCamera() {
    camera.position.set(target.x + Math.sin(yaw) * distance, target.y + Math.tan(pitch) * distance, target.z + Math.cos(yaw) * distance);
    camera.lookAt(target);
  }
  function orbit(dx, dy = 0) { yaw += dx * .005; pitch = Math.max(.37, Math.min(1.02, pitch + dy * .004)); placeCamera(); }
  function setView(y, p) { if (Number.isFinite(y)) yaw = y; if (Number.isFinite(p)) pitch = Math.max(.37, Math.min(1.02, p)); placeCamera(); }
  function toggleOverview() { overview = !overview; return overview; }
  media.addEventListener('change', event => { mobile = event.matches; renderer.setSize(mobile ? 720 : 1000, mobile ? 660 : 620, false); camera.aspect = canvas.width / canvas.height; distance = mobile ? 17 : 16; camera.updateProjectionMatrix(); placeCamera(); });
  placeCamera();
  scene.add(new THREE.HemisphereLight(0xfff8df, 0xb38371, 1.85));
  const sun = new THREE.DirectionalLight(0xffe5bb, 2.5); sun.position.set(-4, 12, 8); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -16; sun.shadow.camera.right = 16; sun.shadow.camera.top = 16; sun.shadow.camera.bottom = -16; scene.add(sun);
  rounded(scene, 4.7, -.24, 3.9, 11.4, .45, 9.7, 0xf5d8ad, .22);
  const shopTile = clay(0xffefdc), pathTile = clay(0xf7d5bd), outsideTile = clay(0xd7d6ca);
  for (let x = 0; x <= 10; x++) for (let z = 0; z <= 8; z++) {
    const tile = mesh(scene, new RoundedBoxGeometry(.97, .035, .97, 2, .04), x >= 9 ? outsideTile : z >= 7 ? pathTile : shopTile, x, .015, z);
    tile.castShadow = false;
  }
  rounded(scene, 4.15, .94, -.5, 9.5, 1.9, .18, 0xf0c2a7, .07);
  rounded(scene, -.5, .94, 3.3, .18, 1.9, 7.8, 0xf7d2b6, .07);
  rounded(scene, 4.15, 1.94, -.5, 9.5, .12, .26, 0xe2a689, .05);
  const storeSign = sign('KEDAIKU · KEDAI COMEL'); storeSign.position.set(4.8, 1.55, -.32); storeSign.scale.set(2.5, .43, 1); scene.add(storeSign);
  const promo=sign('PROMOSI HARI INI');promo.position.set(2.1,1.55,-.32);promo.scale.set(1.65,.35,1);scene.add(promo);
  for(const [x,z] of [[.1,.55],[.1,5.9],[8.45,.4]]){
    rounded(scene,x,.21,z,.38,.42,.38,0xe8ae8c,.07);
    for(let i=0;i<3;i++){const leaf=ball(scene,x+(i-1)*.13,.58+i*.05,z,.20,0x7fbc82,.5,1.1,.65);leaf.rotation.z=(i-1)*.4;}
  }
  // Order terminal and supplier dock face the back of the store.
  rounded(scene, 1.35, .41, 1.1, 1.65, .82, .88, 0xd4a17f, .12);
  rounded(scene, 1.35, .86, 1.1, 1.75, .12, .96, 0xffead0, .05);
  rounded(scene, 1.35, 1.05, .98, .7, .4, .1, 0x82b4c1, .04);
  rounded(scene, 1.35, 1.06, 1.04, .58, .29, .025, 0xb9e7db, .01);
  rounded(scene, 7.55, .1, .8, 2.35, .2, 2.0, 0xd9baa0, .06);
  for (const [x,z] of [[7.0,.35],[7.7,.35],[8.3,1.1]]) parcelBox(scene, x, .22, z, .8);
  const dockSign=sign('TERIMA STOK');dockSign.position.set(7.6,1.54,-.32);dockSign.scale.set(1.55,.32,1);scene.add(dockSign);
  // Product racks are distinct stations with visible food on each shelf.
  const racks = new Map(), rackItems = new Map();
  const rackData = [
    ['snack',3.1,2.05,0xf2a34c,0xe1a959],['drink',5.1,2.05,0x68a9db,0x8ebed2],
    ['produce',3.1,4.25,0x6eae73,0x91c181],['cold',5.1,4.25,0x83acd6,0xb6d4e4],
    ['bakery',6.9,3.55,0xd5a16c,0xf0c681],['meat',6.9,1.75,0xd68081,0xebb4a1]
  ];
  for (const [id,x,z,color,productColor] of rackData) {
    const group = new THREE.Group(); group.position.set(x, 0, z); scene.add(group); racks.set(id, group);
    const items=[];
    for (const side of [-1,1]) rounded(group, side*.58, .68, 0, .12, 1.35, .62, 0xb78064, .04);
    for (let h = 0; h < 3; h++) {
      rounded(group, 0, .23 + h*.46, 0, 1.25, .085, .72, color, .03);
      for (let i = 0; i < 4; i++) items.push(rounded(group, -.42 + i*.28, .36 + h*.46, 0, .18, .21, .28, productColor, .04));
    }
    const label = sign(id.toUpperCase()); label.position.set(0, 1.59, .36); label.scale.set(.85, .22, 1); group.add(label);
    rackItems.set(id,items);
  }
  const checkout = new THREE.Group(); checkout.position.set(1.5,0,5.45); scene.add(checkout);
  rounded(checkout, 0,.4,0,2.2,.8,.95,0xe7a181,.15);
  rounded(checkout, 0,.86,0,2.3,.12,1.02,0xffecd4,.045);
  rounded(checkout, -.35,1.05,-.05,.58,.34,.12,0x82b5bd,.03);
  rounded(checkout, -.35,1.06,.02,.48,.24,.025,0xc9efdc,.01);
  rounded(checkout,.48,.94,.12,.42,.07,.42,0x56666a,.02);
  rounded(checkout,.76,.96,-.17,.35,.10,.21,0xffd98a,.03);
  rounded(checkout,-.87,.94,.10,.18,.08,.36,0x98c8a8,.02);
  const secondCheckout = checkout.clone(); secondCheckout.position.set(3.45,0,6.35); scene.add(secondCheckout);
  const pack = new THREE.Group(); pack.position.set(7.15,0,5.35); scene.add(pack);
  rounded(pack,0,.41,0,1.8,.82,1.08,0x99b7a0,.14);
  rounded(pack,0,.86,0,1.9,.12,1.15,0xffead0,.04);
  parcelBox(pack,-.42,.93,.03,.65); parcelBox(pack,.38,.93,.03,.57);
  const packSign=sign('ONLINE ORDER');packSign.position.set(0,1.63,-.1);packSign.scale.set(1.7,.35,1);pack.add(packSign);
  const truck = new THREE.Group(); truck.position.set(9.65,0,5.75); scene.add(truck);
  rounded(truck,.18,.75,0,1.5,1.18,1.25,0xf4d7c4,.16);
  rounded(truck,-.72,.53,0,.86,.75,1.18,0xe78d66,.12);
  rounded(truck,-.84,.71,.52,.52,.29,.035,0x9fc8d0,.035);
  rounded(truck,.18,.35,.66,1.35,.12,.035,0xd77d66,.02);
  for(const x of [-.7,.7])for(const z of [-.56,.56]){const wheel=mesh(truck,new THREE.CylinderGeometry(.19,.19,.11,18),clay(0x5a5b5c),x,.23,z);wheel.rotation.x=Math.PI/2;}
  const supplierTruck=truck.clone();supplierTruck.position.set(9.8,0,1.35);supplierTruck.scale.setScalar(.76);scene.add(supplierTruck);
  const secondTruck=truck.clone(); secondTruck.position.set(10.9,0,2.5); scene.add(secondTruck);
  const cleaner = new THREE.Group(); cleaner.position.set(8.8,0,7.8); scene.add(cleaner);
  rounded(cleaner,0,.16,0,.45,.32,.45,0xf7d17c,.1);
  rounded(cleaner,.16,.68,0,.06,.85,.06,0xb3876b,.02);
  const cleanSign=sign('BERSIH');cleanSign.position.set(8.8,1.55,7.8);cleanSign.scale.set(.85,.22,1);scene.add(cleanSign);
  const markers = new Map();
  const stationPlaces={order:[1.35,2.05],dock:[7.5,2.45],snack:[3.1,3.02],drink:[5.1,3.02],produce:[3.1,5.18],cold:[5.1,5.18],bakery:[7.3,4.25],meat:[7.55,2.6],checkout:[1.5,6.47],online:[7.2,6.5],dispatch:[8.55,6.65],clean:[8.2,7.25]};
  for(const [id,[x,z]] of Object.entries(stationPlaces)){
    const ring=mesh(scene,new THREE.TorusGeometry(.25,.025,8,24),clay(id==='clean'?0x76ba8b:0xe88966),x,.06,z);ring.rotation.x=-Math.PI/2;ring.castShadow=false;markers.set(id,ring);
  }
  let hero=pet('orange',.8),heroKind='orange',held=parcelBox(hero,.43,.46,.35,.63);scene.add(hero);held.visible=false;
  let lastX=1.5,lastZ=6.7,gait=0;
  const customers=new Map(), readyBoxes=new Map(), incomingBoxes=new Map(), helpers=new Map();
  function sync(state,time){
    const level=state.level||1;
    racks.get('produce').visible=!!state.furniture?.produce;racks.get('cold').visible=!!state.furniture?.cold;
    racks.get('bakery').visible=level>=11;racks.get('meat').visible=level>=11;
    for(const [id,items] of rackItems)items.forEach((item,i)=>item.visible=i<(state.inventory[id]?.shelf||0));
    secondCheckout.visible=level>=11;pack.visible=level>=7;truck.visible=level>=7;secondTruck.visible=level>=16;
    for(const id of ['produce','cold','bakery','meat'])markers.get(id).visible=racks.get(id).visible;
    markers.get('online').visible=level>=7;markers.get('dispatch').visible=level>=7;
    if(state.avatar!==heroKind){release(hero);heroKind=state.avatar;hero=pet(heroKind,.8);scene.add(hero);held=parcelBox(hero,.43,.46,.35,.63);held.visible=false;}
    const dx=state.player.x-lastX,dz=state.player.z-lastZ,moving=Math.hypot(dx,dz)>.002;
    if(moving){gait+=Math.hypot(dx,dz)*13;hero.rotation.y=Math.atan2(dx,dz);}lastX=state.player.x;lastZ=state.player.z;
    hero.position.set(state.player.x,0,state.player.z);pose(hero,gait,moving,!!state.carrying);held.visible=!!state.carrying;
    const wanted=new Set();
    state.customers.forEach((c,i)=>{
      wanted.add(c.id);let model=customers.get(c.id);
      if(!model){model=pet(['orange','strawberry','lemon'][c.id%3],.7);customers.set(c.id,model);scene.add(model);model.position.set(.5,0,7.65);}
      const shelfPoint={snack:[3.1,3.25],drink:[5.1,3.25],produce:[3.1,5.45],cold:[5.1,5.45]}[c.product]||[3.1,3.25];const destination=c.phase==='shopping'?{x:shelfPoint[0],z:shelfPoint[1]}:{x:.65+state.customers.filter(v=>v.phase==='checkout').findIndex(v=>v.id===c.id)*.55,z:7.2};
      model.position.lerp(new THREE.Vector3(destination.x,0,destination.z),.07);pose(model,time*3+i,c.phase==='shopping');
    });
    for(const [id,model] of customers)if(!wanted.has(id)){release(model);customers.delete(id);}
    const ready=state.onlineReady.slice(0,6),readyIds=new Set(ready.map(o=>o.id));
    for(const [id,box] of readyBoxes)if(!readyIds.has(id)){release(box);readyBoxes.delete(id);}
    ready.forEach((order,i)=>{let box=readyBoxes.get(order.id);if(!box){box=parcelBox(scene,0,0,0,.55);readyBoxes.set(order.id,box);}box.position.set(6.65+(i%3)*.38,.85+Math.floor(i/3)*.3,5.3);});
    const incoming=state.incoming.filter(o=>o.eta<=0).slice(0,7),incomingIds=new Set(incoming.map(o=>o.id));
    for(const [id,box] of incomingBoxes)if(!incomingIds.has(id)){release(box);incomingBoxes.delete(id);}
    incoming.forEach((order,i)=>{let box=incomingBoxes.get(order.id);if(!box){box=parcelBox(scene,0,0,0,.62);incomingBoxes.set(order.id,box);}box.position.set(7+(i%3)*.43,.18+Math.floor(i/3)*.32,.35);});
    for(const [role,x,z,kind] of [['cashier',.65,5.2,'lemon'],['stocker',4,1.05,'strawberry'],['cleaner',7.9,7.2,'orange'],['rider',9,7.3,'lemon']]){
      let model=helpers.get(role);
      if(state.staff[role]){if(!model){model=pet(kind,.72);helpers.set(role,model);scene.add(model);}model.position.set(x,0,z);pose(model,time*2,false);}else if(model){release(model);helpers.delete(role);}
    }
    const spill=state.spill;
    if(spill){if(!scene.userData.spill){const puddle=mesh(scene,new THREE.CircleGeometry(.35,24),clay(0xc98a6b),0,.047,0);puddle.rotation.x=-Math.PI/2;scene.userData.spill=puddle;}scene.userData.spill.position.set(spill.x,.047,spill.z);scene.userData.spill.visible=true;}
    else if(scene.userData.spill)scene.userData.spill.visible=false;
    markers.get('clean').position.set(spill?.x??8.2,.06,spill?.z??7.25);
  }
  const point=new THREE.Vector3();
  function screenPosition(x,z){point.set(x,.55,z).project(camera);return{x:(point.x+1)*canvas.width/2,y:(1-point.y)*canvas.height/2};}
  function update(state,time){
    sync(state,time);
    const want=overview?new THREE.Vector3(5.1,.2,4.7):new THREE.Vector3(state.player.x*.08+4.4*.92,.2,state.player.z*.08+4.55*.92);
    target.lerp(want,.055);
    const zoom=overview?(mobile?1.12:1.18):(mobile?2.02:1.82);
    camera.zoom+=(zoom-camera.zoom)*.07;camera.updateProjectionMatrix();placeCamera();
    const light=Math.max(0,Math.min(1,state.dayLeft/210));sun.intensity=state.open?2.1+light*.4:1.7;
    scene.background.setHex(state.open&&light<.2?0xffd5b9:0xffedce);renderer.render(scene,camera);
  }
  return {update,screenPosition,orbit,setView,toggleOverview,getView:()=>({yaw,pitch,overview}),renderer};
}
window.Shop3D={create};

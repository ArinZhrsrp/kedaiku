import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
function create(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#fff0db');
 const camera=new THREE.OrthographicCamera(-8,8,6,-6,.1,100);camera.position.set(13,14,18);camera.lookAt(4.5,0,3.5);
 scene.add(new THREE.HemisphereLight(0xfff7e6,0x9e8270,2.4));
 const sun=new THREE.DirectionalLight(0xffedcd,3);sun.position.set(-3,12,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15});scene.add(sun);
 function box(name,x,y,z,w,h,d,color,r=.04){const obj=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,r),new THREE.MeshStandardMaterial({color,roughness:.85}));obj.name=name;obj.position.set(x,y,z);obj.castShadow=obj.receiveShadow=true;scene.add(obj);}
 box('Floor base',4.5,-.2,3.5,10.2,.4,8.2,0xe5c7a0,.12);
 for(let x=0;x<10;x++)for(let z=0;z<8;z++)box('Floor tile',x,.02,z,.98,.04,.98,(x+z)%2?0xf3e7d2:0xfaf1df,.015);
 box('Back wall',4.5,1.2,-.5,10.2,2.4,.18,0xe6c3a2);
 box('Left wall',-.5,1.2,3.5,.18,2.4,8.2,0xefd3b5);
 box('Wall trim',4.5,2.42,-.5,10.3,.12,.25,0xcfa17f);
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
 for(const z of [1.6,3.8]){
  box('Left window frame',-.35,1.4,z,.15,1.25,1.9,0xffefd5);
  box('Left window glass',-.24,1.4,z,.06,1.04,1.69,0xa6d8df);
  box('Left window mullion',-.18,1.4,z,.05,1.08,.07,0xffefd5);
  box('Left window sill',-.17,.76,z,.3,.1,2.02,0xffefd5);
 }
 for(const x of [1.6,4.3,7]){
  box('Window frame',x,1.4,-.35,1.9,1.25,.15,0xffefd5);
  box('Window glass',x,1.4,-.24,1.69,1.04,.06,0xa6d8df);
  box('Window mullion',x,1.4,-.18,.07,1.08,.05,0xffefd5);
  box('Window sill',x,.76,-.17,2.02,.1,.3,0xffefd5);
 }
 const obstacles=[[5.45,8.75,5,6.8]];
 function sphere(parent,x,y,z,r,color,sx=1,sy=1,sz=1){const m=new THREE.Mesh(new THREE.SphereGeometry(r,20,16),new THREE.MeshStandardMaterial({color,roughness:.85}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
 for(const [x,z] of [[.2,.3],[8.65,.35],[8.7,6.8]]){
  box('Plant pot',x,.24,z,.48,.48,.48,0xcc9274,.08);
  box('Plant trunk',x,.66,z,.09,.65,.09,0x9b7752);
  sphere(scene,x,.98,z,.38,0x6fa978,1,1.3,1);
  sphere(scene,x-.22,.82,z+.08,.26,0x87b782);
  sphere(scene,x+.24,.89,z-.04,.26,0x91bf83);
  obstacles.push([x-.5,x+.5,z-.5,z+.5]);
 }
 const hero=new THREE.Group();hero.position.set(4.5,.06,3.5);scene.add(hero);
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
 const canStand=(x,z)=>x>=-.12&&x<=9.12&&z>=-.12&&z<=7.12&&!obstacles.some(([a,b,c,d])=>x>a&&x<b&&z>c&&z<d);
 let path=[],stick={x:0,y:0},cashierArrival=false;
 function walkTo(x,z){
  const step=.2,n=47,key=(x,z)=>z*n+x,grid=v=>Math.max(0,Math.min(46,Math.round(v/step)));
  if(!canStand(x,z))return;
  cashierArrival=false;
  const start=key(grid(hero.position.x),grid(hero.position.z)),goal=key(grid(x),grid(z)),queue=[start],prev=new Map([[start,null]]);
  for(let i=0;i<queue.length;i++){const at=queue[i];if(at===goal)break;const a=at%n,b=Math.floor(at/n);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const c=a+dx,d=b+dz,k=key(c,d);if(c<0||c>=n||d<0||d>=n||prev.has(k)||!canStand(c*step,d*step))continue;prev.set(k,at);queue.push(k);}}
  if(!prev.has(goal))return;
  path=[];for(let at=goal;at!==start;at=prev.get(at))path.push({x:(at%n)*step,z:Math.floor(at/n)*step});path.reverse();path.push({x,z});targetRing.position.set(x,.065,z);targetRing.visible=true;
 }
 const ray=new THREE.Raycaster(),floor=new THREE.Plane(new THREE.Vector3(0,1,0),-.06);
 const counterParts=scene.children.filter(obj=>['Cashier counter','Counter top','Cashier screen','Screen display','Scanner'].includes(obj.name));
 function click(clientX,clientY){const rect=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1),camera);if(ray.intersectObjects(counterParts).length){walkTo(7.1,4.65);cashierArrival=true;return;}const p=ray.ray.intersectPlane(floor,new THREE.Vector3());if(p)walkTo(p.x,p.z);}
 function setStick(x,y){stick={x,y};if(x||y){path=[];cashierArrival=false;targetRing.visible=false;}}
 let last=0,gait=0;
 function frame(time){const dt=Math.min((time-last)/1000||0,.04);last=time;let dx=0,dz=0;const manual=Math.hypot(stick.x,stick.y);if(manual>.08){const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);const forward=new THREE.Vector3().subVectors(camera.position,new THREE.Vector3(4.5,0,3.5));forward.y=0;forward.normalize();dx=right.x*stick.x+forward.x*stick.y;dz=right.z*stick.x+forward.z*stick.y;}else if(path.length){const p=path[0],dist=Math.hypot(p.x-hero.position.x,p.z-hero.position.z);if(dist<.04)path.shift();else{const speed=Math.min(1,dist/(dt*2.5||1));dx=(p.x-hero.position.x)/dist*speed;dz=(p.z-hero.position.z)/dist*speed;}}
  const before=hero.position.clone(),x=hero.position.x+dx*dt*2.5,z=hero.position.z+dz*dt*2.5;if(canStand(x,hero.position.z))hero.position.x=x;if(canStand(hero.position.x,z))hero.position.z=z;const moved=hero.position.distanceTo(before);if(moved>.0001){hero.rotation.y=Math.atan2(dx,dz);gait+=moved*12;}hero.position.y=.06+(moved>.0001?Math.abs(Math.sin(gait))*.035:0);legs.forEach((p,i)=>p.rotation.x=moved>.0001?Math.sin(gait+i*Math.PI)*.45:0);arms.forEach((p,i)=>p.rotation.x=moved>.0001?-Math.sin(gait+i*Math.PI)*.4:0);if(!path.length)targetRing.visible=false;renderer.render(scene,camera);requestAnimationFrame(frame);
 }
 function alignAtCashier(){if(cashierArrival&&!path.length){hero.rotation.y=0;cashierArrival=false;}requestAnimationFrame(alignAtCashier);}
 requestAnimationFrame(alignAtCashier);
 function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);const aspect=w/h,half=aspect<1?8:6;camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.render(scene,camera);}
 new ResizeObserver(resize).observe(canvas);resize();requestAnimationFrame(frame);return{scene,renderer,click,setStick};
}
window.Shop3D={create};

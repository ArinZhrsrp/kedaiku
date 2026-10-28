try{
 const canvas=document.getElementById('world3d'),game=window.Shop3D.create(canvas);
 const pointers=new Map();let pinched=false;
 function pinchDistance(){const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y);}
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,type:e.pointerType,dragged:false});if(pointers.size>1)pinched=true;});
 canvas.addEventListener('pointermove',e=>{const p=pointers.get(e.pointerId);if(!p)return;const before=pointers.size===2?pinchDistance():0,dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(Math.hypot(p.x-p.startX,p.y-p.startY)>=8)p.dragged=true;if(before>0&&pointers.size===2){game.panBy(dx/2,dy/2);game.zoomBy(pinchDistance()/before);}else if(pointers.size===1&&p.type!=='touch'&&p.dragged&&!pinched){game.panBy(dx,dy);canvas.style.cursor='grabbing';}});
 function endPointer(e){const p=pointers.get(e.pointerId);if(!p)return;if(e.type==='pointerup'&&!pinched&&!p.dragged&&Math.hypot(e.clientX-p.startX,e.clientY-p.startY)<8)game.click(e.clientX,e.clientY);pointers.delete(e.pointerId);if(!pointers.size){pinched=false;canvas.style.cursor='grab';}}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,endPointer);
 canvas.addEventListener('wheel',e=>{e.preventDefault();const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?canvas.clientHeight:1);game.zoomBy(Math.exp(-Math.max(-150,Math.min(150,delta))*.0015));},{passive:false});
 document.getElementById('zoom-in').onclick=()=>game.zoomBy(1.2);
 document.getElementById('zoom-out').onclick=()=>game.zoomBy(1/1.2);
 document.getElementById('zoom-reset').onclick=()=>game.resetZoom();
 const pad=document.getElementById('joystick'),knob=document.getElementById('joystick-knob');let active=null;
 const held=new Set();let joystick={x:0,y:0};
 function applyMovement(){let x=Number(held.has('KeyD'))-Number(held.has('KeyA')),y=Number(held.has('KeyS'))-Number(held.has('KeyW'));if(x||y){const length=Math.hypot(x,y);game.setStick(x/length,y/length);}else game.setStick(joystick.x,joystick.y);}
 function keyboard(e,pressed){if(!['KeyW','KeyA','KeyS','KeyD'].includes(e.code)||e.ctrlKey||e.metaKey||e.altKey||e.target?.closest('input,textarea,select,[contenteditable="true"]'))return;e.preventDefault();if(pressed)held.add(e.code);else held.delete(e.code);applyMovement();}
 window.addEventListener('keydown',e=>keyboard(e,true));
 window.addEventListener('keyup',e=>keyboard(e,false));
 function update(e){if(e.pointerId!==active)return;const r=pad.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),scale=Math.min(1,36/(d||1));const x=dx*scale,y=dy*scale;knob.style.transform=`translate(${x}px,${y}px)`;joystick={x:x/36,y:y/36};applyMovement();}
 pad.addEventListener('pointerdown',e=>{if(active!==null)return;e.preventDefault();active=e.pointerId;pad.setPointerCapture(active);update(e);});
 pad.addEventListener('pointermove',update);
 function reset(e){if(e&&e.pointerId!==active)return;active=null;knob.style.transform='translate(0,0)';joystick={x:0,y:0};applyMovement();}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(event,reset);
 function clearInput(){held.clear();reset();pointers.clear();pinched=false;}
 window.addEventListener('blur',clearInput);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInput();});
 canvas.style.cursor='grab';
 document.querySelector('.move-hint').textContent='WASD / klik: gerak · Drag / 2 jari: alih view';
}
catch(error){document.getElementById('scene-error').hidden=false;console.error(error);}

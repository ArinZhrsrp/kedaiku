try{
 const canvas=document.getElementById('world3d'),game=window.Shop3D.create(canvas);
 canvas.addEventListener('pointerdown',e=>game.click(e.clientX,e.clientY));
 const pad=document.getElementById('joystick'),knob=document.getElementById('joystick-knob');let active=null;
 function update(e){if(e.pointerId!==active)return;const r=pad.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),scale=Math.min(1,36/(d||1));const x=dx*scale,y=dy*scale;knob.style.transform=`translate(${x}px,${y}px)`;game.setStick(x/36,y/36);}
 pad.addEventListener('pointerdown',e=>{if(active!==null)return;e.preventDefault();active=e.pointerId;pad.setPointerCapture(active);update(e);});
 pad.addEventListener('pointermove',update);
 function reset(e){if(e&&e.pointerId!==active)return;active=null;knob.style.transform='translate(0,0)';game.setStick(0,0);}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(event,reset);
 window.addEventListener('blur',()=>reset());
}
catch(error){document.getElementById('scene-error').hidden=false;console.error(error);}

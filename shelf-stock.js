// Makes the painted HD fixtures look emptier as stock drops, using an "empty shelf" version of
// each image (assets/equipment-hd/empty/<same file name>). Product pixels are wherever the full
// and empty images differ; they are grouped into slots and swapped to the empty art one slot at
// a time, so products disappear individually instead of the whole rack fading.
//
// Slots come from SHELF_LAYOUTS when the image has one (product rows traced on the art), else
// from an even grid over the changed area. Layout row format, in original image pixels:
// [ax, ay, bx, by, height, slots, mode, shelves] — A→B is the bottom edge of the products and the
// row extends straight up by `height`. 'u' rows lose whole products along the row; 'v' bins
// (loose produce) lose their pile from the top down; 'g' (chiller doors) is a grid of `slots`
// products across by `shelves` shelves down.
import { SHELF_LAYOUTS } from './shelf-layouts.js';

const MAX_WIDTH=512;

function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}

// Assigns every pixel to a slot (1-based, 0 = none). Returns {slotOf, slots, rows}.
function layoutSlots(file,W,H,scale,changed){
 const N=W*H,slotOf=new Uint16Array(N),slots=[];
 let rows=SHELF_LAYOUTS[file];
 if(!rows){
  // No traced layout: split the changed area's bounding box into an even grid.
  let x0=W,y0=H,x1=0,y1=0;for(let p=0;p<N;p++)if(changed[p]){const x=p%W,y=(p-x)/W;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  if(x1<=x0||y1<=y0)return{slotOf,slots,rows:[]};
  rows=[[x0/scale,(y1+1)/scale,(x1+1)/scale,(y1+1)/scale,(y1+1-y0)/scale,6,'g',4]];
 }
 rows.forEach(([ax,ay,bx,by,h,across,mode='u',shelves=1],rowIndex)=>{
  const n=mode==='g'?across*shelves:across;
  ax*=scale;ay*=scale;bx*=scale;by*=scale;h*=scale;
  const first=slots.length;for(let k=0;k<n;k++)slots.push({row:rowIndex,pixels:null});
  const ux=bx-ax,uy=by-ay,minX=Math.max(0,Math.floor(Math.min(ax,bx))),maxX=Math.min(W-1,Math.ceil(Math.max(ax,bx)));
  const minY=Math.max(0,Math.floor(Math.min(ay,by)-h)),maxY=Math.min(H-1,Math.ceil(Math.max(ay,by)));
  for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
   const u=(x-ax)/ux;if(u<0||u>=1)continue;
   const v=(ay+u*uy-y)/h;if(v<0||v>=1)continue;
   const p=y*W+x;if(slotOf[p])continue;
   const k=mode==='v'?Math.min(n-1,Math.floor((1-v)*n)):mode==='g'?Math.floor(u*across)+across*Math.min(shelves-1,Math.floor((1-v)*shelves)):Math.floor(u*n);
   slotOf[p]=first+k+1;
  }
 });
 return{slotOf,slots,rows};
}

// Returns {canvas, setLevel(ratio)} or null when the images' pixels can't be read.
export function createShelfStock(file,fullImage,emptyImage){
 const scale=Math.min(1,MAX_WIDTH/fullImage.width),W=Math.round(fullImage.width*scale),H=Math.round(fullImage.height*scale),N=W*H;
 const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 let full,empty;
 try{
  ctx.drawImage(emptyImage,0,0,W,H);empty=ctx.getImageData(0,0,W,H).data;
  ctx.clearRect(0,0,W,H);ctx.drawImage(fullImage,0,0,W,H);full=ctx.getImageData(0,0,W,H).data;
 }catch{return null;}

 // Changed pixels, cleaned with a 5x5 majority vote and grown by a pixel so product edges go too.
 const raw=new Uint8Array(N);
 for(let p=0;p<N;p++){const o=p*4,d=Math.abs(full[o]-empty[o])+Math.abs(full[o+1]-empty[o+1])+Math.abs(full[o+2]-empty[o+2])+Math.abs(full[o+3]-empty[o+3]);if(d>60)raw[p]=1;}
 const boxSum=mask=>{const sum=new Uint32Array((W+1)*(H+1));for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=mask[y*W+x];sum[(y+1)*(W+1)+x+1]=sum[y*(W+1)+x+1]+row;}}
  return(x,y,r)=>{const x0=Math.max(0,x-r),x1=Math.min(W,x+r+1),y0=Math.max(0,y-r),y1=Math.min(H,y+r+1);return[sum[y1*(W+1)+x1]-sum[y0*(W+1)+x1]-sum[y1*(W+1)+x0]+sum[y0*(W+1)+x0],(x1-x0)*(y1-y0)];};};
 const vote=boxSum(raw),solid=new Uint8Array(N);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const [count,area]=vote(x,y,2);solid[y*W+x]=count/area>.4?1:0;}
 const grow=boxSum(solid),changed=new Uint8Array(N);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(grow(x,y,1)[0])changed[y*W+x]=1;

 const {slotOf,slots,rows}=layoutSlots(file,W,H,scale,changed);
 if(!slots.length)return null;
 // Product edges poking out of a traced row join the slot they touch; anything still unclaimed
 // goes in one last slot so a fully empty rack never keeps stray products.
 const queue=[];for(let p=0;p<N;p++)if(changed[p]&&slotOf[p])queue.push(p);
 for(let i=0;i<queue.length;i++){const p=queue[i],x=p%W;for(const q of [x>0?p-1:-1,x<W-1?p+1:-1,p-W,p+W])if(q>=0&&q<N&&changed[q]&&!slotOf[q]){slotOf[q]=slotOf[p];queue.push(q);}}
 let stray=0;for(let p=0;p<N;p++)if(changed[p]&&!slotOf[p]){if(!stray){slots.push({row:-1,pixels:null});stray=slots.length;}slotOf[p]=stray;}
 const counts=new Uint32Array(slots.length);for(let p=0;p<N;p++)if(changed[p]&&slotOf[p])counts[slotOf[p]-1]++;
 slots.forEach((slot,i)=>{slot.pixels=new Int32Array(counts[i]);});
 const at=new Uint32Array(slots.length);for(let p=0;p<N;p++)if(changed[p]&&slotOf[p]){const i=slotOf[p]-1;slots[i].pixels[at[i]++]=p;}

 // Removal order: shuffled across rows; 'v' bins always empty from the top of the pile.
 const random=rng(file.length*7919+slots.length),order=[];
 const queues=rows.map((row,r)=>{const q=slots.map((s,i)=>i).filter(i=>slots[i].row===r&&slots[i].pixels.length);if(row[6]!=='v')q.sort(()=>random()-.5);return q;});
 while(queues.some(q=>q.length)){const open=queues.filter(q=>q.length);order.push(open[Math.floor(random()*open.length)].shift());}
 if(stray)order.push(stray-1);

 const output=ctx.createImageData(W,H);let shown=-1;
 function setLevel(ratio){
  const hidden=Math.round((1-Math.max(0,Math.min(1,ratio)))*order.length);if(hidden===shown)return false;shown=hidden;
  const out=output.data;out.set(full);
  for(let i=0;i<hidden;i++)for(const p of slots[order[i]].pixels){const o=p*4;out[o]=empty[o];out[o+1]=empty[o+1];out[o+2]=empty[o+2];out[o+3]=empty[o+3];}
  ctx.putImageData(output,0,0);return true;
 }
 setLevel(1);
 return{canvas,setLevel};
}

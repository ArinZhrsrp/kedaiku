// Procedural casual background music and sound effects (Web Audio, no asset files).
const KedaiMusic=(()=>{
'use strict';
const PREF_KEY='kedaiku-music',SFX_KEY='kedaiku-sfx';
const BPM=94,STEP=60/BPM/4,LOOKAHEAD=.12;
// 8-bar progression: Cmaj7 Am7 Dm7 G7 | Fmaj7 Em7 Dm7 G7 (MIDI voicings)
const CHORDS=[[60,64,67,71],[57,60,64,67],[62,65,69,72],[55,59,62,65],[53,57,60,64],[52,55,59,62],[62,65,69,72],[55,59,62,65]];
const BASS=[36,33,38,31,29,28,38,31];
const SCALE=[72,74,76,79,81,84];
let ctx=null,master=null,bus=null,sfxBus=null,noise=null,timer=null,step=0,nextTime=0,busy=false,phrase=[];
let enabled=localStorage.getItem(PREF_KEY)!=='off',sfxEnabled=localStorage.getItem(SFX_KEY)!=='off';
const freq=m=>440*2**((m-69)/12);
function makePhrase(){
 // One melody per 8 bars, sparse and chord-aware so it stays relaxed.
 phrase=[];
 for(let bar=0;bar<8;bar++){
  const tones=CHORDS[bar].map(n=>n+12);
  for(let s=0;s<16;s+=2){
   const strong=s===0||s===8;
   if(Math.random()<(strong?.55:.22)){
    const pool=strong?tones:SCALE;
    phrase.push({at:bar*16+s,note:pool[Math.floor(Math.random()*pool.length)],len:Math.random()<.4?4:2});
   }
  }
 }
}
function init(){
 if(ctx)return;
 ctx=new (window.AudioContext||window.webkitAudioContext)();
 master=ctx.createGain();master.gain.value=0;
 const lowpass=ctx.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=3200;
 const delay=ctx.createDelay(1),feedback=ctx.createGain(),wet=ctx.createGain();
 delay.delayTime.value=STEP*3;feedback.gain.value=.28;wet.gain.value=.22;
 bus=ctx.createGain();bus.connect(lowpass);lowpass.connect(master);
 bus.connect(delay);delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(master);
 master.connect(ctx.destination);
 // Sound effects bypass the music fader so they still play when music is muted.
 sfxBus=ctx.createGain();sfxBus.gain.value=.7;sfxBus.connect(ctx.destination);
 const buffer=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate),data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
 noise=buffer;makePhrase();
}
function env(gain,t,peak,attack,release){gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(peak,t+attack);gain.gain.exponentialRampToValueAtTime(.0001,t+attack+release);}
function tone(type,hz,t,peak,attack,release,out){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.value=hz;env(gain,t,peak,attack,release);osc.connect(gain);gain.connect(out);osc.start(t);osc.stop(t+attack+release+.05);return osc;}
function keys(note,t,len,peak){
 // Soft electric-piano: sine body + quiet triangle overtone.
 for(const [type,mult,level] of [['sine',1,1],['triangle',2,.18]])tone(type,freq(note)*mult,t,peak*level,.012,len,bus).detune.value=(Math.random()-.5)*8;
}
function bass(note,t,len){tone('triangle',freq(note),t,.22,.01,len,master);}
function kick(t){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.setValueAtTime(120,t);osc.frequency.exponentialRampToValueAtTime(45,t+.12);env(gain,t,.28,.003,.16);osc.connect(gain);gain.connect(master);osc.start(t);osc.stop(t+.2);}
function hiss(t,{type,hz,peak,len,out=master}){const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=noise;filter.type=type;filter.frequency.value=hz;env(gain,t,peak,.002,len);src.connect(filter);filter.connect(gain);gain.connect(out);src.start(t,Math.random()*.5);src.stop(t+len+.05);}
function schedule(s,t){
 const bar=Math.floor(s/16)%8,beat=s%16,chord=CHORDS[bar];
 if(beat===0&&bar===0&&s>0&&Math.floor(s/128)%2===0)makePhrase();
 if(beat===0||beat===6||beat===10)chord.forEach((n,i)=>keys(n,t+i*.012,beat===0?1.4:.6,beat===0?.07:.045));
 if(beat===0)bass(BASS[bar],t,.5);
 if(beat===8)bass(BASS[bar]+7,t,.35);
 if(beat===14)bass(BASS[bar]+12,t,.18);
 for(const n of phrase)if(n.at===s%128)keys(n.note,t,n.len*STEP*1.6,busy?.09:.065);
 if(busy){
  if(beat===0||beat===8||beat===11)kick(t);
  if(beat===4||beat===12)hiss(t,{type:'bandpass',hz:1800,peak:.09,len:.12});
  if(beat%2===0)hiss(t+(beat%4===2?STEP*.12:0),{type:'highpass',hz:7500,peak:beat%4===2?.05:.025,len:.04});
 }else if(beat===4||beat===12)hiss(t,{type:'highpass',hz:6000,peak:.03,len:.18});
}
const SFX={
 // Cash register: drawer rattle, then a bright two-note "ka-ching" bell.
 pay(t){
  hiss(t,{type:'bandpass',hz:3200,peak:.22,len:.07,out:sfxBus});hiss(t+.05,{type:'bandpass',hz:2400,peak:.16,len:.06,out:sfxBus});
  for(const [note,at] of [[88,.09],[93,.17]])for(const [mult,level] of [[1,.22],[2.76,.06],[5.4,.03]])tone('sine',freq(note)*mult,t+at,level,.004,.7,sfxBus);
 },
 // Gentle descending "uh-oh" when a rack runs out.
 empty(t){tone('triangle',freq(76),t,.16,.01,.18,sfxBus);tone('triangle',freq(71),t+.16,.16,.01,.32,sfxBus);},
 // Soft rising sparkle after restocking a rack.
 restock(t){[67,71,74,79].forEach((n,i)=>tone('sine',freq(n),t+i*.055,.12,.006,.25,sfxBus));},
 // Light pop when a customer picks an item.
 pick(t){const osc=tone('sine',520,t,.06,.004,.08,sfxBus);osc.frequency.exponentialRampToValueAtTime(900,t+.07);},
 delivery(t){tone('square',freq(67),t,.05,.01,.12,sfxBus);tone('square',freq(72),t+.13,.05,.01,.2,sfxBus);}
};
function sfx(name){
 if(!sfxEnabled||!SFX[name]||document.hidden)return;
 init();if(ctx.state!=='running')ctx.resume();
 SFX[name](ctx.currentTime+.02);
}
function pump(){while(nextTime<ctx.currentTime+LOOKAHEAD){schedule(step,nextTime);step++;nextTime+=STEP;}}
function fade(to){const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(to,t+.8);}
function start(){
 if(!enabled||document.hidden)return;
 init();ctx.resume();
 if(!timer){nextTime=ctx.currentTime+.1;timer=setInterval(pump,40);}
 fade(.55);
}
function stop(){if(!ctx)return;fade(0);clearInterval(timer);timer=null;}
function setEnabled(on){enabled=on;localStorage.setItem(PREF_KEY,on?'on':'off');on?start():stop();}
// Browsers only allow audio after a user gesture.
const unlock=()=>{init();ctx.resume();start();for(const e of ['pointerdown','keydown'])window.removeEventListener(e,unlock);};
for(const e of ['pointerdown','keydown'])window.addEventListener(e,unlock);
document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden){stop();ctx.suspend();}else{ctx.resume();start();}});
return{
 get enabled(){return enabled;},
 get sfxEnabled(){return sfxEnabled;},
 toggle(){setEnabled(!enabled);return enabled;},
 toggleSfx(){sfxEnabled=!sfxEnabled;localStorage.setItem(SFX_KEY,sfxEnabled?'on':'off');if(sfxEnabled)sfx('pick');return sfxEnabled;},
 setBusy(value){busy=!!value;},
 sfx
};
})();

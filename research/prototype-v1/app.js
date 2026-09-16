const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

$$('[data-bars]').forEach((node, index) => {
  const widths = [1, 2, 1, 5, 2, 1, 1, 4, 2, 3, 1, 1, 5, 2, 1, 2, 4, 1, 3];
  widths.forEach((width, i) => { const bar = document.createElement('i'); bar.style.setProperty('--bar', widths[(i + index * 3) % widths.length]); bar.style.setProperty('--i', i); node.append(bar); });
});

function updateTime() {
  const now = new Date();
  $('#local-time').textContent = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Karachi',hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
  $('#local-time').dateTime = now.toISOString();
}
updateTime(); setInterval(updateTime, 30000);

const intro = $('.intro');
let introFrame;
function playIntro() {
  if (reduced.matches) return;
  cancelAnimationFrame(introFrame);
  intro.classList.remove('playing');
  void intro.offsetWidth;
  intro.classList.add('playing');
  const start = performance.now();
  const tick = time => { const p = Math.min((time-start)/1000,1); $('.intro-count').textContent='('+String(Math.round(100*(1-Math.pow(1-p,3)))).padStart(2,'0')+')'; if(p<1) introFrame=requestAnimationFrame(tick); };
  introFrame=requestAnimationFrame(tick);
}
intro.addEventListener('animationend', e => {if(e.animationName==='intro-exit')intro.classList.remove('playing');});
playIntro();
$('#replay').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'instant'});playIntro();});

if (!reduced.matches) document.body.classList.add('motion-ready');
const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}}),{threshold:.08});
$$('.reveal').forEach(el=>revealObserver.observe(el));
const textObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  if(!reduced.matches) $$('.char',entry.target).forEach((char,i)=>char.animate([{opacity:.05,filter:'blur(6px)',transform:'translateY(10px)'},{opacity:1,filter:'blur(0)',transform:'translateY(0)'}],{duration:700,delay:i*12+(entry.target.tagName==='H1'?950:0),fill:'both',easing:'cubic-bezier(.2,.8,.2,1)'}));
  textObserver.unobserve(entry.target);
}),{threshold:.25});
$$('.split-reveal').forEach(el=>{
  const text=el.innerText.replace(/\s+/g,' ').trim();
  el.setAttribute('aria-label',text);el.textContent='';
  text.split(/\s+/).forEach((word,index)=>{if(index)el.append(document.createTextNode(' '));const span=document.createElement('span');span.className='word';span.setAttribute('aria-hidden','true');for(const c of word){const char=document.createElement('span');char.className='char';char.textContent=c;span.append(char);}el.append(span);});
  textObserver.observe(el);
});

const menu=$('#menu'), toggle=$('.menu-toggle');
function closeMenu(){menu.close();toggle.setAttribute('aria-expanded','false');toggle.focus();}
toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');});
$('.menu-close').addEventListener('click',closeMenu);
menu.addEventListener('close',()=>toggle.setAttribute('aria-expanded','false'));
$$('nav a',menu).forEach(link=>link.addEventListener('click',()=>menu.close()));

const token=$('.identity-token'),interlude=$('.identity-interlude');let scrollPending=false;
function updateScroll(){scrollPending=false;const hero=$('.hero').getBoundingClientRect(),contact=$('.contact').getBoundingClientRect(),stage=interlude.getBoundingClientRect();const dark=hero.bottom>hero.height*.58||(stage.top<0&&stage.bottom>stage.height*.25)||(contact.top< -contact.height*.45);$('.site-header').style.color=dark?'#ffffff':'#171819';$('.site-header').style.setProperty('--header-inverse',dark?'#171819':'#ffffff');if(reduced.matches)return;const rect=interlude.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const p=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));token.style.transform=`perspective(1000px) rotateY(${(p-.5)*40}deg) rotateZ(${(p-.5)*-24}deg) translateY(${(p-.5)*-60}px)`;}}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();

const dot=$('.cursor-dot');
window.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reduced.matches)return;dot.style.opacity='1';dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';},{passive:true});
document.addEventListener('mouseleave',()=>dot.style.opacity='0');

let toastTimer;
function toast(message){const el=$('.toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3000);}
$('.copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('uxhassan99@gmail.com');toast('Email copied. Say hello.');}catch{toast('uxhassan99@gmail.com');}});
reduced.addEventListener('change',()=>{if(reduced.matches){intro.classList.remove('playing');document.body.classList.remove('motion-ready');document.getAnimations().forEach(a=>a.cancel());token.style.transform='none';}});

$$('a.roll').forEach(link=>{if(!link.hasAttribute('aria-label'))link.setAttribute('aria-label',link.textContent.trim());});
$('.contact-button').setAttribute('aria-label', 'Email Hassan — let’s talk');
window.addEventListener('resize', updateScroll, {passive:true});

import { event } from './config.js';
const root=document.querySelector('#invitation');
if(!root.dataset.mounted){
root.dataset.mounted='true';
const $=s=>root.querySelector(s), $$=s=>root.querySelectorAll(s);
const gate=$('#gate'), main=$('#main'), title=$('#letter h2'), button=$('#open-ticket');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let state='closed',timeline,scene,gsap,mm,watchdog;
const validDate=event.startsAt && /[+]07:00$/.test(event.startsAt) && Number.isFinite(Date.parse(event.startsAt));
const dateLabel=validDate?new Intl.DateTimeFormat('vi-VN',{dateStyle:'long',timeStyle:'short',timeZone:'Asia/Ho_Chi_Minh'}).format(new Date(event.startsAt)):`${event.invitationTime || 'Giờ chờ xác nhận'} sáng · Ngày chờ xác nhận`;
$$('[data-date]').forEach(el=>el.textContent=dateLabel);$$('[data-address]').forEach(el=>el.textContent=event.address);$$('[data-class]').forEach(el=>el.textContent=event.className?`${event.className} · ${event.schoolYears||'Niên khóa chờ chốt'}`:'Lớp chờ xác nhận');
document.title=`Chuyến bay cuối của tuổi 18 — ${event.name}`;
const letterBody=$('#letter-body');letterBody.replaceChildren();event.letter.forEach(text=>{const p=document.createElement('p');p.textContent=text;letterBody.append(p)});
const schedule=$('#schedule');schedule.replaceChildren();event.schedule.forEach(item=>{const li=document.createElement('li');for(const [tag,text] of [['span',item.time],['h3',item.title]]){const el=document.createElement(tag);el.textContent=text;li.append(el)}schedule.append(li)});
$('#maps').href=event.mapsUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`;
if(event.mapsUrl){$('#maps').textContent='Mở Google Maps ↗';$('#map-note').textContent='Mở bản đồ để xem đường đến điểm hẹn.'}
if(event.mapsEmbedUrl){$('#load-map').hidden=false;$('#load-map').onclick=()=>{const frame=document.createElement('iframe');frame.src=event.mapsEmbedUrl;frame.title='Bản đồ điểm hẹn chụp kỷ yếu';frame.loading='lazy';frame.referrerPolicy='no-referrer-when-downgrade';$('#map-panel').replaceChildren(frame)}}
if(event.portraitUrl){const img=new Image();img.alt=`Tranh chân dung tốt nghiệp của ${event.name}, phác họa từ ảnh tham chiếu`;img.className='portrait-img';img.width=1024;img.height=1280;img.onerror=()=>{$('#portrait').textContent='Tranh chân dung tốt nghiệp chưa tải được. Vui lòng tải lại trang.'};img.onload=()=>$('#portrait').replaceChildren(img);img.src=event.portraitUrl;}
if(validDate){const counter=$('#countdown');counter.hidden=false;const update=()=>{const seconds=Math.max(0,Math.floor((Date.parse(event.startsAt)-Date.now())/1000));counter.textContent=seconds?`Còn ${Math.floor(seconds/86400)} ngày · ${Math.floor(seconds/3600)%24} giờ · ${Math.floor(seconds/60)%60} phút`:'Đã đến ngày hẹn.';return seconds};if(update()){const timer=setInterval(()=>{if(!update())clearInterval(timer)},30000)}}
function finish(){clearTimeout(watchdog);timeline?.kill();scene?.remove();scene=null;gate.hidden=true;main.hidden=false;main.style.opacity='';main.style.transform='';state='open';button.disabled=false;button.removeAttribute('aria-busy');title.focus({preventScroll:true});$('#letter').scrollIntoView({behavior:'instant',block:'start'});}
async function open(){if(state!=='closed')return;state='opening';button.disabled=true;button.setAttribute('aria-busy','true');if(reduced.matches||!gsap){finish();return}
try{const ticket=$('#ticket'),r=ticket.getBoundingClientRect(),bodyRect=$('.ticket-body').getBoundingClientRect(),mobile=innerWidth<640;
scene=document.createElement('div');scene.className='paper-scene';scene.setAttribute('aria-hidden','true');root.append(scene);
const clone=ticket.cloneNode(true);clone.classList.add('paper-clone');clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));clone.removeAttribute('id');clone.inert=true;Object.assign(clone.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});scene.append(clone);
const plane=document.createElement('div');plane.className='paper-plane';Object.assign(plane.style,{left:bodyRect.left+'px',top:bodyRect.top+'px',width:bodyRect.width+'px',height:bodyRect.height+'px',opacity:'0'});
plane.innerHTML='<svg viewBox="0 0 600 400" preserveAspectRatio="none"><defs><pattern id="paper-texture" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0 28H28" stroke="#172244" stroke-opacity=".08"/></pattern></defs><polygon class="wing-a" points="0,0 300,0 300,400 0,400" fill="#fff4de"/><polygon class="wing-b" points="300,0 600,0 600,400 300,400" fill="#eadcbd"/><polygon class="crease" points="300,0 300,400 300,400" fill="#2448e5"/><path d="M45 95H210M45 110H165" stroke="#2448e5" stroke-width="5"/><text x="45" y="70" font-size="20" fill="#172244">THANH THẢO / 18</text></svg>';scene.append(plane);
gsap.set(ticket,{opacity:0});
timeline=gsap.timeline({onComplete:finish});
timeline.to(clone.querySelector('.ticket-stub'),{duration:.55,x:mobile?20:65,y:mobile?85:25,rotation:mobile?9:13,opacity:0,ease:'power2.in'},0)
.to(plane,{opacity:1,duration:.08},.45).to(clone.querySelector('.ticket-body'),{opacity:0,duration:.12},.45)
.to(plane.querySelector('.wing-a'),{attr:{points:'0,115 600,0 245,230 0,115'},duration:.8,ease:'power2.inOut'},.45)
.to(plane.querySelector('.wing-b'),{attr:{points:'600,0 600,0 160,400 245,230'},duration:.8,ease:'power2.inOut'},.45)
.to(plane.querySelector('.crease'),{attr:{points:'245,230 275,260 160,400'},duration:.8},.45)
.to(plane,{scaleX:.48,scaleY:.48,rotation:-12,duration:.8,ease:'power2.inOut'},.45)
.call(()=>{gate.hidden=true;main.hidden=false;window.scrollTo(0,0)},[],1.2)
.fromTo(main,{opacity:0,y:22},{opacity:1,y:0,duration:.85,ease:'power2.out'},1.2)
.to(plane,{x:innerWidth*.9,y:-innerHeight*.8,rotation:-32,scale:.16,duration:1,ease:'power2.in'},1.2);
watchdog=setTimeout(finish,2300);
}catch{finish()}}
// The letter remains available if JavaScript or the animation chunk cannot load.
main.hidden=true;
import('gsap').then(mod=>{gsap=mod.gsap;mm=gsap.matchMedia();mm.add({small:'(max-width: 639px)',large:'(min-width: 640px)',reduce:'(prefers-reduced-motion: reduce)'},()=>()=>{if(state==='opening')finish()})}).catch(()=>{});
button.addEventListener('click',open);
$('#skip').addEventListener('click',e=>{e.preventDefault();finish()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&state==='opening')finish()});
addEventListener('resize',()=>{if(state==='opening')finish()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='opening')finish()});
reduced.addEventListener('change',()=>{if(state==='opening')finish()});
$('#replay').onclick=()=>{clearTimeout(watchdog);timeline?.kill();scene?.remove();scene=null;gate.hidden=false;main.hidden=true;gsap?.set($('#ticket'),{clearProps:'opacity'});state='closed';window.scrollTo({top:0,behavior:'instant'});button.focus({preventScroll:true})};
const dialog=$('#thanks');$$('.close,.close-letter').forEach(el=>el.onclick=()=>dialog.close());dialog.addEventListener('close',()=>$('#confirm').focus({preventScroll:true}));
const flowers=[['none','Không tặng hoa',''],['sunflower','Nắng sân trường','#eeb935'],['rose-pink','Hồng thanh xuân','#e998b4'],['tulip','Lời hẹn tháng năm','#c16ab0'],['daisy','Cúc họa mi','#fffdf2'],['baby','Mây trắng','#eeeaf7'],['rose-red','Điều thương chưa nói','#c94c58'],['hydrangea','Trời xanh tuổi 18','#8bace2'],['lavender','Một miền ký ức','#a08acb'],['lily','Ngày rạng rỡ','#f4c5a5'],['lotus','Mùa nhớ','#e8a3bb'],['mixed','Thanh xuân rực rỡ','#ee8565'],['forget-me-not','Đừng quên nhau nhé','#83bbce']];
for(const [id,name,color] of flowers){const label=document.createElement('label');label.className='flower-card';const input=document.createElement('input');input.type='radio';input.name='bouquet';input.value=id;input.checked=id==='none';label.append(input);if(color){const art=document.createElementNS('http://www.w3.org/2000/svg','svg');art.setAttribute('viewBox','0 0 120 130');art.setAttribute('aria-hidden','true');let parts='<path d="M25 60 60 125 95 60Z" fill="#ecd8b4"/><path d="M60 119 45 55M60 119 60 40M60 119 80 50" stroke="#638467" stroke-width="3"/>';for(const [x,y] of [[35,48],[58,32],[83,46],[50,60],[72,65]]){parts+=`<g transform="translate(${x} ${y})">`;for(let i=0;i<6;i++)parts+=`<ellipse cy="-9" rx="7" ry="11" fill="${color}" stroke="#172244" stroke-opacity=".12" transform="rotate(${i*60})"/>`;parts+='<circle r="5" fill="#edc36a"/></g>'}parts+='<path d="M45 99Q60 87 75 99L60 105Z" fill="#ff684f"/>';art.innerHTML=parts;label.append(art)}const caption=document.createElement('span');caption.textContent=name;label.append(caption);$('#flower-options').append(label)}
let pending=false,requestId;
$('#rsvp-form').addEventListener('change',()=>{requestId=null;const chosen=flowers.find(f=>f[0]===$('input[name="bouquet"]:checked').value);$('#flower-picked').textContent=chosen[0]==='none'?'Chưa chọn hoa':`Bó hoa đã chọn: ${chosen[1]}`});
$('#rsvp-form').addEventListener('submit',async e=>{e.preventDefault();if(pending)return;const name=$('#guest').value.trim(),wish=$('#wish').value.trim(),attendance=$('#attendance').value,bouquet=$('input[name="bouquet"]:checked').value;const status=$('#form-status');if(!name||!wish){status.textContent='Bạn nhập họ tên và lời chúc nhé.';return}if(!event.rsvpEndpoint){status.textContent='Chưa thể gửi: chủ trang đang kết nối Google Sheet. Họ tên, lời chúc và hoa của bạn vẫn được giữ trên màn hình.';return}pending=true;$('#confirm').disabled=true;status.textContent='Đang gửi lời chúc…';requestId ||= crypto.randomUUID();try{const response=await fetch(event.rsvpEndpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({name,wish,attendance,bouquet,requestId}),signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error();const data=await response.json();if(data.success!==true)throw Error();status.textContent='Đã lưu lời chúc và bó hoa bạn chọn.';$('#thanks-copy').textContent=`Cảm ơn ${name}! Thảo đã nhận được lời chúc của bạn${bouquet!=='none'?' cùng một bó hoa thanh xuân':''}.`;dialog.showModal();requestId=null}catch{status.textContent='Chưa gửi được. Nội dung vẫn được giữ lại, bạn hãy thử lại nhé.'}finally{pending=false;$('#confirm').disabled=false}});
$('#rsvp-form').addEventListener('input',()=>{requestId=null});
if('IntersectionObserver' in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});$$('.schedule li').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el)})}
}

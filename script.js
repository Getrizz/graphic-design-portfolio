const projects=window.PORTFOLIO_PROJECTS||[];
const grid=document.getElementById('project-grid');
const filters=[...document.querySelectorAll('.filter')];
const video=document.querySelector('.video-feature');
const count=document.getElementById('project-count');
function render(filter='All'){
 const shown=projects.filter(p=>filter==='All'||p.period===filter);
 grid.innerHTML='';
 if(!shown.length) grid.innerHTML='<div class="empty">No still-image projects were included for this period. See the Finals promotional video below.</div>';
 shown.forEach((p)=>{
  const card=document.createElement('article');card.className='project-card';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','View '+p.title);
  card.innerHTML=`<div class="project-image"><img loading="lazy" src="${p.thumb}" alt="${p.title}" /></div><div class="project-meta"><span>${p.period}</span><span>${p.kind} · ${p.pages.length} ${p.pages.length===1?'PAGE':'PAGES'}</span></div><h3>${p.title}</h3><p>${p.description}</p>`;
  card.addEventListener('click',()=>openProject(p));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProject(p)}});
  grid.appendChild(card);
 });
 video.style.display=(filter==='All'||filter==='Finals')?'grid':'none';
 count.textContent=filter==='Finals'?'01':String(shown.length);
}
filters.forEach(btn=>btn.addEventListener('click',()=>{
 filters.forEach(b=>b.classList.toggle('active',b===btn));render(btn.dataset.filter);
}));
const modal=document.getElementById('modal');
function openProject(p){
 document.getElementById('modal-meta').textContent=p.period+' / '+p.kind+' / '+p.pages.length+' '+(p.pages.length===1?'PAGE':'PAGES');
 document.getElementById('modal-title').textContent=p.title;
 document.getElementById('modal-desc').textContent=p.description;
 const pages=document.getElementById('modal-pages');pages.innerHTML='';
 p.pages.forEach((src,i)=>{const img=document.createElement('img');img.src=src;img.alt=p.title+' — page '+(i+1);pages.appendChild(img)});
 const link=document.getElementById('modal-original');link.href=p.original;link.textContent='Open original '+p.kind.toLowerCase()+' ↗';
 modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelector('.modal-close').addEventListener('click',closeModal);
document.querySelector('.modal-backdrop').addEventListener('click',closeModal);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('seen');observer.unobserve(entry.target)}}),{threshold:.08});
document.querySelectorAll('.project-card,.skill-grid article,.promo-card').forEach(el=>observer.observe(el));
render();

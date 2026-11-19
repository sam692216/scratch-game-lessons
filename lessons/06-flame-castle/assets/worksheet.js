
(() => {
 const missions=[...document.querySelectorAll('[data-mission]')], tabs=[...document.querySelectorAll('[data-tab]')];
 const checks=[...document.querySelectorAll('[data-check]')];
 const key='lionlake-lesson6-worksheet-progress-v1';
 try{const saved=JSON.parse(localStorage.getItem(key)||'[]');checks.forEach(c=>c.checked=saved.includes(c.dataset.check));}catch{}
 function progress(){
  const done=checks.filter(c=>c.checked).map(c=>c.dataset.check);
  document.getElementById('progress').textContent='已完成 '+done.length+'／5';
  document.getElementById('completion').textContent=done.length===5?'五個任務都完成了！分享你拼的積木和試玩結果。':'完成五個任務後，和同桌分享你最喜歡的一塊積木。';
  try{localStorage.setItem(key,JSON.stringify(done));}catch{}
 }
 function open(n,focus){
  missions.forEach((m,i)=>m.hidden=i!==n-1);
  tabs.forEach((tab,i)=>{if(i===n-1)tab.setAttribute('aria-current','step');else tab.removeAttribute('aria-current');});
  if(focus){history.replaceState(null,'','#mission-'+n);missions[n-1].querySelector('h2').focus({preventScroll:true});missions[n-1].scrollIntoView({block:'start'});}
 }
 document.querySelectorAll('[data-open],[data-tab]').forEach(el=>el.addEventListener('click',()=>open(Number(el.dataset.open||el.dataset.tab),true)));
 checks.forEach(c=>c.addEventListener('change',progress));
 document.getElementById('clear-progress').addEventListener('click',()=>{
  checks.forEach(c=>c.checked=false);
  document.querySelectorAll('.quiz').forEach(q=>{q.querySelector('[role=status]').textContent='';q.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed','false'));});
  progress();open(1,true);
 });
 document.querySelectorAll('.quiz').forEach(q=>q.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{
  q.querySelectorAll('[data-choice]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));
  q.querySelector('[role=status]').textContent=b.dataset.choice===q.dataset.answer?'答對了！'+q.dataset.explain:'再試一次。回頭看這一頁的積木。';
 })));
 function fromHash(){
  const match=location.hash.match(/^#mission-([1-5])$/);
  if(match){const n=Number(match[1]);open(n,false);missions[n-1].scrollIntoView({block:'start',behavior:'instant'});}
 }
 window.addEventListener('hashchange',fromHash);fromHash();
 progress();
})();


(() => {
 const slides=[...document.querySelectorAll('[data-slide]')], select=document.querySelector('#slide-select');
 const prev=document.querySelector('#prev'),next=document.querySelector('#next'),count=document.querySelector('#slide-count');
 const dialog=document.querySelector('#block-dialog'),image=document.querySelector('#zoom-image'),zoom=document.querySelector('#zoom');
 let index=0,source;
 function show(n){
  const was=index;
  index=Math.max(0,Math.min(slides.length-1,n));
  if(was===1&&index!==1)slides[was].querySelector('[data-reset]').click();
  slides.forEach((slide,i)=>slide.hidden=i!==index);
  select.value=index;prev.disabled=index===0;next.disabled=index===slides.length-1;
  count.textContent=(index+1)+'／'+slides.length;
  document.body.dataset.teachingPage='slide-'+(index+1);
  window.dispatchEvent(new Event('teaching-page'));
  window.scrollTo({top:0,behavior:'instant'});
 }
 prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));
 select.addEventListener('change',()=>show(Number(select.value)));
 document.addEventListener('keydown',event=>{
  if(dialog.open||event.defaultPrevented||event.target.closest('input,select,textarea,[contenteditable]'))return;
  if(event.key==='ArrowRight'||event.key==='PageDown'){event.preventDefault();show(index+1);}
  if(event.key==='ArrowLeft'||event.key==='PageUp'){event.preventDefault();show(index-1);}
 });
 document.querySelectorAll('[data-image]').forEach(btn=>btn.addEventListener('click',()=>{
  source=btn;image.src=btn.dataset.image;image.alt=btn.dataset.alt;
  document.querySelector('#image-title').textContent=btn.dataset.alt;
  image.classList.remove('enlarged');zoom.textContent='放大細節';dialog.showModal();dialog.querySelector('.image-box').scrollTo(0,0);
 }));
 zoom.addEventListener('click',()=>{zoom.textContent=image.classList.toggle('enlarged')?'縮回畫面':'放大細節';});
 document.querySelector('#close-image').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>source?.focus());
 document.querySelector('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}});
 show(0);
})();

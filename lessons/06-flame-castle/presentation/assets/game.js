
(() => {
  const panel = document.querySelector('[data-game]');
  if (!panel) return;
  const canvas = panel.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const directory = panel.dataset.assets || 'assets/';
  const images = Object.fromEntries(['field','victory','hero','cast','cheer','fallen','zombie','zombie-step','zombie-hit','fire','fire-step'].map(name => {
    const image = new Image();
    image.src = directory + name + '.png';
    return [name, image];
  }));
  const scoreLabel = panel.querySelector('[data-score]');
  const goalLabel = panel.querySelector('[data-goal]');
  const timeLabel = panel.querySelector('[data-time]');
  const output = panel.querySelector('[data-output]');
  const intervalInput = panel.querySelector('[data-interval]');
  const intervalLabel = panel.querySelector('[data-interval-label]');
  const laneY = lane => 100 + lane * 80;
  let status = 'ready', score = 0, goal = 100, lane = 1, elapsed = 0;
  let last = 0, startedAt = 0, spawnAt = .5, nextShot = 0, animationId = 0;
  let shots = [], enemies = [];
  function drawImage(name, x, y, width, height, flip = false) {
    const image = images[name];
    if (!image.complete || !image.naturalWidth) return;
    ctx.save();
    ctx.translate(x,y);
    if(flip) ctx.scale(-1,1);
    ctx.drawImage(image,-width/2,-height/2,width,height);
    ctx.restore();
  }
  function paint() {
    ctx.fillStyle = '#73659b';
    ctx.fillRect(0,0,480,360);
    drawImage(status === 'win' ? 'victory' : 'field',240,180,480,360);
    const hero = status === 'win' ? 'cheer' : status === 'loss' ? 'fallen' : status === 'playing' && elapsed < nextShot ? 'cast' : 'hero';
    drawImage(hero,66,laneY(lane),139,99);
    enemies.forEach(z => drawImage(z.hurt ? 'zombie-hit' : Math.floor((elapsed-z.birth)*10)%2 ? 'zombie-step' : 'zombie',z.x,laneY(z.lane),119,97,true));
    shots.forEach(s => drawImage(Math.floor((elapsed-s.birth)*18)%2 ? 'fire-step' : 'fire',s.x,laneY(s.lane),36.5,18.25));
  }
  function display() {
    scoreLabel.textContent = score;
    goalLabel.textContent = goal;
    timeLabel.textContent = Math.max(0,60-Math.floor(elapsed));
  }
  function finish(result,text) {
    status = result;
    shots = []; enemies = [];
    output.textContent = text;
    display(); paint();
  }
  function spawnInterval() { return Number(intervalInput.value); }
  function tick(now) {
    if(status !== 'playing') return;
    const dt = Math.min(.12,(now-last)/1000);
    last = now; elapsed = (now-startedAt)/1000;
    if(elapsed >= 60) {finish('timeout','時間到！擊倒 '+score+' 隻殭屍。');return;}
    if(elapsed >= spawnAt) {
      enemies.push({x:443,lane:Math.floor(Math.random()*3),birth:elapsed,hurt:0});
      spawnAt = elapsed + spawnInterval();
    }
    for (const z of enemies) if(!z.hurt) z.x -= 200*dt;
    for (const s of shots) {
      s.x += 245*dt;
      const z = enemies.filter(z => !z.hurt && z.lane===s.lane && Math.abs(s.x-z.x)<27).sort((a,b)=>a.x-b.x)[0];
      if(z) {
        z.hurt=elapsed+.15;s.hit=true;score++;
        if(score>=goal) {finish('win','守住城堡了！擊倒 '+score+' 隻殭屍。');return;}
      }
    }
    if(enemies.some(z => !z.hurt && z.lane===lane && Math.abs(z.x-66)<30)) {
      finish('loss','勇者碰到殭屍了！再試一次。');return;
    }
    enemies=enemies.filter(z=>z.x>26 && (!z.hurt || z.hurt>elapsed));
    shots=shots.filter(s=>s.x<464 && !s.hit);
    display();paint();animationId=requestAnimationFrame(tick);
  }
  function start(target) {
    cancelAnimationFrame(animationId);
    status='playing'; score=0; goal=target; lane=1; elapsed=0; nextShot=0; spawnAt=spawnInterval();
    shots=[];enemies=[];startedAt=last=performance.now();
    output.textContent=target===3?'試打 3 隻。':'守城開始！';
    display();paint();canvas.focus();animationId=requestAnimationFrame(tick);
  }
  function reset() {
    cancelAnimationFrame(animationId);
    status='ready';score=0;goal=100;lane=1;elapsed=0;shots=[];enemies=[];
    intervalInput.value='.5';intervalLabel.textContent='0.5 秒';
    output.textContent='選擇試打 3 隻，或開始正式挑戰。';display();paint();
  }
  function act(action) {
    if(status!=='playing') return;
    if(action==='up')lane=Math.max(0,lane-1);
    if(action==='down')lane=Math.min(2,lane+1);
    if(action==='fire' && elapsed>=nextShot){shots.push({x:118,lane,birth:elapsed});nextShot=elapsed+.22;}
    paint();
  }
  Object.values(images).forEach(image=>image.addEventListener('load',paint));
  panel.querySelectorAll('[data-start]').forEach(button=>button.addEventListener('click',()=>start(Number(button.dataset.start))));
  panel.querySelectorAll('[data-act]').forEach(button=>button.addEventListener('click',()=>act(button.dataset.act)));
  panel.querySelector('[data-reset]').addEventListener('click',reset);
  intervalInput.addEventListener('input',()=>intervalLabel.textContent=spawnInterval().toFixed(1)+' 秒');
  canvas.addEventListener('keydown',event=>{
    const action={'ArrowUp':'up','ArrowDown':'down',' ':'fire'}[event.key];
    if(action){event.preventDefault(); if(!event.repeat)act(action);}
  });
  paint();
})();

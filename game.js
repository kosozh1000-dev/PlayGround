import * as THREE from 'three';

const $ = id => document.getElementById(id);
const canvas = $('game');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x171d1f);
scene.fog = new THREE.FogExp2(0x171d1f, 0.027);
const camera = new THREE.PerspectiveCamera(73, innerWidth / innerHeight, .08, 100);
camera.rotation.order = 'YXZ';
const renderer = new THREE.WebGLRenderer({canvas, antialias:false, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
const mat = (color, roughness=1, extra={}) => new THREE.MeshStandardMaterial({color, roughness, ...extra});
const M = {
 floor:mat(0x444744), concrete:mat(0x65665f), grime:mat(0x807b68), dark:mat(0x222829), metal:mat(0x59615e,.8,{metalness:.3}), rust:mat(0x714638,.9,{metalness:.15}), yellow:mat(0xb3944b), blue:mat(0x506671), flesh:mat(0x827a68), black:mat(0x252a29), glow:mat(0xd0a447,.7,{emissive:0x654214,emissiveIntensity:.55}), red:mat(0xa34b3c), enemyGlow:mat(0xb84737,.65,{emissive:0x6d231d,emissiveIntensity:.45})
};
scene.add(new THREE.HemisphereLight(0xbac2be,0x35312b,1.35));
const sun=new THREE.DirectionalLight(0xb7c1bd,1.25);sun.position.set(-7,16,-9);scene.add(sun);
for(const [x,y,z,color,intensity,range] of [[-7,4.7,-2,0xd9ba72,19,10],[7,4.7,-2,0xd9ba72,19,10],[7,3.5,-12,0xa84637,17,11]]){const l=new THREE.PointLight(color,intensity,range,2);l.position.set(x,y,z);scene.add(l);}
function box(parent,x,y,z,sx,sy,sz,material,ry=0){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);o.position.set(x,y,z);o.rotation.y=ry;parent.add(o);return o;}
function cyl(parent,x,y,z,rt,rb,h,material,seg=10){const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),material);o.position.set(x,y,z);parent.add(o);return o;}
function ball(parent,x,y,z,r,material,sx=1,sy=1,sz=1){const o=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
function groundTexture(){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#414442';x.fillRect(0,0,512,512);for(let i=0;i<3200;i++){x.fillStyle=Math.random()>.5?'rgba(15,18,18,.12)':'rgba(190,182,155,.07)';x.fillRect(Math.random()*512,Math.random()*512,Math.random()*2+.5,Math.random()*2+.5);}x.strokeStyle='rgba(20,23,22,.55)';x.lineWidth=2;for(let i=0;i<9;i++){let a=Math.random()*512,b=Math.random()*512;x.beginPath();x.moveTo(a,b);for(let j=0;j<5;j++){a+=(Math.random()-.5)*35;b+=Math.random()*25;x.lineTo(a,b);}x.stroke();}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,4);t.colorSpace=THREE.SRGBColorSpace;return t;}
const gm=mat(0xffffff);gm.map=groundTexture();const floor=new THREE.Mesh(new THREE.PlaneGeometry(34,34),gm);floor.rotation.x=-Math.PI/2;floor.position.y=-.12;scene.add(floor);
box(scene,0,-.05,-16,34,.5,1.2,M.concrete);box(scene,0,-.05,16,34,.5,1.2,M.concrete);box(scene,-16,-.05,0,1.2,.5,34,M.concrete);box(scene,16,-.05,0,1.2,.5,34,M.concrete);
function building(x,z,w,d,h,material){box(scene,x,h/2,z,w,h,d,material);box(scene,x,h-.18,z,w+.14,.35,d+.14,M.dark);const rows=Math.floor((h-2)/2.1),cols=Math.floor((w-1)/1.8);for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(Math.random()<.14)continue;const wx=x-w/2+1+c*(w-2)/Math.max(cols-1,1),wy=1.5+r*2;const wm=mat(Math.random()>.72?0x897a51:0x29383b,.9,{emissive:Math.random()>.84?0x332816:0,emissiveIntensity:.3});box(scene,wx,wy,z-d/2-.012,.78,1.12,.08,wm);box(scene,wx,wy-.62,z-d/2-.03,.88,.08,.14,M.dark);}}
building(-10,-13,11,5,12,M.concrete);building(10,-13,11,5,14,M.blue);building(-13,10,5,10,9,M.grime);building(13,10,5,10,10,M.concrete);box(scene,0,8,-20,38,16,3,mat(0x303738));
box(scene,0,2.45,-15.15,5.5,.35,.4,M.rust);box(scene,-2.5,1.2,-15.1,.18,2.5,.28,M.metal);box(scene,2.5,1.2,-15.1,.18,2.5,.28,M.metal);
function signMat(){const c=document.createElement('canvas');c.width=512;c.height=180;const x=c.getContext('2d');x.fillStyle='#303536';x.fillRect(0,0,512,180);x.fillStyle='#b9aa81';x.font='bold 54px monospace';x.fillText('ДВОР № 4',24,76);x.fillStyle='#88877b';x.font='22px monospace';x.fillText('УПРАВЛЯЮЩАЯ КОМПАНИЯ',27,125);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:t});}
const sign=new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.1),signMat());sign.position.set(0,4.2,-15.1);scene.add(sign);
for(let i=0;i<6;i++){const x=-12+i*4.8,z=i%2===0?8:-8;box(scene,x,.55,z,2.8,.65,1.15,i%2?M.blue:M.rust,Math.random()*.3);box(scene,x-.55,.93,z,.72,.28,1.1,M.dark);box(scene,x+.55,.93,z,.72,.28,1.1,M.dark);for(const xx of [x-1.05,x+1.05])for(const zz of [z-.38,z+.38])cyl(scene,xx,.27,zz,.22,.22,.12,M.black,12).rotation.z=Math.PI/2;}
for(let i=0;i<25;i++){const x=(Math.random()-.5)*27,z=(Math.random()-.5)*27;if(Math.abs(x)<4&&Math.abs(z)<5)continue;if(Math.random()>.45)box(scene,x,.12,z,.5+Math.random(),.12,.25+Math.random()*.4,M.grime,Math.random()*2);else cyl(scene,x,.12,z,.15,.18,.23,M.rust,7);}
const cameraRig=new THREE.Group();camera.add(cameraRig);scene.add(camera);
const sleeve=box(cameraRig,.39,-.43,-.72,.24,.25,.46,M.blue,-.35);sleeve.rotation.z=-.42;ball(cameraRig,.35,-.34,-.53,.14,M.flesh,.85,.7,1);const pipe=cyl(cameraRig,.29,-.23,-.76,.045,.055,.78,M.metal,9);pipe.rotation.z=-.28;pipe.rotation.x=.22;const pipeEnd=cyl(cameraRig,.39,-.05,-.96,.07,.07,.13,M.rust,9);pipeEnd.rotation.z=-.28;box(cameraRig,.28,-.35,-.54,.13,.06,.15,M.yellow,-.35).rotation.z=-.28;
const player={pos:new THREE.Vector3(0,0,8),yaw:0,pitch:0,hp:100,maxHp:100,credits:0,kills:0,lastHurt:-99,roll:0,rollCd:0,kickCd:0,buff:0,damage:16,dead:false,invuln:0,rollDir:new THREE.Vector3()};
const enemies=[],drops=[],projectiles=[],particles=[],chests=[];
let running=false,finished=false,wave=0,waveWait=0,boss=null,time=0,fireHeld=false,fireCd=0,toastTimer=0,pointerLocked=false;
const move={x:0,y:0,sprint:false};const touch={moveId:null,aimId:null,moveOrigin:null,aimOrigin:null};

function toast(text,ms=2200){const el=$('toast');el.textContent=text;el.classList.add('show');toastTimer=ms/1000;}
function makeEnemy(type,x,z,isBoss=false){
 const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);
 const scale=isBoss?1.45:type==='heavy'?1.18:1;
 const skin=mat(isBoss?0x77705e:type==='heavy'?0x655b4e:type==='ranged'?0x777263:0x817664);
 const coat=mat(isBoss?0x4c4940:type==='heavy'?0x55524b:type==='ranged'?0x4b5a5a:0x66544b);
 const trim=type==='ranged'?M.blue:type==='heavy'?M.rust:M.yellow;
 const body=box(group,0,1.03,0,.62,.85,.36,coat);body.scale.setScalar(scale);
 box(group,0,1.65,.015,.44,.47,.42,skin).scale.setScalar(scale);
 ball(group,0,1.96,.025,.22,skin,1,.85,.92).scale.multiplyScalar(scale);
 box(group,0,1.67,-.025,.47,.12,.43,trim).scale.setScalar(scale);
 for(const side of [-1,1]){
  const leg=box(group,side*.18,.42,0,.2,.65,.25,type==='heavy'?M.dark:coat);leg.scale.setScalar(scale);
  const arm=box(group,side*.4,1.08,0,.19,.68,.22,coat);arm.rotation.z=side*-.13;arm.scale.setScalar(scale);
  ball(group,side*.095,1.99,.205,.035,M.red).scale.multiplyScalar(scale);
 }
 if(type==='ranged'&&!isBoss){box(group,.38,1.03,.22,.11,.14,.72,M.dark,-.18);box(group,.37,1.03,.64,.13,.12,.19,M.rust,-.18);}
 if(type==='heavy'||isBoss){box(group,-.23,1.12,.25,.24,.3,.22,M.metal);box(group,.24,1.1,.24,.22,.28,.2,M.metal);}
 if(isBoss){box(group,0,2.25,0,.82,.16,.48,M.yellow);for(let i=-1;i<=1;i++)box(group,i*.29,2.4,0,.1,.25,.1,M.rust);}
 const hp=isBoss?330:type==='heavy'?105:type==='ranged'?45:55;
 const e={group,type,hp,maxHp:hp,speed:isBoss?1.35:type==='heavy'?.88:type==='ranged'?1.35:1.75,damage:isBoss?17:type==='heavy'?17:type==='ranged'?9:11,range:isBoss?2.45:type==='heavy'?1.55:type==='ranged'?7:1.35,attackCd:1+Math.random(),stun:0,flash:0,dead:false,isBoss,phase:1,bodyParts:group.children};
 group.traverse(o=>{if(o.isMesh){o.userData.enemy=e;}});enemies.push(e);if(isBoss)boss=e;return e;
}
function spawnWave(n){wave=n;const waveText=$('wave-text');waveText.textContent=n<3?`WAVE 0${n} / 03`:'FINAL SHIFT';$('objective-text').textContent=n===3?'CLOCK OUT THE FOREMAN':'CLEAR THE COURTYARD';
 if(n===1){[["melee",-10,-9],["melee",9,-10],["ranged",-4,-12],["melee",5,-3]].forEach(a=>makeEnemy(...a));toast('SHIFT 01 — THE TENANTS ARE UPSET');}
 else if(n===2){[["melee",-11,-9],["ranged",10,-10],["heavy",-7,-13],["melee",7,-7],["ranged",1,-13]].forEach(a=>makeEnemy(...a));toast('SHIFT 02 — MANAGEMENT SENT A HEAVY');}
 else {makeEnemy('heavy',-9,-12);makeEnemy('ranged',9,-12);makeEnemy('melee',-2,-13);makeEnemy('melee',3,-11);makeEnemy('heavy',0,-15,true);$('boss-bar-wrap').classList.remove('hidden');toast('FINAL SHIFT — THE FOREMAN HAS A CLIPBOARD');}
 updateHud();
}
function makeChest(x,z,opened=false){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);box(g,0,.42,0,.95,.72,.72,M.rust);box(g,0,.83,-.02,1,.16,.78,M.yellow);box(g,0,.58,.371,.12,.27,.04,M.metal);for(const xx of [-.38,.38])box(g,xx,.42,.38,.08,.42,.05,M.yellow);const light=new THREE.PointLight(0xd19c44,0,3);light.position.set(0,1,0);g.add(light);const c={group:g,light,opened};chests.push(c);return c;}
makeChest(-11,2);makeChest(11,-1);makeChest(0,-11);
function addDrop(x,z,value){const g=new THREE.Group();g.position.set(x,.5,z);scene.add(g);cyl(g,0,0,0,.17,.17,.08,M.glow,10).rotation.x=Math.PI/2;const s=box(g,0,0,.04,.16,.16,.16,M.yellow);s.rotation.y=.6;drops.push({group:g,value,age:0});}
function rewardKill(e){player.kills++;player.hp=Math.min(player.maxHp,player.hp+3);const value=e.isBoss?45:e.type==='heavy'?13:e.type==='ranged'?9:7;addDrop(e.group.position.x,e.group.position.z,value);if(Math.random()<.24)addDrop(e.group.position.x+.45,e.group.position.z+.2,5);if(e.isBoss){finished=true;endGame(true);return;}toast(e.type==='heavy'?'HEAVY DUTY. TEMPORARILY.':'TENANT RESOLVED.',1000);updateHud();}
function hitEnemy(e,damage,stun=0){if(e.dead)return;e.hp-=damage;e.stun=Math.max(e.stun,stun);e.flash=.12;e.group.traverse(o=>{if(o.isMesh)o.material.emissive=new THREE.Color(0x7d241b);});if(e.hp<=0){e.dead=true;scene.remove(e.group);const i=enemies.indexOf(e);if(i>=0)enemies.splice(i,1);rewardKill(e);}updateHud();}
function attack(){if(!running||player.dead||fireCd>0)return;fireCd=.42;player.buff=.12;cameraRig.position.z=.06;cameraRig.rotation.x=-.15;setTimeout(()=>{cameraRig.position.z=0;cameraRig.rotation.x=0;},90);const dir=new THREE.Vector3();camera.getWorldDirection(dir);const ray=new THREE.Raycaster(camera.position,dir,0,22);const meshes=[];for(const e of enemies)if(!e.dead)e.group.traverse(o=>{if(o.isMesh)meshes.push(o);});const hit=ray.intersectObjects(meshes,false)[0];let found=hit?.object.userData.enemy;if(!found){let nearest=null,dist=22;for(const e of enemies){const p=e.group.position.clone().add(new THREE.Vector3(0,1,0));const d=p.distanceTo(camera.position);const aim=p.sub(camera.position).normalize().dot(dir);if(d<dist&&aim>.993){nearest=e;dist=d;}}found=nearest;}if(found)hitEnemy(found,player.damage,.08);}
function kick(){if(!running||player.dead||player.kickCd>0)return;player.kickCd=1.05;player.buff=.2;const dir=new THREE.Vector3(Math.sin(player.yaw),0,-Math.cos(player.yaw));let target=null,best=2.7;for(const e of enemies){const delta=e.group.position.clone().sub(player.pos);delta.y=0;const d=delta.length();if(d<best&&delta.normalize().dot(dir)>.15){target=e;best=d;}}if(target){hitEnemy(target,target.isBoss?22:target.type==='heavy'?34:48,.8);toast('MANAGEMENT HAS BEEN NOTIFIED.',800);}else toast('A FIRM KICK AT THE VOID.',700);}
function doRoll(){if(!running||player.dead||player.rollCd>0)return;player.roll=.48;player.rollCd=1.35;player.invuln=.48;const forward=new THREE.Vector3(Math.sin(player.yaw),0,-Math.cos(player.yaw));const right=new THREE.Vector3(Math.cos(player.yaw),0,Math.sin(player.yaw));player.rollDir.copy(forward).multiplyScalar(-move.y).addScaledVector(right,move.x);if(player.rollDir.lengthSq()<.1)player.rollDir.copy(forward);player.rollDir.normalize();}
function damagePlayer(amount){if(player.invuln>0||player.dead)return;player.hp=Math.max(0,player.hp-amount);player.lastHurt=time;$('damage-flash').classList.add('active');setTimeout(()=>$('damage-flash').classList.remove('active'),120);updateHud();if(player.hp<=0){player.dead=true;endGame(false);}}
function enemyProjectile(origin,target,damage,speed=6){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),M.enemyGlow);mesh.position.copy(origin);scene.add(mesh);const velocity=target.clone().sub(origin).normalize().multiplyScalar(speed);projectiles.push({mesh,velocity,damage,life:5});}
function updateEnemies(dt){
 for(const e of [...enemies]){
  if(e.dead)continue;e.attackCd-=dt;e.stun=Math.max(0,e.stun-dt);e.flash=Math.max(0,e.flash-dt);
  if(e.flash<=0)e.group.traverse(o=>{if(o.isMesh&&o.material.emissive)o.material.emissive.setHex(0);});
  const delta=player.pos.clone().sub(e.group.position);delta.y=0;const dist=delta.length();const dir=delta.clone().normalize();e.group.rotation.y=Math.atan2(dir.x,dir.z);
  if(e.stun<=0){
   if(e.type==='ranged'&&!e.isBoss){if(dist>e.range+1)e.group.position.addScaledVector(dir,e.speed*dt);else if(dist<e.range-2)e.group.position.addScaledVector(dir,-e.speed*.65*dt);if(e.attackCd<=0&&dist<13){e.attackCd=2.1;enemyProjectile(e.group.position.clone().add(new THREE.Vector3(0,1.3,0)),camera.position.clone().add(new THREE.Vector3(0,-.25,0)),e.damage,6.7);}}
   else if(e.isBoss){if(dist>e.range)e.group.position.addScaledVector(dir,e.speed*dt);if(e.attackCd<=0){if(e.phase===1){e.attackCd=2.0;enemyProjectile(e.group.position.clone().add(new THREE.Vector3(0,1.5,0)),camera.position.clone(),e.damage,7.2);}else{e.attackCd=1.6;if(dist<5)damagePlayer(14);for(let n=0;n<3;n++){const a=n*2.094+time;enemyProjectile(e.group.position.clone().add(new THREE.Vector3(0,1.2,0)),e.group.position.clone().add(new THREE.Vector3(Math.cos(a)*7,1,Math.sin(a)*7)),11,5.2);}}}}
   else if(dist>e.range)e.group.position.addScaledVector(dir,e.speed*dt);
   else if(e.attackCd<=0){e.attackCd=e.type==='heavy'?1.65:1.35;if(dist<e.range+.35)damagePlayer(e.damage);}
  }
  if(e.isBoss){const phase=e.hp<e.maxHp*.52?2:1;if(phase!==e.phase){e.phase=phase;e.speed=1.9;$('boss-phase').textContent='PHASE II · “UNPAID OVERTIME IS MANDATORY”';toast('THE FOREMAN IS NOW VERY MOTIVATED.');} $('boss-bar').style.width=`${Math.max(0,e.hp/e.maxHp*100)}%`;}
 }
 for(let i=projectiles.length-1;i>=0;i--){const p=projectiles[i];p.mesh.position.addScaledVector(p.velocity,dt);p.life-=dt;if(p.mesh.position.distanceTo(camera.position)<.48){damagePlayer(p.damage);scene.remove(p.mesh);projectiles.splice(i,1);continue;}if(p.life<=0||Math.abs(p.mesh.position.x)>18||Math.abs(p.mesh.position.z)>18){scene.remove(p.mesh);projectiles.splice(i,1);}}
 if(enemies.length===0&&running&&!finished){if(waveWait<=0){waveWait=3.3;if(wave<3){$('objective-text').textContent=wave===2?'SUPERVISOR ON THE WAY':'YARD TEMPORARILY CLEAR';toast(wave===2?'YOU HEAR THE SOUND OF A CLIPBOARD.':'A BRIEF AND UNPAID BREAK.');}}else{waveWait-=dt;if(waveWait<=0)spawnWave(wave+1);}}
}
function updateHud(){ $('health-value').textContent=Math.ceil(player.hp);$('health-bar').style.width=`${player.hp/player.maxHp*100}%`;$('credits').textContent=String(player.credits).padStart(2,'0');$('enemy-count').textContent=`${enemies.length} HOSTILE${enemies.length===1?'':'S'}`;$('health-note').textContent=player.hp>75?'YOU LOOK TERRIBLE. STILL ALIVE.':player.hp>40?'THAT WILL LEAVE A MARK.':'THE PAPERWORK IS ALMOST DONE.';}
function nearestChest(){let best=null,distance=2.4;for(const c of chests){if(c.opened)continue;const d=c.group.position.distanceTo(player.pos);if(d<distance){best=c;distance=d;}}return best;}
function interact(){const c=nearestChest();if(!c){toast('NOTHING TO SIGN HERE.',900);return;}c.opened=true;c.group.rotation.x=-.8;c.light.intensity=2.5;const amount=20+Math.floor(Math.random()*21);player.credits+=amount;c.light.color.setHex(0xc69b4c);toast(`CHEST CLAIMED: ${amount} SCRAP CREDITS. TAX NOT INCLUDED.`);updateHud();}
function updateDrops(dt){for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.age+=dt;d.group.rotation.y+=dt*1.3;d.group.position.y=.48+Math.sin(d.age*3)*.12;if(d.group.position.distanceTo(player.pos)<1.25){player.credits+=d.value;scene.remove(d.group);drops.splice(i,1);updateHud();}}}
function updateInteractions(){const c=nearestChest(),el=$('interaction');if(c){$('interaction-text').textContent='OPEN SUPPLY CHEST';el.classList.remove('hidden');}else el.classList.add('hidden');}
function endGame(won){if(finished&&$('end-screen').classList.contains('visible'))return;running=false;finished=true;document.exitPointerLock?.();$('hud').classList.add('hidden');$('end-screen').classList.remove('hidden');$('end-screen').classList.add('visible');$('end-kicker').textContent=won?'SHIFT COMPLETE':'SHIFT TERMINATED';$('end-title').innerHTML=won?'THE YARD IS<br/><em>QUIET.</em>':'PAPERWORK<br/><em>WINS.</em>';$('end-copy').textContent=won?'An accounting error has been corrected. The municipality remains unconvinced.':'The courtyard has filed a complaint against your continued employment.';$('end-stats').textContent=`${player.kills} hostiles removed · ₽${player.credits} recovered · ${Math.ceil(player.hp)}% remaining`;}
function startGame(){player.pos.set(0,0,8);player.yaw=0;player.pitch=0;player.hp=100;player.credits=0;player.kills=0;player.dead=false;player.lastHurt=-99;player.roll=player.rollCd=player.kickCd=player.invuln=0;player.buff=0;player.rollDir.set(0,0,0);fireHeld=false;fireCd=0;move.x=move.y=0;move.sprint=false;touch.moveId=touch.aimId=null;touch.moveOrigin=touch.aimOrigin=null;cameraRig.position.set(0,0,0);cameraRig.rotation.set(0,0,0);wave=0;waveWait=0;finished=false;running=true;boss=null;for(const e of enemies)scene.remove(e.group);enemies.length=0;for(const d of drops)scene.remove(d.group);drops.length=0;for(const p of projectiles)scene.remove(p.mesh);projectiles.length=0;for(const c of chests)scene.remove(c.group);chests.length=0;makeChest(-11,2);makeChest(11,-1);makeChest(0,-11);$('boss-bar').style.width='100%';$('boss-phase').textContent='PHASE I · “YOUR CONTRACT IS IRRELEVANT”';$('end-screen').classList.add('hidden');$('end-screen').classList.remove('visible');$('start-screen').classList.add('hidden');$('hud').classList.remove('hidden');$('boss-bar-wrap').classList.add('hidden');updateHud();spawnWave(1);if(matchMedia('(pointer:fine)').matches)canvas.requestPointerLock?.();}
const keys=new Set();
function setLook(dx,dy){player.yaw-=dx*.0022;player.pitch=Math.max(-1.25,Math.min(1.25,player.pitch-dy*.0022));}
document.addEventListener('keydown',e=>{keys.add(e.code);if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='Space')doRoll();if(e.code==='KeyF')kick();if(e.code==='KeyE'&&running)interact();});
document.addEventListener('keyup',e=>keys.delete(e.code));
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas&&running)setLook(e.movementX,e.movementY);});
document.addEventListener('pointerlockchange',()=>{pointerLocked=document.pointerLockElement===canvas;});
canvas.addEventListener('mousedown',e=>{if(!running)return;if(e.button===0){fireHeld=true;if(document.pointerLockElement!==canvas)canvas.requestPointerLock?.();attack();}});
document.addEventListener('mouseup',e=>{if(e.button===0)fireHeld=false;});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
$('start-btn').addEventListener('click',startGame);$('restart-btn').addEventListener('click',startGame);$('interaction').addEventListener('click',interact);
function bindAction(id,down,up=()=>{}){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();el.setPointerCapture(e.pointerId);down();});for(const type of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,e=>{e.preventDefault();up();});}
bindAction('fire-btn',()=>{fireHeld=true;attack();},()=>fireHeld=false);
bindAction('kick-btn',kick);bindAction('roll-btn',doRoll);bindAction('sprint-btn',()=>move.sprint=true,()=>move.sprint=false);
const moveZone=$('move-zone'),aimZone=$('aim-zone'),moveKnob=$('move-knob'),aimKnob=$('aim-knob');
moveZone.addEventListener('pointerdown',e=>{if(touch.moveId!==null)return;e.preventDefault();touch.moveId=e.pointerId;touch.moveOrigin={x:e.clientX,y:e.clientY};moveZone.setPointerCapture(e.pointerId);});
aimZone.addEventListener('pointerdown',e=>{if(touch.aimId!==null)return;e.preventDefault();touch.aimId=e.pointerId;touch.aimOrigin={x:e.clientX,y:e.clientY};aimZone.setPointerCapture(e.pointerId);});
document.addEventListener('pointermove',e=>{if(e.pointerId===touch.moveId){const dx=e.clientX-touch.moveOrigin.x,dy=e.clientY-touch.moveOrigin.y;const len=Math.hypot(dx,dy),scale=Math.min(1,len/48);move.x=dx/(len||1)*scale;move.y=-dy/(len||1)*scale;moveKnob.style.transform=`translate(calc(-50% + ${Math.max(-35,Math.min(35,dx))}px),calc(-50% + ${Math.max(-35,Math.min(35,dy))}px))`;}if(e.pointerId===touch.aimId){const dx=e.clientX-touch.aimOrigin.x,dy=e.clientY-touch.aimOrigin.y;setLook(dx,dy);touch.aimOrigin={x:e.clientX,y:e.clientY};aimKnob.style.transform=`translate(calc(-50% + ${Math.max(-35,Math.min(35,dx))}px),calc(-50% + ${Math.max(-35,Math.min(35,dy))}px))`;}});
document.addEventListener('pointerup',e=>{if(e.pointerId===touch.moveId){touch.moveId=null;move.x=move.y=0;moveKnob.style.transform='translate(-50%,-50%)';}if(e.pointerId===touch.aimId){touch.aimId=null;aimKnob.style.transform='translate(-50%,-50%)';}});
function updatePlayer(dt){
 fireCd=Math.max(0,fireCd-dt);player.rollCd=Math.max(0,player.rollCd-dt);player.kickCd=Math.max(0,player.kickCd-dt);player.invuln=Math.max(0,player.invuln-dt);
 const x=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+move.x;const y=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0)+move.y;const magnitude=Math.hypot(x,y);const sprint=move.sprint||keys.has('ShiftLeft')||keys.has('ShiftRight');const speed=sprint?7.4:5.1;
 if(player.roll>0){player.roll-=dt;player.pos.addScaledVector(player.rollDir,13*dt);cameraRig.rotation.z=Math.sin((.48-player.roll)/.48*Math.PI)*.35;}
 else{if(magnitude>.05){const norm=Math.min(1,magnitude);const f=new THREE.Vector3(Math.sin(player.yaw),0,-Math.cos(player.yaw));const r=new THREE.Vector3(Math.cos(player.yaw),0,Math.sin(player.yaw));player.pos.addScaledVector(f,y/magnitude*norm*speed*dt);player.pos.addScaledVector(r,x/magnitude*norm*speed*dt);}cameraRig.rotation.z=0;}
 player.pos.x=Math.max(-14,Math.min(14,player.pos.x));player.pos.z=Math.max(-14,Math.min(14,player.pos.z));if(player.hp<player.maxHp&&time-player.lastHurt>6)player.hp=Math.min(player.maxHp,player.hp+3*dt);
 if(fireHeld&&fireCd<=0)attack();
 const bob=(magnitude>.1&&!player.roll)?Math.sin(time*12)*.025:0;camera.position.set(player.pos.x,1.62+bob,player.pos.z);camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(.05,clock.getDelta());time+=dt;if(running){updatePlayer(dt);updateEnemies(dt);updateDrops(dt);updateInteractions();updateHud();if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('toast').classList.remove('show');}}renderer.render(scene,camera);}
const clock=new THREE.Clock();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);});
$('loading').classList.add('hidden');animate();

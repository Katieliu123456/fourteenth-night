import * as T from './three.module.js';
const inkColor='#302e27';
function gradient(){const t=new T.DataTexture(new Uint8Array([100,155,205,245]),4,1,T.RedFormat);t.minFilter=T.NearestFilter;t.magFilter=T.NearestFilter;t.needsUpdate=true;return t;}
const ramp=gradient();
export function makeActor({id='player',gender='male'}={}){
 const root=new T.Group(),resources=new Set(),palette={player:'#6b7062',eileen:'#805a4d',doctor:'#d1cbb2',captain:'#424c4a',louis:'#677066',qin:'#777855',suhe:'#b3b39b',jichuan:'#4b5b5a'};
 const material=(c)=>{const m=new T.MeshToonMaterial({color:c,gradientMap:ramp});resources.add(m);return m;};
 const coat=material(palette[id]||palette.player),pants=material('#494c41'),skin=material('#cfb994'),hair=material(gender==='female'?'#4a372e':'#3b3830'),leather=material('#574338'),shirt=material('#e0d5b9'),brass=material('#ad9461'),ink=new T.MeshBasicMaterial({color:inkColor,side:T.BackSide});resources.add(ink);
 function part(geo,mat,x,y,z,parent=root,outline=true){const mesh=new T.Mesh(geo,mat);resources.add(geo);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);if(outline){const line=new T.Mesh(geo,ink);line.scale.setScalar(1.028);mesh.add(line);}return mesh;}
 const box=(x,y,z,w,h,d,m=coat,p=root)=>part(new T.BoxGeometry(w,h,d),m,x,y,z,p);
 const cylinder=(x,y,z,r1,r2,h,m=coat,p=root)=>part(new T.CylinderGeometry(r1,r2,h,12),m,x,y,z,p);
 const ball=(x,y,z,r,m=skin,p=root)=>part(new T.SphereGeometry(r,16,12),m,x,y,z,p);
 const hips=new T.Group();hips.position.y=.94;root.add(hips);const leftLeg=new T.Group(),rightLeg=new T.Group();leftLeg.position.x=-.145;rightLeg.position.x=.145;hips.add(leftLeg,rightLeg);
 for(const leg of[leftLeg,rightLeg]){cylinder(0,-.36,0,.095,.08,.74,pants,leg);box(0,-.86,.08,.21,.18,.37,leather,leg);box(0,-.96,.08,.22,.05,.38,pants,leg);}
 cylinder(0,1.2,0,.25,.29,.62);cylinder(0,.86,0,.29,.39,.56);box(0,1.36,.243,.24,.42,.035,shirt);box(0,1.34,.278,.055,.36,.025,pants);cylinder(0,1.57,0,.067,.07,.17,skin);
 const head=new T.Group();head.position.y=1.76;root.add(head);const skull=ball(0,0,0,.205,skin,head);skull.scale.set(.88,1.13,.9);const cap=ball(0,.1,-.025,.207,hair,head);cap.scale.set(1,.65,1);if(gender==='female')ball(0,.045,-.2,.105,hair,head);
 for(const side of[-1,1]){box(side*.067,.005,.178,.027,.013,.012,pants,head);box(side*.067,.04,.176,.066,.009,.012,hair,head);}box(0,-.077,.177,.064,.009,.01,pants,head);const nose=box(0,-.035,.192,.027,.065,.03,skin,head);nose.rotation.x=.13;
 const leftArm=new T.Group(),rightArm=new T.Group();leftArm.position.set(-.32,1.43,0);rightArm.position.set(.32,1.43,0);root.add(leftArm,rightArm);
 for(const arm of[leftArm,rightArm]){cylinder(0,-.27,0,.08,.067,.57,coat,arm);ball(0,-.6,0,.075,skin,arm);box(0,-.5,0,.16,.055,.16,shirt,arm);}
 for(let i=0;i<4;i++)ball(.095,1+i*.1,.282,.023,brass);
 if(id==='player'){box(0,1.09,-.27,.43,.47,.15,leather);box(0,1.35,-.29,.43,.1,.17,leather);box(-.19,1.34,-.24,.045,.7,.035,pants);box(.19,1.34,-.24,.045,.7,.035,pants);box(0,1.08,-.358,.11,.09,.025,brass);cylinder(0,1.99,0,.22,.22,.06,pants);box(0,1.98,.15,.35,.025,.2,pants);}
 if(['captain','jichuan','louis'].includes(id)){cylinder(0,1.98,0,.245,.245,.11,pants);box(0,1.95,.18,.4,.035,.22,pants);box(0,1.98,.225,.07,.07,.025,brass);}
 if(['suhe','doctor'].includes(id)){box(0,1.03,.3,.43,.63,.025,shirt);box(-.12,1.42,.309,.08,.018,.02,material('#80584a'));box(-.12,1.42,.309,.018,.08,.022,material('#80584a'));}
 if(id==='eileen'){box(0,1.52,.17,.43,.12,.15,material('#b6a686'));}
 function animate(distance,moving=false,time=0){const phase=distance/2.1*Math.PI*2,amount=moving?.62:0;leftLeg.rotation.x=Math.sin(phase)*amount;rightLeg.rotation.x=-Math.sin(phase)*amount;leftArm.rotation.x=-Math.sin(phase)*amount*.6;rightArm.rotation.x=Math.sin(phase)*amount*.6;hips.position.y=.94+(moving?Math.abs(Math.sin(phase))*.025:0);head.rotation.z=moving?Math.sin(phase)*.012:Math.sin(time*.001)*.007;}
 function dispose(){for(const r of resources)r.dispose?.();}
 return{root,animate,dispose};
}

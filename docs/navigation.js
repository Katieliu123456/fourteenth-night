(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Night14Space=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const rooms={
 cabin:{w:12,d:14,spawn:[0,4.5],objects:{pass:[-3.3,1.12,-3.4],manual:[-3.2,1.15,-2.5],reset:[3.8,.82,-3.6]},blocks:[[-4.5,-4.5,-2.1,-1.7],[2,-1.8,4.9,2.2],[3,-4.1,4.7,-3.1]]},
 lounge:{w:20,d:22,spawn:[0,7.8],objects:{eileen:[-5.3,1.55,-4.6],manifest:[5.4,1.12,-4.2],route:[5.4,1.12,-1.8],score:[-4.6,1.15,4.2]},blocks:[[4.5,-6.5,6.6,.1],[-6.3,-5.5,-4.4,-3.5],[-6.3,2.5,-3.6,5.2],[3.5,4,6.4,6.5]]},
 deck:{w:24,d:24,spawn:[0,8],objects:{boats:[8.2,1.3,-4],camera:[-7,1.6,-6],hatch:[7.7,1.4,5]},blocks:[[7.4,-7.6,10.2,-2.2],[-9,-7.6,-6.4,-5.1],[6.7,3.8,8.9,5.8]]},
 clinic:{w:14,d:16,spawn:[0,5],objects:{doctor:[3.8,1.55,-4.3],calendar:[-5.7,1.6,-3.7],locker:[-5.6,1.4,2.3],records:[3.8,1.12,-2.1]},blocks:[[2.5,-5.4,4.8,-3.3],[2.5,-3,5,-1.3],[-6.5,1.3,-5,3.3],[-4,-5.5,-1.8,-2]]},
 bridge:{w:18,d:18,spawn:[0,6.3],objects:{captain:[-3.9,1.55,-4.2],video:[5.1,1.5,-4.8],logs:[5.1,1.4,-1.3],order:[-3.1,1.12,3.4]},blocks:[[-5,-5.3,-3,-3.3],[4.3,-6.1,6,-3.5],[4.3,-2.5,6,0],[-4.8,2.5,-1.5,4.4]]},
 engine:{w:18,d:22,spawn:[0,8],objects:{louis:[-6.2,1.55,-4.7],relay:[5.2,1.15,3.4],power:[4.8,1.5,-4.8],transfer:[4.8,1.35,-1.3]},blocks:[[-7.4,-6,-5.1,-3.2],[4,-6,6,-3.5],[4,-2.5,6,0],[4,2.4,6.3,4.5],[-2,-4,1.7,2.2]]},
 archive:{w:20,d:26,spawn:[0,10],objects:{consent:[-3.8,1.4,-7.8],ticket:[3.8,1.15,8],final:[0,1.3,-9.4]},blocks:[[-8.9,-9,-6,8],[6,-9,8.9,8],[-4.8,-8.7,-2.9,-6.9],[2.8,7.2,4.9,8.8],[-1.1,-10.5,1.1,-8.5]]}
};
function doors(room,exits){const r=rooms[room];return exits.map((target,i)=>['archive','bridge','lounge','clinic','engine'].includes(room)&&i===0?{id:target,x:0,z:r.d/2-.3,yaw:Math.PI,side:'south'}:i===0?{id:target,x:0,z:-r.d/2+.3,yaw:0,side:'north'}:i===1?{id:target,x:-r.w/2+.3,z:room==='clinic'?5.8:r.d*.2,yaw:Math.PI/2,side:'west'}:{id:target,x:r.w/2-.3,z:r.d*.2,yaw:-Math.PI/2,side:'east'});}
function blocked(room,x,z,radius=.3){const r=rooms[room];if(!r||!Number.isFinite(x)||!Number.isFinite(z))return true;if(Math.abs(x)>r.w/2-radius-.12||Math.abs(z)>r.d/2-radius-.12)return true;return r.blocks.some(b=>{const qx=Math.max(b[0],Math.min(x,b[2])),qz=Math.max(b[1],Math.min(z,b[3]));return (x-qx)**2+(z-qz)**2<radius**2;});}
function move(room,p,dx,dz){let x=p.x,z=p.z;const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));for(let i=0;i<n;i++){if(!blocked(room,x+dx/n,z))x+=dx/n;if(!blocked(room,x,z+dz/n))z+=dz/n;}return{x,z};}
function approach(room,target,position,yaw,maxDistance=2.7){const dx=target.x-position.x,dz=target.z-position.z,distance=Math.hypot(dx,dz);if(distance>maxDistance||distance<.01)return false;return (-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/distance>.64;}
function entry(room,from,exits){const door=doors(room,exits).find(d=>d.id===from);if(!door)return{x:rooms[room].spawn[0],z:rooms[room].spawn[1],yaw:0};return{x:door.x+Math.sin(door.yaw)*1.65,z:door.z+Math.cos(door.yaw)*1.65,yaw:door.yaw+Math.PI};}
function validPose(room,p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Number.isFinite(p.yaw)&&Number.isFinite(p.pitch)&&Math.abs(p.pitch)<1.4&&!blocked(room,p.x,p.z);}
return{rooms,doors,blocked,move,approach,entry,validPose};
});

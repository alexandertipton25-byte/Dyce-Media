import * as T from 'three';
import {MarchingCubes} from 'three/addons/objects/MarchingCubes.js';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
const cache=new Map();
const material=(color)=>new T.MeshStandardMaterial({color,roughness:.94});
const fur=material('#994a40'),cream=material('#edcf99'),nose=material('#674433'),eyeMat=new T.MeshStandardMaterial({color:'#241b16',roughness:.18}),white=material('#fff8e6');
function put(g,geo,m,x=0,y=0,z=0){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
// Smooth union of ellipsoid volumes gives a single continuous sculpted surface.
function sculpt(id,parts,k=.16){if(cache.has(id))return cache.get(id);const size=42,span=3.2,mc=new MarchingCubes(size,fur,false,false,25000);mc.isolation=0;
 const sm=(a,b)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;};
 for(let z=0;z<size;z++)for(let y=0;y<size;y++)for(let x=0;x<size;x++){const px=(x/size*2-1)*span/2,py=(y/size*2-1)*span/2,pz=(z/size*2-1)*span/2;let d=10;for(const [cx,cy,cz,rx,ry,rz] of parts){const dx=px-cx,dy=py-cy,dz=pz-cz;const q=Math.sqrt((dx/rx)**2+(dy/ry)**2+(dz/rz)**2);d=sm(d,(q-1)*Math.min(rx,ry,rz));}mc.field[z*size*size+y*size+x]=-d;}
 mc.update();const geo=new T.BufferGeometry();for(const key of ['position','normal'])geo.setAttribute(key,new T.BufferAttribute(mc.geometry.attributes[key].array.slice(0,mc.count*3),3));geo.scale(span/2,span/2,span/2);geo.deleteAttribute('normal');const smooth=mergeVertices(geo,0.0001);smooth.computeVertexNormals();geo.dispose();mc.geometry.dispose();cache.set(id,smooth);return smooth;}
function ell(g,r,m,x,y,z,s){let o=put(g,new T.SphereGeometry(r,32,24),m,x,y,z);o.scale.set(...s);return o;}
function lock(g,start,end,width=.10,depth=.055){const a=new T.Vector3(...start),b=new T.Vector3(...end),axis=b.clone().sub(a).normalize(),side=new T.Vector3(1,0,0);if(Math.abs(axis.dot(side))>.92)side.set(0,1,0);side.cross(axis).normalize();const up=new T.Vector3().crossVectors(axis,side).normalize(),positions=[],indices=[];for(let i=0;i<=12;i++){const t=i/12,p=a.clone().lerp(b,t);p.z+=Math.sin(Math.PI*t)*.055;const radius=Math.pow(Math.sin(Math.PI*(.08+.92*t)),.8);for(let j=0;j<12;j++){const ang=j/12*Math.PI*2,v=p.clone().addScaledVector(side,Math.cos(ang)*width*radius).addScaledVector(up,Math.sin(ang)*depth*radius);positions.push(...v.toArray());if(i<12){const n=i*12+j,m=i*12+(j+1)%12;indices.push(n,m,n+12,m,m+12,n+12);}}}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();put(g,geo,fur);}
function line(g,points,r,m){put(g,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,r,8,false),m);}
export function mascot(){const g=new T.Group(),skin=material('#a95548'),crease=material('#71392f');
 // The reference's rounded belly, pectorals, broad shoulders and distinct head.
 put(g,sculpt('torso3',[[0,-.2,0,.58,.58,.38],[0,.26,0,.6,.42,.33],[-.48,.35,0,.27,.26,.27],[.48,.35,0,.27,.26,.27],[0,-.29,.18,.49,.4,.3],[-.245,.18,.31,.28,.23,.21],[.245,.18,.31,.28,.23,.21]],.15),skin,0,1.14,0);
 put(g,sculpt('head3',[[0,0,0,.45,.47,.32],[0,-.18,.18,.36,.27,.23],[-.27,-.02,.18,.19,.23,.17],[.27,-.02,.18,.19,.23,.17]],.13),skin,0,1.98,.035);
 // Swept, broad hair locks frame the face and form a pointed beard.
 for(const s of [-1,1]){for(let i=0;i<5;i++){const y=2.23-i*.14;lock(g,[s*(.31+i*.017),y,.09],[s*(.46-i*.014),y-.22,.15],.115,.065);}for(let i=0;i<3;i++)lock(g,[s*(.29-i*.09),1.77,.25],[s*(.21-i*.09),1.53-i*.035,.31],.09,.05);}
 for(let i=0;i<5;i++){const x=-.28+i*.115;lock(g,[x,2.3,.045],[x+.11,2.49+Math.sin(i*.8)*.13,-.005],.105,.065);}lock(g,[-.02,2.28,.28],[.24,2.55,.08],.13,.065);
 // Relaxed closed eyelids, thick brows, a broad smile and cheek dimples.
 const eyes=[];for(const s of [-1,1]){const e=new T.Group();e.position.set(s*.16,2.065,.333);g.add(e);ell(e,1,skin,0,0,.04,[.104,.077,.061]);line(e,[[-.087,0,.074],[0,-.012,.101],[.087,0,.074]],.009,crease);eyes.push(e);line(g,[[s*.07,2.19,.36],[s*.17,2.225,.37],[s*.27,2.18,.325]],.045,fur);ell(g,1,skin,s*.27,1.88,.361,[.105,.1,.072]);line(g,[[s*.3,1.93,.399],[s*.325,1.89,.398],[s*.31,1.85,.405]],.009,crease);}
 put(g,sculpt('nose3',[[0,0,0,.09,.085,.095],[-.06,-.04,.015,.06,.045,.07],[.06,-.04,.015,.06,.045,.07]],.04),skin,0,1.978,.398);
 line(g,[[-.29,1.855,.405],[-.18,1.79,.458],[0,1.765,.482],[.18,1.79,.458],[.29,1.855,.405]],.011,crease);
 line(g,[[-.22,1.765,.424],[0,1.715,.443],[.22,1.765,.424]],.026,skin);
 const arms=[],legs=[];for(const s of [-1,1]){const arm=new T.Group();arm.position.set(s*.55,1.52,0);g.add(arm);put(arm,sculpt('longarm3'+s,[[s*.14,-.15,0,.26,.32,.25],[s*.25,-.43,.025,.23,.36,.24],[s*.25,-.71,.07,.17,.22,.17]],.15),skin);for(let row=0;row<2;row++)for(let j=0;j<3;j++)lock(arm,[s*(.07+j*.1),-.2-row*.25,.2],[s*(.12+j*.1),-.44-row*.25,.21],.075,.042);for(let j=0;j<3;j++)lock(arm,[s*.04,0,.09+j*.04],[s*(.32+j*.08),-.08-j*.07,.1+j*.06],.08,.045);
 // Four curled fingers and a thumb, with joined palm instead of bead-like paws.
 for(let j=0;j<4;j++)line(arm,[[s*(.15+j*.063),-.73,.13],[s*(.15+j*.063),-.86,.16],[s*(.12+j*.063),-.91,.205]],.041,skin);line(arm,[[s*.1,-.7,.14],[s*.04,-.79,.23],[s*.1,-.83,.26]],.055,skin);arms.push(arm);
 const leg=new T.Group();leg.position.set(s*.28,.54,0);g.add(leg);put(leg,sculpt('leg3',[[0,-.13,0,.23,.29,.22],[0,-.32,.14,.25,.14,.33]],.1),skin);for(let j=0;j<4;j++)ell(leg,1,skin,(j-1.5)*.105,-.35,.38,[.062,.069,.095]);for(let j=0;j<3;j++)lock(leg,[(j-1)*.11,-.06,.19],[(j-1)*.13,-.25,.22],.065,.03);legs.push(leg);}
 g.scale.setScalar(.91);g.userData={arms,legs,eyes};return g;
}

import * as T from 'three';
import {MarchingCubes} from 'three/addons/objects/MarchingCubes.js';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
const cache=new Map();
const material=(color)=>new T.MeshStandardMaterial({color,roughness:.94});
const fur=material('#b96d45'),cream=material('#edcf99'),nose=material('#674433'),eyeMat=new T.MeshStandardMaterial({color:'#241b16',roughness:.18}),white=material('#fff8e6');
function put(g,geo,m,x=0,y=0,z=0){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
// Smooth union of ellipsoid volumes gives a single continuous sculpted surface.
function sculpt(id,parts,k=.16){if(cache.has(id))return cache.get(id);const size=42,span=3.2,mc=new MarchingCubes(size,fur,false,false,25000);mc.isolation=0;
 const sm=(a,b)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;};
 for(let z=0;z<size;z++)for(let y=0;y<size;y++)for(let x=0;x<size;x++){const px=(x/size*2-1)*span/2,py=(y/size*2-1)*span/2,pz=(z/size*2-1)*span/2;let d=10;for(const [cx,cy,cz,rx,ry,rz] of parts){const dx=px-cx,dy=py-cy,dz=pz-cz;const q=Math.sqrt((dx/rx)**2+(dy/ry)**2+(dz/rz)**2);d=sm(d,(q-1)*Math.min(rx,ry,rz));}mc.field[z*size*size+y*size+x]=-d;}
 mc.update();const geo=new T.BufferGeometry();for(const key of ['position','normal'])geo.setAttribute(key,new T.BufferAttribute(mc.geometry.attributes[key].array.slice(0,mc.count*3),3));geo.scale(span/2,span/2,span/2);geo.deleteAttribute('normal');const smooth=mergeVertices(geo,0.0001);smooth.computeVertexNormals();geo.dispose();mc.geometry.dispose();cache.set(id,smooth);return smooth;}
function ell(g,r,m,x,y,z,s){let o=put(g,new T.SphereGeometry(r,32,24),m,x,y,z);o.scale.set(...s);return o;}
// Fur is rooted on the sculpt itself, following its normals and flowing downward.
function surfaceFur(g,shape,id,offsetY=0){let geo=cache.get(id);if(!geo){const pieces=[],pos=shape.attributes.position,norm=shape.attributes.normal;const step=Math.max(1,Math.floor(pos.count/420));for(let i=0;i<pos.count;i+=step){const p=new T.Vector3().fromBufferAttribute(pos,i),n=new T.Vector3().fromBufferAttribute(norm,i);if(n.z>.5&&Math.abs(p.x)<.4||p.y<-.6)continue;const len=.07+.035*(.5+.5*Math.sin(i*3.7));const curve=new T.CatmullRomCurve3([p.clone().addScaledVector(n,-.014),p.clone().addScaledVector(n,.025).add(new T.Vector3(.005,-len*.4,0)),p.clone().addScaledVector(n,.016).add(new T.Vector3(.01,-len,0))]);const strand=new T.TubeGeometry(curve,4,.022,5,false),a=strand.attributes.position;for(let j=0;j<a.count;j++){const t=Math.floor(j/6)/4,c=curve.getPointAt(t);a.setXYZ(j,c.x+(a.getX(j)-c.x)*(1-t*.98),c.y+(a.getY(j)-c.y)*(1-t*.98),c.z+(a.getZ(j)-c.z)*(1-t*.98));}strand.computeVertexNormals();pieces.push(strand);}geo=mergeGeometries(pieces);pieces.forEach(p=>p.dispose());cache.set(id,geo);}put(g,geo,fur,0,offsetY,0);}
export function mascot(){const g=new T.Group();
 // Broad low shoulders merge into the head and pear-shaped torso; no neck seam.
 put(g,sculpt('body',[[0,-.22,0,.6,.66,.4],[0,.46,0,.5,.54,.39],[-.42,.05,-.02,.25,.34,.31],[.42,.05,-.02,.25,.34,.31]],.24),fur,0,1.3,0);
 surfaceFur(g,cache.get('body'),'bodyFur',1.3);
 ell(g,1,cream,0,1.03,.345,[.39,.43,.09]);
 // A cream mask and muzzle are sculpted together, keeping the face soft.
 put(g,sculpt('mask',[[0,0,0,.35,.27,.10],[0,-.19,.04,.26,.18,.12]],.11),cream,0,1.87,.365);
 const eyes=[];for(const s of [-1,1]){const e=new T.Group();e.position.set(s*.15,1.91,.463);g.add(e);ell(e,1,nose,0,0,-.006,[.092,.116,.028]);ell(e,1,eyeMat,0,.008,.015,[.072,.09,.035]);ell(e,1,white,-.022,.037,.045,[.018,.021,.012]);ell(e,1,white,.02,-.019,.047,[.008,.009,.006]);eyes.push(e);
 const brow=new T.CatmullRomCurve3([new T.Vector3(s*.075,2.06,.44),new T.Vector3(s*.16,2.09,.435),new T.Vector3(s*.245,2.055,.415)]);put(g,new T.TubeGeometry(brow,16,.025,8,false),fur);}
 ell(g,1,nose,0,1.77,.53,[.077,.044,.055]);const smile=new T.CatmullRomCurve3([new T.Vector3(-.12,1.68,.48),new T.Vector3(0,1.637,.52),new T.Vector3(.12,1.68,.48)]);put(g,new T.TubeGeometry(smile,20,.011,8,false),nose);
 // Tiny relaxed cheeks and a swept forelock.
 for(const s of [-1,1])ell(g,1,cream,s*.2,1.735,.46,[.073,.055,.024]);
 const arms=[],legs=[];for(const s of [-1,1]){const arm=new T.Group();arm.position.set(s*.48,1.36,0);g.add(arm);put(arm,sculpt('arm'+s,[[s*.12,-.16,0,.245,.36,.24],[s*.2,-.45,.04,.215,.26,.21]],.22),fur);surfaceFur(arm,cache.get('arm'+s),'armFur'+s);ell(arm,1,cream,s*.2,-.59,.15,[.16,.13,.105]);for(let j=0;j<3;j++)ell(arm,1,cream,s*.2+(j-1)*.082,-.64,.205,[.047,.066,.043]);arms.push(arm);
 const leg=new T.Group();leg.position.set(s*.29,.58,0);g.add(leg);put(leg,sculpt('leg',[[0,-.12,0,.235,.29,.24],[0,-.31,.13,.265,.16,.35]],.18),fur);for(let j=0;j<3;j++)ell(leg,1,cream,(j-1)*.13,-.36,.39,[.078,.066,.085]);legs.push(leg);}
 g.userData={arms,legs,eyes};return g;
}

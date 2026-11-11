import * as T from 'three';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.82,...extra});
const wood=mat('#ac683b'),ends=mat('#d99a61'),green=mat('#244b35'),leaf=mat('#3d6844'),dark=mat('#173329'),orange=mat('#ef8b35'),cream=mat('#fff8df'),black=mat('#17271f');
function mesh(g,geo,m,x=0,y=0,z=0){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
function box(g,w,h,d,m,x,y,z,r=.07){return mesh(g,new RoundedBoxGeometry(w,h,d,2,r),m,x,y,z)}
function ball(g,r,m,x,y,z,s=[1,1,1]){const o=mesh(g,new T.SphereGeometry(r,24,16),m,x,y,z);o.scale.set(...s);return o;}
function cylinder(g,r,h,m,x,y,z){return mesh(g,new T.CylinderGeometry(r,r,h,20),m,x,y,z)}
function cabin(){const g=new T.Group();
 cylinder(g,2.65,.28,mat('#786744'),0,-.14,0).scale.z=.82;cylinder(g,2.68,.12,mat('#82905b'),0,.02,0).scale.z=.82;
 for(let i=0;i<7;i++){let y=.29+i*.23;for(let z of [-.87,.87]){let o=cylinder(g,.14,2.6,wood,0,y,z);o.rotation.z=Math.PI/2;for(let x of [-1.31,1.31]){o=cylinder(g,.123,.02,ends,x,y,z);o.rotation.z=Math.PI/2;}}for(let x of [-1.08,1.08]){let o=cylinder(g,.14,2.13,wood,x,y,0);o.rotation.x=Math.PI/2;for(let z of [-1.07,1.07]){o=cylinder(g,.122,.02,ends,x,y,z);o.rotation.x=Math.PI/2;}}}
 const shape=new T.Shape();shape.moveTo(-1.2,0);shape.lineTo(1.2,0);shape.lineTo(0,.87);shape.closePath();mesh(g,new T.ExtrudeGeometry(shape,{depth:1.9,bevelEnabled:false}),wood,0,1.67,-.95);
 for(let s of [-1,1]){const o=box(g,1.78,.18,2.55,green,s*.64,2.15,0);o.rotation.z=-s*.64;for(let k=0;k<9;k++){let trim=box(g,1.78,.035,.025,leaf,s*.64,2.25,-1.12+k*.28,.01);trim.rotation.z=-s*.64;}}
 const glow=mat('#ffd77c',{emissive:'#ffb445',emissiveIntensity:.5});box(g,.91,.86,.15,dark,0,1.02,1.03);box(g,.72,.67,.17,glow,0,1.02,1.07);box(g,.06,.73,.19,ends,0,1.02,1.13);box(g,.78,.06,.19,ends,0,1.02,1.13);box(g,1.08,.11,.34,ends,0,.57,1.12);
 box(g,.13,1.17,.65,dark,1.23,.73,0);box(g,.15,1.04,.51,ends,1.25,.71,0);ball(g,.045,orange,1.34,.76,.16);box(g,.6,.12,.85,mat('#bfa481'),1.5,.16,0);
 box(g,.4,.95,.42,mat('#807967'),-.65,2.46,-.5);box(g,.52,.16,.54,dark,-.65,2.96,-.5);
 for(let [x,z,s] of [[-1.85,-.45,1],[1.63,-1.15,.82],[-1.75,1.1,.55]]){cylinder(g,.1,.6,wood,x,.3,z);for(let k=0;k<3;k++)mesh(g,new T.ConeGeometry((.58-k*.12)*s,.85*s,12),k%2?leaf:green,x,(.65+k*.42)*s,z);}
 for(let i=0;i<7;i++)ball(g,.15,mat('#b9ad8b'),Math.sin(i*2)*2.3,.12,Math.cos(i*2)*1.7,[1.4,.7,1]);
 for(let i=0;i<3;i++)box(g,.35,.04,.3,ends,1.5+i*.3,.12,.15+i*.3);
 return g;}
function mascot(){const g=new T.Group();const body=mat('#85a14c'),light=mat('#9db45b');
 ball(g,.83,body,0,1.18,0,[.94,1.12,.78]);ball(g,.62,light,0,1.68,.14,[1,1,.8]);
 for(let x of [-.27,.27]){ball(g,.225,cream,x,1.82,.57,[.85,1.1,.5]);ball(g,.095,black,x+.025,1.82,.67,[.85,1.1,.5]);ball(g,.026,cream,x+.006,1.86,.71);ball(g,.23,dark,x,.23,.13,[1.1,.65,1.55]);let leg=cylinder(g,.105,.35,body,x,.4,.02);}
 const smile=new T.CatmullRomCurve3([new T.Vector3(-.18,1.48,.68),new T.Vector3(0,1.4,.72),new T.Vector3(.18,1.48,.68)]);mesh(g,new T.TubeGeometry(smile,16,.025,8,false),black);
 const arm=new T.Group();arm.position.set(.62,1.48,0);g.add(arm);let a=cylinder(arm,.095,.58,body,.16,.18,0);a.rotation.z=-.65;ball(arm,.14,light,.32,.44,0);g.userData.arm=arm;
 let left=cylinder(g,.1,.65,body,-.72,1.12,0);left.rotation.z=-.3;ball(g,.14,light,-.83,.83,0);
 box(g,.9,.13,.82,orange,0,1.08,.06);box(g,.24,.21,.1,cream,0,1.07,.51);box(g,.12,.1,.04,green,0,1.07,.58);
 for(let x of [-.25,.25]){let a=cylinder(g,.035,.24,body,x,2.3,.08);a.rotation.z=-x;ball(g,.075,orange,x*1.2,2.43,.08);}
 return g;}
function mount(el){let renderer,software=false;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch(e){renderer=new SVGRenderer();renderer.setQuality('low');software=true;}
 const isCabin=el.dataset.model==='cabin',scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,50);if(!software){renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;}el.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 scene.add(new T.HemisphereLight('#fff5dc','#536344',3));let key=new T.DirectionalLight('#fff1d4',4);key.position.set(-3,7,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=5;key.shadow.camera.bottom=-4;key.shadow.bias=-.001;scene.add(key);let rim=new T.DirectionalLight('#ffe1b0',2);rim.position.set(4,3,-3);scene.add(rim);if(software){key.intensity=.65;rim.intensity=.2;scene.children.find(o=>o.isHemisphereLight).intensity=.7;}
 const model=isCabin?cabin():mascot();if(software){model.traverse(o=>{if(o.isMesh){o.material=new T.MeshLambertMaterial({color:o.material.color});if(o.geometry.type==='SphereGeometry')o.geometry=new T.SphereGeometry(o.geometry.parameters.radius,12,8);}});}scene.add(model);model.rotation.y=isCabin?-.5:-.15;
 const floor=mesh(scene,new T.PlaneGeometry(30,30),new T.ShadowMaterial({opacity:.13}),0,-.3,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;if(software)floor.visible=false;
 camera.position.set(isCabin?4:0,isCabin?4.4:2.4,isCabin?8.7:7);camera.lookAt(0,isCabin?1.1:1.3,0);
 let visible=false,target=model.rotation.y,drag=false,lastX=0,lastFrame=0;
 new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}).observe(el);
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;},{rootMargin:'100px'}).observe(el);
 if(isCabin){el.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;el.setPointerCapture(e.pointerId)});el.addEventListener('pointermove',e=>{if(drag){target+=(e.clientX-lastX)*.012;lastX=e.clientX}});el.addEventListener('pointerup',()=>drag=false);el.addEventListener('pointercancel',()=>drag=false);document.querySelector('#spinCabin')?.addEventListener('click',()=>target+=Math.PI*2);}
 function tick(t){requestAnimationFrame(tick);if(t-lastFrame<(software?100:33)||!visible||document.hidden||el.closest('.is-hidden'))return;lastFrame=t;model.rotation.y+=(target-model.rotation.y)*.075;if(!reduced){if(!isCabin){model.position.y=Math.sin(t*.002)*.045;model.userData.arm.rotation.z=Math.sin(t*.004)*.28;model.rotation.y=-.15+Math.sin(t*.0007)*.16;}else if(!drag&&Math.abs(target-model.rotation.y)<.01)model.position.y=Math.sin(t*.001)*.025;}renderer.render(scene,camera);el.dataset.ready='true';}requestAnimationFrame(tick);
}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){observer.unobserve(e.target);mount(e.target)}}),{rootMargin:'200px'});document.querySelectorAll('[data-model]').forEach(e=>observer.observe(e));

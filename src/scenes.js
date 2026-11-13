import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
// The supplied GLB is loaded unchanged. Only camera and neutral studio lights are added.
const el=document.querySelector('[data-model="island"]');
if(el)mount(el);
async function mount(el){const status=el.querySelector('.model-status'),poster=el.querySelector('.model-poster'),pause=document.querySelector('#pauseCabin'),spin=document.querySelector('#spinCabin');let renderer;
 const fail=(message)=>{status.textContent=message;el.dataset.state='fallback';pause.disabled=true;spin.disabled=true;};
 try{const gltf=await new GLTFLoader().loadAsync('assets/models/floating-island.glb',e=>{if(e.total)status.textContent=`Loading 3D island · ${Math.round(e.loaded/e.total*100)}%`;});const model=gltf.scene;
 el.dataset.modelLoaded='true';let meshes=0,textured=0;model.traverse(o=>{if(o.isMesh){meshes++;if(o.material.map)textured++;}});el.dataset.meshes=meshes;el.dataset.texturedMeshes=textured;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true});}catch(e){fail('3D is unavailable in this browser. Showing the original model’s still render.');return;}
 renderer.setPixelRatio(devicePixelRatio);renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NoToneMapping;
 const scene=new T.Scene();scene.add(model);scene.add(new T.HemisphereLight(0xffffff,0xffffff,1.3));const key=new T.DirectionalLight(0xffffff,2);key.position.set(-3,5,4);scene.add(key);const fill=new T.DirectionalLight(0xffffff,.65);fill.position.set(4,2,2);scene.add(fill);
 const bounds=new T.Box3().setFromObject(model),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3()),radius=size.length()/2;
 const camera=new T.PerspectiveCamera(32,1,radius/100,radius*100);const direction=new T.Vector3(.8,.65,1.7).normalize();camera.position.copy(center).addScaledVector(direction,radius*3.6);camera.lookAt(center);
 el.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');const controls=new OrbitControls(camera,renderer.domElement);controls.target.copy(center);controls.enablePan=false;controls.enableDamping=true;controls.minDistance=radius*1.6;controls.maxDistance=radius*8;controls.minPolarAngle=.15;controls.maxPolarAngle=Math.PI*.9;controls.autoRotate=!matchMedia('(prefers-reduced-motion: reduce)').matches;controls.autoRotateSpeed=.45;controls.update();
 let visible=true,last=0,spinRemaining=0;const spherical=new T.Spherical();function rotate(angle){spherical.setFromVector3(camera.position.clone().sub(center));spherical.theta+=angle;camera.position.copy(center).add(new T.Vector3().setFromSpherical(spherical));controls.update();}
 const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};resize();new ResizeObserver(resize).observe(el);new IntersectionObserver(es=>visible=es[0].isIntersecting).observe(el);
 pause.disabled=false;spin.disabled=false;function label(){pause.textContent=controls.autoRotate?'PAUSE MOTION':'RESUME MOTION';pause.setAttribute('aria-pressed',String(!controls.autoRotate));}label();pause.addEventListener('click',()=>{controls.autoRotate=!controls.autoRotate;label();});spin.addEventListener('click',()=>{spinRemaining=Math.PI*2;});el.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();rotate(e.key==='ArrowLeft'?-.12:.12);}else if(e.key==='Home'){camera.position.copy(center).addScaledVector(direction,radius*3.6);controls.update();}});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();poster.hidden=false;renderer.domElement.hidden=true;fail('3D paused by this browser. Reload to try again.');});
 function tick(t){requestAnimationFrame(tick);const dt=Math.min((t-last)/1000,.05);last=t;if(!visible||document.hidden)return;if(spinRemaining>0){const step=Math.min(spinRemaining,dt*.8);rotate(step);spinRemaining-=step;}controls.update(dt);renderer.render(scene,camera);el.dataset.cameraAzimuth=controls.getAzimuthalAngle().toFixed(4);}
 renderer.render(scene,camera);poster.hidden=true;status.textContent='Drag to rotate · Pinch or scroll to zoom';el.dataset.state='ready';requestAnimationFrame(tick);
 }catch(error){console.error('Island model failed to load',error);fail('The 3D island could not load. Showing its still render.');}}

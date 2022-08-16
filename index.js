import * as THREE from "three";
import gsap from 'gsap';
import map from "./img/earth.jpg";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import atmvertexShader from "./shader/atmvertex.glsl";
import atmfragmentShader from "./shader/atmfragment.glsl";
import { Float32BufferAttribute } from "three";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 80, 80),
  //   new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(map) })

  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
        globeTexture: {
            value: new THREE.TextureLoader().load(map)
        }
    }
  })
);
// scene.add(sphere);

const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 80, 80),
    new THREE.ShaderMaterial({
      vertexShader:atmvertexShader,
      fragmentShader:atmfragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
 
    })
  );
camera.position.z = 12;
atmosphere.scale.set(1.15,1.15,1.15);
scene.add(atmosphere);
const group = new THREE.Group()
group.add(sphere);
scene.add(group);

const starGeo= new THREE.BufferGeometry();
const starMateral = new THREE.PointsMaterial({
  color: 0xfffff
})
const starVertices =[];

for(let i =0 ;i<4000; i++){
  const x = (Math.random() - 0.5 ) *2000;
  const y = (Math.random() - 0.5 ) *2000;
  const z = -(Math.random() ) *2000;
  starVertices.push(x,y,z);
}
starGeo.setAttribute("position" ,new Float32BufferAttribute(starVertices , 3))
const stars = new THREE.Points(starGeo, starMateral);
scene.add(stars);

const mouse= {
  x: undefined,
  y:undefined
}
addEventListener("mousemove" ,(e)=>{
  mouse.x = (e.clientX / innerWidth) *2 - 1 ;
  mouse.y = -(e.clientY / innerHeight) *2 + 1 ;
  console.log(mouse);
  
})


function animate() {
  requestAnimationFrame(animate);
  // sphere.rotation.x += 0.01;
  sphere.rotation.z -= 0.005;
  sphere.rotation.y += 0.005;
  gsap.to(group.rotation,{
    y:mouse.x * 0.5,
    x:-mouse.y * 0.5
  })
  renderer.render(scene, camera);
}

animate();

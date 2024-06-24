import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

let scene, camera, renderer, plane, uniforms;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create a plane that fills the screen
  const geometry = new THREE.PlaneGeometry(2, 2);

  // Set up uniforms for the shader
  uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2() },
  };

  // Create shader material
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
  requestAnimationFrame(animate);
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}

init();
animate();

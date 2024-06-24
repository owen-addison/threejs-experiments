import * as THREE from 'three';
import { GUI } from 'dat.gui'; // You may need to install this: npm install dat.gui
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

let scene, camera, renderer, plane, uniforms, gui;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(2, 2);

  uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2() },
    u_noiseScale: { value: 5.0 },
    u_noiseSpeed: { value: 0.2 },
    u_octaves: { value: 5 },
    u_persistence: { value: 0.5 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  setupGUI();
}

function setupGUI() {
  gui = new GUI();
  gui.add(uniforms.u_noiseScale, 'value', 1, 20).name('Noise Scale');
  gui.add(uniforms.u_noiseSpeed, 'value', 0, 1).name('Noise Speed');
  gui.add(uniforms.u_octaves, 'value', 1, 8).step(1).name('Octaves');
  gui.add(uniforms.u_persistence, 'value', 0, 1).name('Persistence');
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

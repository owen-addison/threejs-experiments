import * as THREE from 'three';

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
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
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

function vertexShader() {
  return `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
}

function fragmentShader() {
  return `
    uniform float u_time;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    // 2D Random
    float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      // Four corners in 2D of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      // Smooth Interpolation
      vec2 u = f * f * (3.0 - 2.0 * f);

      // Mix 4 coorners percentages
      return mix(a, b, u.x) +
              (c - a)* u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
    }

    void main() {
      vec2 st = gl_FragCoord.xy/u_resolution.xy;
      st.x *= u_resolution.x/u_resolution.y;

      vec3 color = vec3(0.0);

      // Scale the coordinate system to see some noise in action
      vec2 pos = vec2(st*10.0);

      // Use the noise function
      float n = noise(pos + u_time);

      // Use the noise value to mix between two colors
      color = mix(vec3(0.2, 0.0, 0.5), vec3(0.8, 0.7, 0.0), n);

      gl_FragColor = vec4(color, 1.0);
    }
  `;
}

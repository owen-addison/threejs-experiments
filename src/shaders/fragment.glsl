uniform float u_time;
uniform vec2 u_resolution;
varying vec2 vUv;

// 3D Random
float random(vec3 st) {
    return fract(sin(dot(st.xyz, vec3(12.9898,78.233,53.539))) * 43758.5453123);
}

// 3D Value noise
float noise(vec3 st) {
    vec3 i = floor(st);
    vec3 f = fract(st);
    
    // Eight corners of a cube
    float a = random(i);
    float b = random(i + vec3(1.0, 0.0, 0.0));
    float c = random(i + vec3(0.0, 1.0, 0.0));
    float d = random(i + vec3(1.0, 1.0, 0.0));
    float e = random(i + vec3(0.0, 0.0, 1.0));
    float f_val = random(i + vec3(1.0, 0.0, 1.0));  // Changed 'f' to 'f_val'
    float g = random(i + vec3(0.0, 1.0, 1.0));
    float h = random(i + vec3(1.0, 1.0, 1.0));

    // Smooth interpolation
    vec3 u = f * f * (3.0 - 2.0 * f);

    // Interpolate along z
    float k0 = a + (b - a) * u.x + (c - a) * u.y + (d - b - c + a) * u.x * u.y;
    float k1 = e + (f_val - e) * u.x + (g - e) * u.y + (h - f_val - g + e) * u.x * u.y;
    
    // Interpolate along y
    return k0 + (k1 - k0) * u.z;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);

    // Scale the coordinate system to see some noise in action
    vec2 pos = vec2(st*10.0);

    // Use the noise function with time as the z coordinate
    float n = noise(vec3(pos, u_time * 0.1));

    // Use the noise value to mix between two colors
    color = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 0.0), n);

    gl_FragColor = vec4(color, 1.0);
}
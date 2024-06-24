#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Function to generate 2D Simplex noise
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}

// Function to create fractal Brownian motion (fBm) noise
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // Create gradient background
    vec3 color1 = vec3(0.5, 0.7, 0.5);  // Light green
    vec3 color2 = vec3(0.2, 0.4, 0.3);  // Dark green
    vec3 bgcolor = mix(color1, color2, st.x);
    
    // Create noisy shape
    vec2 pos = st - vec2(0.5);
    float r = length(pos) * 2.0;
    float a = atan(pos.y, pos.x);
    float f = abs(cos(a * 5.0)) * 0.3 + 0.2; // Adjusted to create more "arms"
    float shape = 1.0 - smoothstep(f, f + 0.01, r);
    
    // Apply noise to the shape
    float noise = fbm(pos * 20.0 + u_time * 0.1); // Increased scale for more visible noise
    shape += noise * 0.2; // Increased noise influence
    
    // Create outline effect
    float outline = smoothstep(0.0, 0.1, shape) - smoothstep(0.1, 0.2, shape);
    outline *= 1.0 - smoothstep(0.2, 0.6, r);  // Adjusted to make outline more visible
    
    // Combine background and outline
    vec3 finalColor = mix(bgcolor, vec3(0.0), outline * 0.8); // Increased outline visibility
    
    gl_FragColor = vec4(finalColor, 1.0);
}
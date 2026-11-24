import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 a_pos;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  uniform vec2 u_res;
  uniform float u_time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  float bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x * 0.5 + a.y * a.y * 0.75);
  }
  float bayer4(vec2 a) {
    return bayer2(0.5 * a) * 0.25 + bayer2(a);
  }
  float bayer8(vec2 a) {
    return bayer4(0.5 * a) * 0.25 + bayer2(a);
  }

  vec3 getPalette(int idx) {
    if (idx <= 0) return vec3(0.020, 0.031, 0.086); // #050816 bg
    if (idx == 1) return vec3(0.090, 0.145, 0.522); // #172585 royal blue
    if (idx == 2) return vec3(0.231, 0.220, 0.831); // #3b38d4 electric indigo
    if (idx == 3) return vec3(0.486, 0.227, 0.929); // #7c3aed vibrant violet
    if (idx == 4) return vec3(0.753, 0.518, 0.988); // #c084fc orchid
    return vec3(0.976, 0.659, 0.831);               // #f9a8d4 soft pink core
  }

  void main() {
    float pixelSize = 4.0;
    vec2 cell = floor(gl_FragCoord.xy / pixelSize);
    vec2 uv = (cell * pixelSize) / u_res;
    float aspect = u_res.x / max(u_res.y, 1.0);

    // Rotate ~35 degrees for diagonal ribbon flow
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    float ang = 0.61;
    mat2 r = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    vec2 rp = r * p;

    float t = u_time * 0.22;
    vec2 q = vec2(
      fbm(rp * vec2(1.4, 2.8) + vec2(t, -t * 0.4)),
      fbm(rp * vec2(1.6, 3.0) + vec2(-t * 0.5, t * 0.6) + 4.2)
    );
    float field = fbm(rp * vec2(1.3, 2.6) + 1.35 * q + vec2(t * 0.35, 0.0));

    // Gently drifting luminous focal core in upper-left/mid region
    vec2 glowCenter = vec2(-0.22 + sin(t * 0.8) * 0.12, 0.18 + cos(t * 0.6) * 0.08);
    float glow = exp(-dot(p - glowCenter, p - glowCenter) * 2.4) * 0.38;

    // Shape contrast so dark #050816 negative space stays prominent
    float v = clamp((field - 0.28) * 1.55 + glow, 0.0, 1.0);

    // 8x8 Bayer ordered dithering across 5 palette transitions
    float threshold = bayer8(mod(cell, 8.0));
    float scaled = v * 5.0;
    int band = int(floor(scaled));
    float frac = fract(scaled);
    int finalIdx = band + (frac > threshold ? 1 : 0);

    gl_FragColor = vec4(getPalette(finalIdx), 1.0);
  }
`;

export default function DitherBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Dither shader error:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Dither link error:", gl.getProgramInfoLog(prog));
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.useProgram(prog);
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(prog, "u_res");
    const timeLoc = gl.getUniformLocation(prog, "u_time");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let rafId = 0;

    const render = (now) => {
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, (now - start) * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="w-full h-full block bg-[#050816]"
    />
  );
}

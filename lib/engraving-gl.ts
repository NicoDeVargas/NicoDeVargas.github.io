/**
 * Shader de "gravura": revela uma imagem como se fosse riscada a buril.
 *
 * A tela é dividida em linhas finas (4 px CSS). Cada linha começa a ser
 * riscada num instante próprio (de cima para baixo, com atraso aleatório) e
 * avança da esquerda para a direita. Dentro da linha, os traços escuros
 * aparecem primeiro como hachura fina, que engrossa e incorpora os meios-tons
 * até virar a imagem inteira. Uma ponta de tinta marca onde o buril está.
 *
 * WebGL puro (1 quad, 1 textura). Renderiza sob demanda: só desenha quando o
 * estado muda.
 */

export type EngravingState = {
  reveal: number; // 0 = papel em branco, 1 = gravura completa
  zoom: number; // 1 = cover
  focusX: number; // object-position (0–1)
  focusY: number;
};

export type Engraving = {
  set(state: Partial<EngravingState>): void;
  resize(): void;
  dispose(): void;
};

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uFocus;
uniform float uZoom;
uniform float uReveal;
uniform float uRow;
uniform vec3 uPaper;
uniform vec3 uInk;

float hash(float n) { return fract(sin(n * 91.3458) * 47453.5453); }

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 uv = frag / uRes;

  // object-fit: cover + object-position + zoom
  float ca = uRes.x / uRes.y;
  float ia = uImg.x / uImg.y;
  vec2 scale = ca > ia ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);
  scale /= uZoom;
  vec2 tuv = (1.0 - scale) * uFocus + uv * scale;
  vec3 col = texture2D(uTex, tuv).rgb;

  if (uReveal >= 0.999) { gl_FragColor = vec4(col, 1.0); return; }

  // escuridão 0..1 entre o papel e a tinta
  float lp = dot(uPaper, vec3(0.299, 0.587, 0.114));
  float li = dot(uInk, vec3(0.299, 0.587, 0.114));
  float d = clamp((lp - dot(col, vec3(0.299, 0.587, 0.114))) / (lp - li), 0.0, 1.0);

  float row = floor(frag.y / uRow);
  float ry = row * uRow / uRes.y;
  float start = ry * 0.6 + hash(row) * 0.1 + uv.x * 0.2;
  float local = clamp((uReveal * 1.08 - start) / 0.18, 0.0, 1.0);

  float inRow = fract(frag.y / uRow);
  float stripe = abs(inRow - 0.5) * 2.0;
  float w = mix(0.1, 1.08, local);
  float lineMask = 1.0 - smoothstep(w - 0.22, w, stripe);
  float thr = 1.0 - local * 1.2;
  float tone = smoothstep(thr, thr + 0.14, d);
  float a = lineMask * tone;
  a = mix(a, 1.0, smoothstep(0.78, 1.0, local));

  vec3 lineCol = mix(col, uInk, 0.3 * (1.0 - local));
  vec3 outc = mix(uPaper, lineCol, a);

  // ponta do buril: um traço curto de tinta na frente de cada linha
  float tip = smoothstep(0.0, 0.015, local) * (1.0 - smoothstep(0.015, 0.09, local));
  float thin = 1.0 - smoothstep(0.15, 0.4, stripe);
  outc = mix(outc, uInk, tip * thin * 0.7);

  gl_FragColor = vec4(outc, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function createEngraving(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  initial: EngravingState,
  colors = { paper: "#fbf8ec", ink: "#3b2bb8" },
): Engraving | null {
  const opts: WebGLContextAttributes = {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: "low-power",
  };
  const gl2 = canvas.getContext("webgl2", opts) as WebGL2RenderingContext | null;
  const gl = (gl2 ?? canvas.getContext("webgl", opts)) as WebGLRenderingContext | null;
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (gl2) {
    // WebGL2 aceita mipmap em textura não-potência-de-2: evita moiré nas hachuras.
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = u("uRes");
  const uImg = u("uImg");
  const uFocus = u("uFocus");
  const uZoom = u("uZoom");
  const uReveal = u("uReveal");
  const uRow = u("uRow");
  gl.uniform1i(u("uTex"), 0);
  gl.uniform3fv(u("uPaper"), hexToRgb(colors.paper));
  gl.uniform3fv(u("uInk"), hexToRgb(colors.ink));
  gl.uniform2f(uImg, image.naturalWidth, image.naturalHeight);

  const state: EngravingState = { ...initial };
  let dpr = 1;
  let frame = 0;
  let disposed = false;

  const draw = () => {
    frame = 0;
    if (disposed) return;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uFocus, state.focusX, state.focusY);
    gl.uniform1f(uZoom, state.zoom);
    gl.uniform1f(uReveal, state.reveal);
    gl.uniform1f(uRow, 4 * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const schedule = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(draw);
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    schedule();
  };
  resize();

  return {
    set(next) {
      let changed = false;
      for (const k of Object.keys(next) as (keyof EngravingState)[]) {
        const v = next[k];
        if (v !== undefined && Math.abs(state[k] - v) > 1e-4) {
          state[k] = v;
          changed = true;
        }
      }
      if (changed) schedule();
    },
    resize,
    dispose() {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

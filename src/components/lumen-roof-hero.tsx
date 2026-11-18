import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDownRight } from "lucide-react";

const images = {
  skyM: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040343_a73684b4-3f71-4613-a843-c8be80fb1211.png&w=1600&q=80",
  skyN: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040308_f31964ab-ed8e-4ea4-90eb-3226c0859936.png&w=1600&q=80",
  groundM: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040259_1be34093-835e-4de4-b3a8-f875e6a74591.png&w=2560&q=85",
  homeM: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040416_e3b05fa4-cc80-4a43-afde-8a0a053933e9.png&w=2560&q=85",
  groundN: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040211_c8fd4865-285e-4c1f-8a37-4bfe0771357b.png&w=2560&q=85",
  homeN: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040415_2ab95096-8c39-449f-b36c-17c2813815a4.png&w=2560&q=85",
};

const vertex = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0,1);}`;
const fragment = `#version 300 es
precision highp float; uniform vec2 R; uniform float T,S,K; out vec4 O;
float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float sm(float a,float b,float x){return a>b?1.-smoothstep(b,a,x):smoothstep(a,b,x);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;mat2 m=mat2(1.6,1.2,-1.2,1.6);p=mat2(.8,.6,-.6,.8)*p+5.3;for(int i=0;i<5;i++){s+=a*n(p);p=m*p;a*=.5;}return s;}
void main(){vec2 uv=gl_FragCoord.xy/R;uv.y=1.-uv.y;float asp=R.x/R.y;vec2 p=vec2(uv.x*asp,uv.y);float t=T*.05;vec2 w=vec2(fbm(p*1.3+vec2(t,-t*.6)),fbm(p*1.3+vec2(-t*.8,t)+7.));float d=fbm(p*1.9+w*1.7+vec2(t*1.6,-t*1.1+S*.5));float e=fbm(p*.9-w+vec2(-t,t*.5)+3.);float low=smoothstep(.70,1.04,uv.y+(d-.5)*.34);float side=sm(.2,.0,uv.x+(e-.5)*.28)+sm(.8,1.,uv.x+(e-.5)*.28);side*=smoothstep(.25,.6,uv.y)*.2;float wisps=smoothstep(.5,.78,d)*smoothstep(.22,.5,uv.y)*sm(.86,.6,uv.y)*.18;float rest=clamp(low+side+wisps,0.,1.);float front=1.02-S*.68;float rise=smoothstep(front-.02,front+.26,uv.y+(d-.5)*.5);float haze=S*(.3+.46*d);float a=clamp(max(rest,max(rise*.97,haze)),0.,1.);vec3 dayA=vec3(.97,.93,.84),dayB=vec3(.79,.78,.71),nightA=vec3(.40,.45,.57),nightB=vec3(.15,.19,.29);vec3 c=mix(mix(dayB,dayA,d*1.15),mix(nightB,nightA,d*1.1),K);float porch=exp(-dot((uv-vec2(.72,.74))*vec2(1.7,2.6),(uv-vec2(.72,.74))*vec2(1.7,2.6))*3.2);c=mix(c,vec3(.86,.55,.27),K*porch*.42*(1.-S));O=vec4(c*a,a);}`;

type GLState = { gl: WebGL2RenderingContext; program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> };

export function LumenRoofHero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const glState = useRef<GLState | null>(null);
  const [night, setNight] = useState(true);
  const target = useRef(1);
  const busy = useRef(false);
  const queued = useRef<number | null>(null);
  const current = useRef(1);
  const [pressed, setPressed] = useState(1);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const gl = c.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(shader)); return null; }
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(program)); return; }
    gl.useProgram(program);
    glState.current = { gl, program, uniforms: Object.fromEntries(["R", "T", "S", "K"].map((name) => [name, gl.getUniformLocation(program, name)])) };
    return () => { glState.current = null; gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); };
  }, []);

  useEffect(() => {
    let raf = 0, start = -1e9, from = 1, swap = false, surge = 0, dip = 0, k2 = 1;
    let activeTarget = 1, animating = false;
    const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const begin = (n: number, now: number) => { activeTarget = n; target.current = n; from = current.current; start = now; swap = false; animating = true; busy.current = true; };
    const switchHandler = (event: Event) => begin((event as CustomEvent<number>).detail, performance.now());
    addEventListener("lumen-switch", switchHandler);
    const draw = (now: number) => {
      let y = 0, k = current.current;
      if (animating) {
        const d = now - start;
        if (d < 240) { const x = d / 240; y = x * x * (3 - 2 * x) * .27; }
        else {
          if (!swap) { swap = true; setNight(!!activeTarget); }
          y = Math.pow(1 - Math.max(0, Math.min(1, (d - 240) / 820)), 3.4) * .27;
        }
        surge = smooth(0, 220.8, d) * (1 - smooth(310, 994.4, d));
        dip = smooth(30, 190, d) * (1 - smooth(330, 720, d));
        current.current = from + (activeTarget - from) * smooth(120, 520, d);
        k = current.current; k2 = from + (activeTarget - from) * smooth(340, 760, d);
        if (d >= 1060) {
          animating = false; busy.current = false; k = k2 = current.current = activeTarget; surge = dip = 0;
          const next = queued.current; queued.current = null;
          if (next !== null && next !== activeTarget) begin(next, now);
        }
      }
      const el = canvas.current;
      if (el) {
        const scene = el.closest<HTMLElement>(".lumen-hero");
        scene?.style.setProperty("--sink", `${y * window.innerHeight}px`);
        scene?.style.setProperty("--k", String(k)); scene?.style.setProperty("--k2", String(k2)); scene?.style.setProperty("--dip", String(dip));
        document.documentElement.style.setProperty("--lumen-k", String(k)); document.documentElement.style.setProperty("--lumen-dip", String(dip));
        const state = glState.current;
        if (state) {
          const { gl, uniforms } = state;
          const w = Math.round(Math.min(window.innerWidth, 960)), h = Math.round(w * window.innerHeight / window.innerWidth);
          if (el.width !== w || el.height !== h) { el.width = w; el.height = h; gl.viewport(0, 0, w, h); }
          gl.uniform2f(uniforms["R"], w, h); gl.uniform1f(uniforms["T"], now / 1000); gl.uniform1f(uniforms["S"], surge); gl.uniform1f(uniforms["K"], k); gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    const id = requestAnimationFrame((now) => { raf = requestAnimationFrame(draw); });
    const resize = () => { const el = canvas.current; const state = glState.current; if (el && state) { const w = Math.round(Math.min(innerWidth, 960)), h = Math.round(w * innerHeight / innerWidth); el.width = w; el.height = h; state.gl.viewport(0, 0, w, h); } };
    addEventListener("resize", resize);
    return () => { cancelAnimationFrame(id); cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("lumen-switch", switchHandler); };
  }, []);

  const choose = (n: number) => {
    setPressed(n);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { target.current = n; current.current = n; setNight(!!n); return; }
    if (busy.current) queued.current = n;
    else if (target.current !== n) beginSwitch(n);
  };
  const beginSwitch = (n: number) => {
    // The frame loop reads this shared start request on the next click.
    target.current = n;
    window.dispatchEvent(new CustomEvent("lumen-switch", { detail: n }));
  };
  return (
    <section className="lumen-hero" aria-label="Solar for your home">
      <div className="lumen-sky" aria-hidden="true"><img src={images.skyM} alt="" /><img src={images.skyN} alt="" /></div>
      <div className="lumen-home" aria-hidden="true">
        <div className={`lumen-set ${night ? "" : "is-on"}`}><div className="lumen-ground"><img src={images.groundM} alt="" /></div><img className="lumen-cut" src={images.homeM} alt="" /></div>
        <div className={`lumen-set ${night ? "is-on" : ""}`}><div className="lumen-ground"><img src={images.groundN} alt="" /></div><img className="lumen-cut" src={images.homeN} alt="" /></div>
      </div>
      <div className="lumen-tilt" aria-hidden="true" /><canvas ref={canvas} className="lumen-fog" aria-hidden="true" />
      <div className="lumen-content">
        <h1><span className="lumen-first">₹0 Electricity Bills</span><span><i>for the next</i> <span className="lumen-years">7 Years</span></span></h1>
        <div className="lumen-dock">
          <div className="lumen-toggle" role="group" aria-label="Time of day">
            {[0, 1].map((n) => <button key={n} id={n ? "lumen-night" : "lumen-morning"} type="button" aria-pressed={pressed === n} onClick={() => choose(n)}><b>{n ? "Night" : "Morning"}</b><small>₹0 for Electricity</small></button>)}
          </div>
          <p>Forget the energy market, weather conditions and seasons. Our Smart<br />Controller guarantees you get no electricity bill for seven years.</p>
          <Link to="/calculator" className="lumen-estimate">Estimate your savings <ArrowDownRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}

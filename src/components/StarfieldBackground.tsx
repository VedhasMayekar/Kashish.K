import { useEffect, useRef } from "react";

interface Star { x: number; y: number; r: number; a: number; sp: number; ph: number; gold: boolean }
interface Meteor { x: number; y: number; vx: number; vy: number; life: number; max: number }

export default function StarfieldBackground({ density = 1, nebula = true }: { density?: number; nebula?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, stars: Star[] = [], meteors: Meteor[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0, t0 = performance.now(), last = t0;

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 5200 * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.5 + 0.25,
        sp: Math.random() * 0.5 + 0.1,
        ph: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.22,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50); last = now;
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      if (nebula && !reduce) {
        const g1 = ctx.createRadialGradient(w * 0.25, h * 0.22, 0, w * 0.25, h * 0.22, Math.max(w, h) * 0.55);
        g1.addColorStop(0, "rgba(88,28,135,0.16)"); g1.addColorStop(1, "rgba(88,28,135,0)");
        ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);
        const g2 = ctx.createRadialGradient(w * 0.8, h * 0.78, 0, w * 0.8, h * 0.78, Math.max(w, h) * 0.5);
        g2.addColorStop(0, "rgba(30,27,75,0.22)"); g2.addColorStop(1, "rgba(30,27,75,0)");
        ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
      }

      for (const s of stars) {
        const tw = 0.65 + 0.35 * Math.sin(t * s.sp + s.ph);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.gold ? "#fcd9a0" : "#eef0ff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduce && Math.random() < 0.006 && meteors.length < 2) {
        meteors.push({ x: Math.random() * w * 0.7 + w * 0.15, y: Math.random() * h * 0.25, vx: -3.2, vy: 2.1, life: 0, max: 60 });
      }
      meteors = meteors.filter((m) => m.life < m.max);
      for (const m of meteors) {
        m.x += m.vx * dt * 0.06; m.y += m.vy * dt * 0.06; m.life++;
        const fade = 1 - m.life / m.max;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 22, m.y - m.vy * 22);
        grad.addColorStop(0, `rgba(255,255,255,${0.8 * fade})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 22, m.y - m.vy * 22); ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      ctx.fillStyle = "#050510"; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(88,28,135,0.14)"; ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        ctx.globalAlpha = s.a; ctx.fillStyle = s.gold ? "#fcd9a0" : "#eef0ff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [density, nebula]);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 h-full w-full" />;
}

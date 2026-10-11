import { useEffect, useRef } from 'react';

export default function StarryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Subtle ambient particle setup
    const STAR_COUNT = 75;
    let stars = [];

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.4,
          alpha: Math.random() * 0.6 + 0.2,
          twinkleSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
          color: ['#ffffff', '#38bdf8', '#94a3b8', '#7dd3fc'][Math.floor(Math.random() * 4)],
        });
      }
    }

    initStars();

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Render subtle twinkling ambient stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha >= 0.7 || star.alpha <= 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.7, star.alpha));
        ctx.shadowBlur = star.radius > 1 ? 4 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Executive Dark SaaS Ambient Radial Gradients */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '15%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.07) 0%, rgba(15, 23, 42, 0.02) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(16, 185, 129, 0.02) 45%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Canvas for Subtle Micro Twinkles */}
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

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

    // Star & Sprinkle Particle setup
    const STAR_COUNT = 120;
    const SPRINKLE_COUNT = 40;
    let stars = [];
    let sprinkles = [];

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.6 + 0.5,
          alpha: Math.random(),
          twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
          color: ['#ffffff', '#38bdf8', '#8b5cf6', '#6366f1', '#7dd3fc'][Math.floor(Math.random() * 5)],
        });
      }

      sprinkles = [];
      for (let i = 0; i < SPRINKLE_COUNT; i++) {
        sprinkles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1.5,
          speedY: -(Math.random() * 0.4 + 0.1),
          speedX: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.7 + 0.2,
          pulse: Math.random() * 0.02,
          color: ['rgba(56, 189, 248, ', 'rgba(99, 102, 241, ', 'rgba(139, 92, 246, ', 'rgba(16, 185, 129, '][Math.floor(Math.random() * 4)],
        });
      }
    }

    initStars();

    // Shooting star effect
    let shootingStar = null;
    function spawnShootingStar() {
      if (Math.random() < 0.008 && !shootingStar) {
        shootingStar = {
          x: Math.random() * width,
          y: Math.random() * (height * 0.5),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 10 + 6,
          angle: Math.PI / 4,
          opacity: 1,
        };
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Render Twinkling Stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha >= 1 || star.alpha <= 0.1) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
      });

      // Render Floating Sprinkles / Space Dust
      sprinkles.forEach((s) => {
        s.y += s.speedY;
        s.x += s.speedX;
        s.opacity += s.pulse;
        if (s.opacity > 0.85 || s.opacity < 0.15) s.pulse = -s.pulse;

        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color + Math.max(0.1, Math.min(0.85, s.opacity)) + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color + '0.8)';
        ctx.fill();
      });

      // Render Shooting Star
      spawnShootingStar();
      if (shootingStar) {
        ctx.beginPath();
        const endX = shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle);
        const endY = shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle);
        const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
        grad.addColorStop(0, 'rgba(255, 255, 255, ' + shootingStar.opacity + ')');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        shootingStar.x += shootingStar.speed * Math.cos(shootingStar.angle);
        shootingStar.y += shootingStar.speed * Math.sin(shootingStar.angle);
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar = null;
        }
      }

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
      {/* Background Glowing Nebula Gradients */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '20%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, rgba(16, 185, 129, 0.03) 45%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      
      {/* Canvas for Twinkling Stars & Floating Sprinkles */}
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

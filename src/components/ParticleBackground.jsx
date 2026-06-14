import React, { useEffect, useRef, useCallback } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    const handleMouse = useCallback((e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouse);
        resize();

        // ── SOFT FLOATING DOTS ──
        const dots = Array.from({ length: 70 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseX: 0,
            baseY: 0,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.2,
            radius: 1 + Math.random() * 2.5,
            opacity: 0.15 + Math.random() * 0.35,
            pulseOffset: Math.random() * Math.PI * 2,
        }));

        // Store base positions
        dots.forEach(d => { d.baseX = d.x; d.baseY = d.y; });

        // ── TWINKLING STARS (tiny static dots) ──
        const stars = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 0.3 + Math.random() * 1,
            twinkleSpeed: 0.008 + Math.random() * 0.015,
            offset: Math.random() * Math.PI * 2,
        }));

        // ── DRAW LOOP ──
        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);
            time += 0.006;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // 1. Twinkling stars
            stars.forEach(s => {
                const alpha = 0.2 + 0.3 * Math.sin(time * s.twinkleSpeed * 80 + s.offset);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 220, 255, ${Math.max(0, alpha)})`;
                ctx.fill();
            });

            // 2. Floating dots + connection lines
            dots.forEach((d, i) => {
                // Gentle drift
                d.x += d.vx;
                d.y += d.vy;

                // Wrap around screen edges softly
                if (d.x < -20) d.x = canvas.width + 20;
                if (d.x > canvas.width + 20) d.x = -20;
                if (d.y < -20) d.y = canvas.height + 20;
                if (d.y > canvas.height + 20) d.y = -20;

                // Subtle mouse repulsion
                const dx = mx - d.x;
                const dy = my - d.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    const pushForce = (150 - dist) * 0.0004;
                    d.vx -= dx * pushForce;
                    d.vy -= dy * pushForce;
                }

                // Light damping
                d.vx *= 0.995;
                d.vy *= 0.995;

                // Pulsing opacity
                const pulse = d.opacity * (0.7 + 0.3 * Math.sin(time * 12 + d.pulseOffset));

                // Draw dot
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 220, 240, ${pulse})`;
                ctx.fill();

                // Soft glow for larger dots
                if (d.radius > 2) {
                    ctx.beginPath();
                    ctx.arc(d.x, d.y, d.radius * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 220, 240, ${pulse * 0.08})`;
                    ctx.fill();
                }

                // Connection lines (only check nearby dots)
                for (let j = i + 1; j < dots.length; j++) {
                    const d2 = dots[j];
                    const ddx = d.x - d2.x;
                    const ddy = d.y - d2.y;
                    const dd = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (dd < 130) {
                        const lineAlpha = 0.06 * (1 - dd / 130);
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(d2.x, d2.y);
                        ctx.strokeStyle = `rgba(0, 200, 240, ${lineAlpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            });

            // 3. Mouse glow — a soft radial light that follows cursor
            if (mx > 0 && my > 0) {
                const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
                glowGrad.addColorStop(0, 'rgba(0, 200, 255, 0.04)');
                glowGrad.addColorStop(0.5, 'rgba(0, 180, 255, 0.015)');
                glowGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = glowGrad;
                ctx.fillRect(mx - 200, my - 200, 400, 400);

                // Connect mouse to nearby dots
                dots.forEach(d => {
                    const ddx = mx - d.x;
                    const ddy = my - d.y;
                    const dd = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (dd < 160) {
                        const lineAlpha = 0.1 * (1 - dd / 160);
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(mx, my);
                        ctx.strokeStyle = `rgba(0, 220, 255, ${lineAlpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            }
        };

        animationFrameId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouse);
            cancelAnimationFrame(animationFrameId);
        };
    }, [handleMouse]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            pointerEvents: 'none',
            overflow: 'hidden',
        }}>
            {/* Clean deep gradient background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    radial-gradient(ellipse at 20% 40%, rgba(0, 50, 90, 0.45) 0%, transparent 55%),
                    radial-gradient(ellipse at 75% 70%, rgba(15, 5, 60, 0.3) 0%, transparent 50%),
                    linear-gradient(180deg, #050e1a 0%, #081b29 40%, #071520 100%)
                `,
            }} />

            {/* Subtle animated ambient glow */}
            <div className="bg-ambient-glow" />

            {/* Canvas particles */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                }}
            />

            {/* Soft vignette */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.45) 100%)',
                pointerEvents: 'none',
            }} />
        </div>
    );
};

export default ParticleBackground;

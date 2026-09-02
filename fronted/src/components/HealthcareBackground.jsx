import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
export const HealthcareBackground = () => {
    const canvasRef = useRef(null);
    const location = useLocation();
    const { theme } = useTheme();
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handleMotionChange = (e) => {
            setReducedMotion(e.matches);
        };
        mediaQuery.addEventListener('change', handleMotionChange);
        return () => {
            mediaQuery.removeEventListener('change', handleMotionChange);
        };
    }, []);
    // WebGL / Canvas Atmospheric Sky & Cloud Renderer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        const handleResize = () => {
            if (!canvas)
                return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        const isDark = theme === 'dark';
        const isMobile = width < 768;
        // Cloud Fleet Initialization
        const cloudCount = isMobile ? 6 : 14;
        const clouds = [];
        for (let i = 0; i < cloudCount; i++) {
            const puffCount = 5 + Math.floor(Math.random() * 4);
            const puffs = [];
            for (let p = 0; p < puffCount; p++) {
                puffs.push({
                    offsetX: (Math.random() - 0.5) * 120,
                    offsetY: (Math.random() - 0.5) * 35,
                    radius: 35 + Math.random() * 45,
                });
            }
            clouds.push({
                x: Math.random() * width * 1.5 - width * 0.25,
                y: Math.random() * (height * 0.55),
                scale: 0.7 + Math.random() * 0.6,
                speedX: 0.12 + Math.random() * 0.25,
                opacity: isDark ? 0.08 + Math.random() * 0.12 : 0.25 + Math.random() * 0.35,
                puffs,
            });
        }
        let time = 0;
        const render = () => {
            time += 0.01;
            ctx.clearRect(0, 0, width, height);
            // 1. SKY GRADIENT (Soft Healthcare Mint Green -> Soft Rose Pink -> Crisp White)
            // 1. SKY GRADIENT (White & Soft Rose Pink palette)
            const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
            if (isDark) {
                skyGradient.addColorStop(0, '#0e2a22'); // Dark Mint Emerald Slate
                skyGradient.addColorStop(0.5, '#2a121d'); // Deep Dark Rose Slate
                skyGradient.addColorStop(1, '#090d16'); // Midnight Dark
            }
            else {
                skyGradient.addColorStop(0, '#fce7f3'); // Soft Rose Pink (Top)
                skyGradient.addColorStop(0.5, '#fff1f2'); // Soft Blush Pink (Center)
                skyGradient.addColorStop(1, '#ffffff'); // Pure Crisp White (Bottom)
            }
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);
            // 2. DAYLIGHT AMBIENT ILLUMINATION (Top Right Soft Pink Glow & Top Left Pearl Glow)
            const pinkGlow = ctx.createRadialGradient(width * 0.85, height * 0.15, 10, width * 0.85, height * 0.15, width * 0.45);
            if (isDark) {
                pinkGlow.addColorStop(0, 'rgba(244, 114, 182, 0.15)');
                pinkGlow.addColorStop(1, 'rgba(244, 114, 182, 0)');
            }
            else {
                pinkGlow.addColorStop(0, 'rgba(244, 63, 94, 0.25)'); // Warm Soft Rose Glow
                pinkGlow.addColorStop(0.5, 'rgba(252, 231, 243, 0.2)');
                pinkGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            }
            ctx.fillStyle = pinkGlow;
            ctx.fillRect(0, 0, width, height);
            // Dual Ambient Glow: Pearl Soft Pink Top-Left
            const greenGlow = ctx.createRadialGradient(width * 0.15, height * 0.12, 10, width * 0.15, height * 0.12, width * 0.4);
            if (isDark) {
                greenGlow.addColorStop(0, 'rgba(244, 114, 182, 0.12)');
                greenGlow.addColorStop(1, 'rgba(244, 114, 182, 0)');
            }
            else {
                greenGlow.addColorStop(0, 'rgba(251, 207, 232, 0.35)'); // Pearl Soft Pink Glow
                greenGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            }
            ctx.fillStyle = greenGlow;
            ctx.fillRect(0, 0, width, height);
            // 3. ATMOSPHERIC DRIFTING CLOUDS
            clouds.forEach((cloud) => {
                if (!reducedMotion) {
                    cloud.x += cloud.speedX;
                    if (cloud.x - 150 * cloud.scale > width) {
                        cloud.x = -200 * cloud.scale;
                        cloud.y = Math.random() * (height * 0.5);
                    }
                }
                ctx.save();
                ctx.translate(cloud.x, cloud.y);
                ctx.scale(cloud.scale, cloud.scale);
                cloud.puffs.forEach((puff) => {
                    const puffGrad = ctx.createRadialGradient(puff.offsetX, puff.offsetY, 0, puff.offsetX, puff.offsetY, puff.radius);
                    if (isDark) {
                        puffGrad.addColorStop(0, `rgba(51, 65, 85, ${cloud.opacity})`);
                        puffGrad.addColorStop(0.7, `rgba(30, 41, 59, ${cloud.opacity * 0.5})`);
                        puffGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
                    }
                    else {
                        puffGrad.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity})`);
                        puffGrad.addColorStop(0.6, `rgba(241, 245, 249, ${cloud.opacity * 0.7})`);
                        puffGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    }
                    ctx.fillStyle = puffGrad;
                    ctx.beginPath();
                    ctx.arc(puff.offsetX, puff.offsetY, puff.radius, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.restore();
            });
            animationFrameId = requestAnimationFrame(render);
        };
        animationFrameId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [location.pathname, theme, reducedMotion]);
    // Route-Aware Professional Healthcare Photography Mapping
    const getPhotoVignette = (path) => {
        if (path.includes('/emergency')) {
            return {
                url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?q=80&w=1200&auto=format&fit=crop',
                alt: 'Emergency Ambulance Medical Response',
                position: 'right-top',
            };
        }
        else if (path.includes('/doctors') || path.includes('/book')) {
            return {
                url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop',
                alt: 'Doctor Patient Consultation',
                position: 'right-center',
            };
        }
        else if (path.includes('/hospitals')) {
            return {
                url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
                alt: 'Modern District Hospital Facility',
                position: 'right-bottom',
            };
        }
        else if (path.includes('/portal')) {
            return {
                url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
                alt: 'Healthcare Professional & Patient Care',
                position: 'right-center',
            };
        }
        else if (path === '/login' || path === '/register') {
            return {
                url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop',
                alt: 'Primary Healthcare Examination',
                position: 'left-center',
            };
        }
        // Default Landing Page Healthcare Story Vignette
        return {
            url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1200&auto=format&fit=crop',
            alt: 'Community Healthcare Doctor Teamwork',
            position: 'right-top',
        };
    };
    const currentPhoto = getPhotoVignette(location.pathname);
    const isDark = theme === 'dark';
    return (<div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden select-none">
      {/* Layer 1: Atmospheric Sky & Drift Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full transition-opacity duration-500"/>

      {/* Layer 2: Professional Healthcare Photography Vignette Overlay */}
      <div className={`
          absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out
          ${isDark ? 'opacity-[0.09]' : 'opacity-[0.14]'}
        `}>
        <div className={`
            absolute w-full sm:w-2/3 h-2/3 sm:h-full 
            ${currentPhoto.position.includes('right') ? 'right-0 top-0' : 'left-0 top-0'}
            transition-all duration-700
          `} style={{
            backgroundImage: `url("${currentPhoto.url}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 80%)',
            filter: isDark ? 'contrast(1.1) brightness(0.85)' : 'contrast(1.05) brightness(1.05)',
        }} aria-hidden="true"/>
      </div>
    </div>);
};

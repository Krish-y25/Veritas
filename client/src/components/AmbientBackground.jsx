import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import FOG from 'vanta/dist/vanta.fog.min';

/**
 * Route-aware ambient background:
 * - Landing ('/'): plays looping video (/bg-loop.mp4)
 * - Dashboard ('/dashboard*'): Vanta.js FOG in dark navy, indigo, and cyan
 * - Other routes ('/verify', '/login', etc.): Vanta.js NET
 */
export default function AmbientBackground() {
  const { pathname } = useLocation();

  const mode =
    pathname === '/'
      ? 'video'
      : pathname.startsWith('/dashboard')
      ? 'fog'
      : 'net';

  const containerRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    // Clean up any existing effect before switching mode
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
      vantaEffectRef.current = null;
    }

    if (mode === 'video') {
      return;
    }

    // Respect reduced-motion preferences
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !containerRef.current) {
      return;
    }

    try {
      if (mode === 'fog') {
        vantaEffectRef.current = FOG({
          el: containerRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          baseColor: 0x050816,
          lowlightColor: 0x1e1b4b,
          midtoneColor: 0x4f46e5,
          highlightColor: 0x06b6d4,
          blurFactor: 0.55,
          speed: 2.4,
          zoom: 1.2,
        });
      } else if (mode === 'net') {
        vantaEffectRef.current = NET({
          el: containerRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          backgroundColor: 0x050816,
          color: 0x4f46e5,
          points: 9.0,
          maxDistance: 20.0,
          spacing: 18.0,
          showDots: true,
        });
      }
    } catch (err) {
      console.warn('Vanta WebGL initialization failed, using static fallback:', err);
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#050816]">
      {mode === 'video' ? (
        <video
          src="/bg-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="w-full h-full object-cover opacity-70 motion-reduce:hidden"
        />
      ) : (
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Mode-adapted dark tint and radial vignette layer */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          mode === 'fog' ? 'bg-[#050816]/15' : 'bg-[#050816]/30'
        }`}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            mode === 'fog'
              ? 'radial-gradient(circle at 50% 50%, rgba(5, 8, 22, 0.05) 50%, rgba(5, 8, 22, 0.55) 100%)'
              : 'radial-gradient(circle at 50% 50%, rgba(5, 8, 22, 0.2) 20%, rgba(5, 8, 22, 0.8) 100%)',
        }}
      />
    </div>
  );
}

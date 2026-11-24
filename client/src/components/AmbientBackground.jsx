import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

/**
 * Route-aware ambient background:
 * - Landing ('/'): plays looping video (/bg-loop.mp4)
 * - Other routes: displays interactive Vanta.js NET WebGL background
 * - Overlay vignette preserves high contrast across all pages
 */
export default function AmbientBackground() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const containerRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    // Do not run Vanta on landing page
    if (isLanding) {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
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
    } catch (err) {
      console.warn('Vanta WebGL initialization failed, using static fallback:', err);
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [isLanding]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#050816]">
      {isLanding ? (
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

      {/* Subtle dark tint and radial vignette layer for sharp foreground contrast */}
      <div className="absolute inset-0 bg-[#050816]/30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(5, 8, 22, 0.2) 20%, rgba(5, 8, 22, 0.8) 100%)',
        }}
      />
    </div>
  );
}

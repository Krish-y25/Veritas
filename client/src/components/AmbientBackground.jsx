import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import p5 from 'p5';
import NET from 'vanta/dist/vanta.net.min';
import TRUNK from 'vanta/dist/vanta.trunk.min';
import DitherBackground from './DitherBackground.jsx';

/**
 * Route-aware ambient background:
 * - Landing ('/'): plays looping video (/bg-loop.mp4)
 * - Dashboard ('/dashboard*'): Vanta.js TRUNK with animated p5 tree rings in indigo on navy
 * - Contact ('/contact*'): zero-dependency WebGL Bayer Riso Dither
 * - Other routes ('/verify', '/login', etc.): Vanta.js NET
 */
export default function AmbientBackground() {
  const { pathname } = useLocation();

  const mode =
    pathname === '/'
      ? 'video'
      : pathname.startsWith('/dashboard')
      ? 'trunk'
      : pathname.startsWith('/contact')
      ? 'dither'
      : 'net';

  const containerRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    // Clean up any existing effect before switching mode
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
      vantaEffectRef.current = null;
    }

    if (mode === 'video' || mode === 'dither') {
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
      if (mode === 'trunk') {
        if (typeof window !== 'undefined') {
          window.p5 = p5;
        }
        vantaEffectRef.current = TRUNK({
          el: containerRef.current,
          p5,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x4f46e5,
          backgroundColor: 0x050816,
          spacing: 2.5,
          chaos: 2.5,
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
      console.warn('Vanta initialization failed, using static fallback:', err);
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
      ) : mode === 'dither' ? (
        <DitherBackground />
      ) : (
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Mode-adapted dark tint and radial vignette layer */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          mode === 'dither'
            ? 'bg-[#050816]/20'
            : mode === 'trunk'
            ? 'bg-[#050816]/25'
            : 'bg-[#050816]/30'
        }`}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            mode === 'dither'
              ? 'radial-gradient(circle at 50% 50%, rgba(5, 8, 22, 0.0) 65%, rgba(5, 8, 22, 0.45) 100%)'
              : mode === 'trunk'
              ? 'radial-gradient(circle at 50% 50%, rgba(5, 8, 22, 0.05) 40%, rgba(5, 8, 22, 0.6) 100%)'
              : 'radial-gradient(circle at 50% 50%, rgba(5, 8, 22, 0.2) 20%, rgba(5, 8, 22, 0.8) 100%)',
        }}
      />
    </div>
  );
}

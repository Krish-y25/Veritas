import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import FaqSection from '../components/landing/FaqSection.jsx';

/**
 * Editorial Landing Page presenting the Veritas value proposition against the looping video background.
 */
export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const issuerPath = isAuthenticated ? '/dashboard' : '/login';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto pt-16 sm:pt-28 pb-20 sm:pb-32 px-2 text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-6 max-w-3xl"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono-tech text-[11px] sm:text-xs tracking-widest uppercase text-cyan-300 font-medium">
              VERITAS · CRYPTOGRAPHIC CREDENTIAL REGISTRY
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08]">
            Tamper-proof certificates, verified in seconds.
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
            Deterministic SHA-256 byte hashing guarantees academic credential integrity in memory. No stored files. Zero data leakage. Single-byte tamper detection.
          </p>

          {/* CTA Row */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link
              to="/verify"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium shadow-xl shadow-indigo-500/25 transition-all text-sm group"
            >
              <span>Verify a Certificate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to={issuerPath}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
            >
              <span>Issuer Portal</span>
              <span className="text-cyan-400">→</span>
            </Link>
          </div>

          {/* Trust Strip */}
          <div className="pt-6 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-slate-500 font-mono-tech text-xs tracking-wider uppercase border-t border-white/5 max-w-xl">
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              SHA-256
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              ZERO FILE STORAGE
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              INSTANT QR CHECK
            </span>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* FAQ Section */}
      <FaqSection />

      {/* Minimal Footer */}
      <footer className="w-full max-w-6xl mx-auto py-10 sm:py-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-slate-500">
        <div className="flex items-center gap-2.5">
          <img src="/veritas-logo.png" alt="Veritas" className="h-6 w-6 object-contain" />
          <span className="text-slate-300 font-medium">Veritas</span>
          <span className="text-slate-700">|</span>
          <span>BMS College of Engineering Demo</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link to="/contact" className="hover:text-cyan-300 transition-colors">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}

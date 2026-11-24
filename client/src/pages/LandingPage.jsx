import { Link } from 'react-router-dom';
import { ShieldCheck, Search, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
      <div className="glass-card max-w-2xl w-full p-8 sm:p-12 rounded-2xl border border-white/10 shadow-2xl relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/25">
          <ShieldCheck className="w-9 h-9 text-white" />
        </div>

        {/* DM Mono Eyebrow */}
        <p className="font-mono-tech text-xs tracking-widest uppercase text-cyan-400 font-medium mb-3">
          SECURE CREDENTIAL REGISTRY // CERT-VERIFY
        </p>

        {/* Newsreader Heading */}
        <h1 className="font-serif-display text-4xl sm:text-5xl font-light tracking-tight text-white mb-4 leading-tight">
          Tamper-Proof Certificate Verification
        </h1>

        {/* Inter Body */}
        <p className="text-slate-300 text-base max-w-lg mx-auto mb-8 leading-relaxed font-normal">
          Verify academic and institutional credentials in milliseconds with cryptographic integrity. In-memory hashing without persisting raw PDF files.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/verify"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
          >
            <Search className="w-4 h-4" />
            Verify a Certificate
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium transition-all"
          >
            Issuer Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

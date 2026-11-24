import { ShieldCheck } from 'lucide-react';

export default function Placeholder() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Ambient gradient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-2">
            Veritas
          </h1>

          <p className="text-sm font-medium text-cyan-400/90 mb-4 tracking-wider uppercase">
            Certificate Verification System
          </p>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Scaffold initialized. Backend API and Frontend ready for upcoming features.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Scaffold Ready
          </div>
        </div>
      </div>
    </div>
  );
}

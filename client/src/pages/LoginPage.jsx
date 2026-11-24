import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogIn,
  Loader2,
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowLeft,
  FileCheck2,
  ShieldAlert,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { apiRequest } from '../lib/api.js';

/**
 * Issuer Login Page with an editorial 2-column split, JWT authentication, and demo auto-fill.
 * Subtle staggered Framer Motion entrance matches Veritas editorial aesthetic.
 */
export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@veritas.edu');
    setPassword('VeritasDemo123!');
    setError('');
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center py-4 sm:py-6">
      {/* Back to Home Link */}
      <div className="w-full mb-6 text-left">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
      >
        {/* Left column: Editorial context */}
        <div className="lg:col-span-6 w-full">
          <div className="rounded-2xl border border-white/[0.08] bg-[#050816]/65 backdrop-blur-md p-6 sm:p-7 space-y-4 text-left">
            <p className="font-mono-tech text-xs tracking-widest uppercase text-indigo-300/80 font-medium">
              ISSUER PORTAL · BMSCE
            </p>
            <h1 className="font-serif-display text-3xl sm:text-4xl text-white font-light tracking-tight leading-tight">
              Authorized Credential Registry
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Restricted institutional gateway for issuing, cryptographically signing, and managing official academic records.
            </p>

            <div className="border-t border-white/10 pt-5 mt-6 space-y-3.5">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <KeyRound className="h-4 w-4 text-indigo-300/80 shrink-0" />
                <span>JWT-authenticated issuer sessions</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <FileCheck2 className="h-4 w-4 text-indigo-300/80 shrink-0" />
                <span>Deterministic in-memory SHA-256 signing</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <ShieldAlert className="h-4 w-4 text-indigo-300/80 shrink-0" />
                <span>Instant credential revocation control</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Focused glass sign-in card */}
        <div className="lg:col-span-6 w-full">
          <div className="glass-card p-7 sm:p-8 rounded-2xl border border-white/10 bg-[#0a0f24]/75 backdrop-blur-xl shadow-2xl relative">
            <div className="mb-6 text-left">
              <h2 className="font-serif-display text-2xl text-white font-light">Sign in to continue</h2>
              <p className="text-xs text-slate-400 mt-1">Enter your institutional credentials.</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="issuer@institution.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium bg-white text-[#050816] hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#050816]" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#050816]" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Integrated Demo Credentials helper */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-left">
              <div className="font-mono-tech text-[11px] text-slate-400 space-y-0.5">
                <p><span className="text-slate-500">demo:</span> admin@veritas.edu</p>
                <p><span className="text-slate-500">pass:</span> VeritasDemo123!</p>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-300 hover:text-white transition-colors py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
              >
                <Sparkles className="w-3 h-3 text-indigo-300" />
                <span>Auto-fill</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
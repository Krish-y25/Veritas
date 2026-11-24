import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogIn, Loader2, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { apiRequest } from '../lib/api.js';

/**
 * Issuer Login Page with institutional credential authentication and demo auto-fill.
 * Subtle staggered Framer Motion entrance matches Veritas editorial aesthetic.
 */
export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setEmail('admin@veritas.edu'); setPassword('VeritasDemo123!'); setError('');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-card max-w-md w-full p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl relative"
      >
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.02, ease: 'easeOut' }}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="text-center mb-6 space-y-1.5">
            <p className="font-mono-tech text-xs tracking-widest uppercase text-indigo-300/80 font-medium">ISSUER PORTAL</p>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-light text-white tracking-tight">Issuer Sign In</h1>
            <p className="text-xs text-slate-400 font-normal">Authenticate to manage institutional certificate records.</p>
          </div>
        </motion.div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="issuer@institution.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium bg-white text-[#050816] hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#050816]" /> : (<><LogIn className="w-4 h-4 text-[#050816]" /><span>Sign In</span></>)}
          </button>
        </motion.form>

        {/* Demo Credentials Helper Box */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease: 'easeOut' }}
          className="mt-6 pt-5 border-t border-white/10 text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono-tech text-slate-400 uppercase">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Demo Account</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1 text-[11px] font-mono-tech text-indigo-300 hover:text-indigo-200 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Demo Credentials</span>
            </button>
          </div>
          <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 font-mono-tech text-xs text-slate-400 space-y-0.5">
            <p>email: <span className="text-slate-200">admin@veritas.edu</span></p>
            <p>pass: <span className="text-slate-200">VeritasDemo123!</span></p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileUp,
  Hash,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Cpu,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import FileDropzone from '../components/verify/FileDropzone.jsx';
import VerifyingStepper from '../components/verify/VerifyingStepper.jsx';
import VerifyResultCard from '../components/verify/VerifyResultCard.jsx';

/**
 * Public Verification Page with an editorial 2-column desktop layout.
 * Left column presents unboxed cryptographic guarantees and status legend;
 * Right glass tile hosts the header, tab switcher, and verification panels.
 */
export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('file');
  const [certIdInput, setCertIdInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const autoCheckedRef = useRef(false);

  const runStepper = async () => {
    setCurrentStep(1);
    await new Promise((r) => setTimeout(r, 400));
    setCurrentStep(2);
    await new Promise((r) => setTimeout(r, 400));
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, 400));
  };

  const handleVerifyFile = async (file) => {
    setError('');
    setIsVerifying(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const [res] = await Promise.all([
        apiRequest('/verify/file', { method: 'POST', body: formData }),
        runStepper(),
      ]);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyId = async (idToVerify) => {
    const targetId = (idToVerify || certIdInput).trim().toUpperCase();
    if (!targetId) return setError('Please enter a certificate ID.');
    setError('');
    setIsVerifying(true);
    setResult(null);
    try {
      const [res] = await Promise.all([
        apiRequest(`/verify/${encodeURIComponent(targetId)}`),
        runStepper(),
      ]);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // QR Code deep-link support: /verify?id=CERT-XXXXXX
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && !autoCheckedRef.current) {
      autoCheckedRef.current = true;
      const cleanId = idParam.trim().toUpperCase();
      setActiveTab('id');
      setCertIdInput(cleanId);
      handleVerifyId(cleanId);
    }
  }, [searchParams]);

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

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Unboxed Cryptographic Guarantees & Verification States */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="lg:col-span-5 text-left"
        >
          {/* Cryptographic Trust List */}
          <div>
            <p className="font-mono text-[10px] tracking-wider uppercase text-indigo-300/80 font-medium mb-3">
              CRYPTOGRAPHIC GUARANTEES
            </p>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Cpu className="h-4 w-4 text-indigo-300/80 shrink-0" />
                <span>SHA-256 hashed strictly in memory</span>
              </div>
              <div className="flex items-center gap-3">
                <EyeOff className="h-4 w-4 text-indigo-300/80 shrink-0" />
                <span>Zero file storage — PDFs discarded immediately</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-indigo-300/80 shrink-0" />
                <span>Instant lookup against BMSCE registry</span>
              </div>
            </div>
          </div>

          {/* Hairline Divider + Compact Verification States Legend */}
          <div className="border-t border-white/10 pt-5 mt-5">
            <p className="font-mono text-[10px] tracking-wider uppercase text-slate-400 font-medium mb-3">
              VERIFICATION STATES
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Valid — Authentic &amp; active</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Revoked — Withdrawn by issuer</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>Not Verified — Altered or unrecorded</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Focused Verification Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          className="lg:col-span-7 w-full"
        >
          <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#0a0f24]/75 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {isVerifying ? (
              <VerifyingStepper mode={activeTab} currentStep={currentStep} />
            ) : result ? (
              <VerifyResultCard result={result} onReset={() => { setResult(null); setError(''); }} />
            ) : (
              <div className="space-y-5">
                {/* Header at Top of Tile */}
                <div className="text-left mb-5">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-indigo-300/80 font-medium">
                    PUBLIC VERIFICATION REGISTRY
                  </p>
                  <h1 className="font-serif-display text-2xl sm:text-3xl text-white font-light tracking-tight mt-1">
                    Verify a Certificate
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed font-normal">
                    Instant cryptographic validation via PDF byte hashing or unique certificate ID.
                  </p>
                </div>

                {/* Segmented Control with Sliding Pill Indicator */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 relative">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('file'); setError(''); }}
                    className={`relative py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors z-10 ${
                      activeTab === 'file' ? 'text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {activeTab === 'file' && (
                      <motion.div
                        layoutId="verify-tab-indicator"
                        className="absolute inset-0 bg-white/10 rounded-lg shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <FileUp className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Upload PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('id'); setError(''); }}
                    className={`relative py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors z-10 ${
                      activeTab === 'id' ? 'text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {activeTab === 'id' && (
                      <motion.div
                        layoutId="verify-tab-indicator"
                        className="absolute inset-0 bg-white/10 rounded-lg shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Hash className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Certificate ID</span>
                  </button>
                </div>

                {/* Input Panel with AnimatePresence Crossfade */}
                <AnimatePresence mode="wait">
                  {activeTab === 'file' ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileDropzone onVerify={handleVerifyFile} isSubmitting={isVerifying} />
                    </motion.div>
                  ) : (
                    <motion.form
                      key="id"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={(e) => { e.preventDefault(); handleVerifyId(); }}
                      className="space-y-4 text-left"
                    >
                      <div>
                        <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                          Enter Certificate Identifier
                        </label>
                        <input
                          type="text"
                          value={certIdInput}
                          onChange={(e) => setCertIdInput(e.target.value.toUpperCase())}
                          placeholder="CERT-XXXXXX"
                          className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30 uppercase transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!certIdInput.trim() || isVerifying}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium bg-white text-[#050816] hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        <span>Verify ID</span>
                        <ArrowRight className="w-4 h-4 text-[#050816]" />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
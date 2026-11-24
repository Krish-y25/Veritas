import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
 * Left column presents cryptographic guarantees and status legend;
 * Right column provides focused PDF drag-and-drop and Certificate ID lookup.
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
        {/* Left Column: Editorial Context, Cryptographic Guarantees & Status Legend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="lg:col-span-5 space-y-3.5 text-left"
        >
          <p className="font-mono-tech text-xs tracking-widest uppercase text-indigo-300/80 font-medium">
            PUBLIC VERIFICATION REGISTRY
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-white font-light tracking-tight leading-tight">
            Verify a Certificate
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-normal">
            Instant cryptographic validation via PDF byte hashing or unique certificate identifier.
          </p>

          {/* Compact Cryptographic Trust List */}
          <div className="border-t border-white/10 pt-4 mt-5 space-y-2.5 text-xs text-slate-300">
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

          {/* Compact Status Legend */}
          <div className="border-t border-white/10 pt-4 mt-5">
            <p className="font-mono-tech text-[10px] tracking-wider uppercase text-slate-400 mb-2.5">
              VERIFICATION STATES
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Valid — Authentic &amp; active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Revoked — Withdrawn by issuer</span>
              </div>
              <div className="flex items-center gap-2">
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
                {/* Segmented Control */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('file'); setError(''); }}
                    className={`py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      activeTab === 'file'
                        ? 'bg-white/10 text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileUp className="w-3.5 h-3.5" /> Upload PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('id'); setError(''); }}
                    className={`py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      activeTab === 'id'
                        ? 'bg-white/10 text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5" /> Certificate ID
                  </button>
                </div>

                {activeTab === 'file' ? (
                  <FileDropzone onVerify={handleVerifyFile} isSubmitting={isVerifying} />
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleVerifyId(); }} className="space-y-4 text-left">
                    <div>
                      <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-2">
                        Enter Certificate Identifier
                      </label>
                      <input
                        type="text"
                        value={certIdInput}
                        onChange={(e) => setCertIdInput(e.target.value.toUpperCase())}
                        placeholder="CERT-XXXXXX"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 font-mono-tech text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30 uppercase transition-colors"
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
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
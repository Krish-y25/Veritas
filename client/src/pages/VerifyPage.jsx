import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileUp, Hash, ArrowRight, AlertCircle } from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import FileDropzone from '../components/verify/FileDropzone.jsx';
import VerifyingStepper from '../components/verify/VerifyingStepper.jsx';
import VerifyResultCard from '../components/verify/VerifyResultCard.jsx';

/**
 * Public Verification Page supporting both PDF file upload and Certificate ID lookup.
 * Smooth Framer Motion entrance matches Veritas editorial aesthetic.
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
    <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10">
      {/* 1) Page Header Block — delay 0 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center max-w-xl mx-auto mb-8 space-y-2"
      >
        <p className="font-mono-tech text-xs tracking-widest uppercase text-indigo-300/80 font-medium">
          CRYPTOGRAPHIC VERIFICATION
        </p>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-light text-white tracking-tight">
          Verify a Certificate
        </h1>
        <p className="text-sm text-slate-400 font-normal">
          Instant cryptographic validation via PDF byte hashing or certificate identifier.
        </p>
      </motion.div>

      {/* 2) Main Verification Glass-Card Container — delay ~0.08s */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
        className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {isVerifying ? (
          <VerifyingStepper mode={activeTab} currentStep={currentStep} />
        ) : result ? (
          <VerifyResultCard result={result} onReset={() => { setResult(null); setError(''); }} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/5">
              <button
                type="button"
                onClick={() => { setActiveTab('file'); setError(''); }}
                className={`py-2 rounded-lg text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'file' ? 'bg-white/10 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" /> Upload PDF
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('id'); setError(''); }}
                className={`py-2 rounded-lg text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'id' ? 'bg-white/10 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Hash className="w-3.5 h-3.5" /> Certificate ID
              </button>
            </div>

            {activeTab === 'file' ? (
              <FileDropzone onVerify={handleVerifyFile} isSubmitting={isVerifying} />
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleVerifyId(); }} className="space-y-4">
                <div>
                  <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-2">
                    Enter Certificate Identifier
                  </label>
                  <input
                    type="text"
                    value={certIdInput}
                    onChange={(e) => setCertIdInput(e.target.value.toUpperCase())}
                    placeholder="CERT-XXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 font-mono-tech text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!certIdInput.trim() || isVerifying}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-white text-[#050816] hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <span>Verify ID</span>
                  <ArrowRight className="w-4 h-4 text-[#050816]" />
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

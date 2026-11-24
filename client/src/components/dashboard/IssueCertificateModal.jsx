import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText,
  Check,
  Copy,
  ExternalLink,
  Download,
} from 'lucide-react';
import { apiRequest } from '../../lib/api.js';

/**
 * Modal for issuing certificates via in-memory PDF generation or custom PDF upload.
 * Animated smoothly with Framer Motion on entrance and exit.
 */
export default function IssueCertificateModal({ isOpen, onClose, onIssued }) {
  const [mode, setMode] = useState('generate'); // 'generate' | 'upload'
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('2026');
  const [grade, setGrade] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [issueResult, setIssueResult] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      return setError('Only .pdf files are accepted.');
    }
    if (selected.size > 5 * 1024 * 1024) return setError('PDF file size must not exceed 5MB.');
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let result;
      if (mode === 'generate') {
        result = await apiRequest('/certificates/issue', {
          method: 'POST',
          body: { studentName, course, year: parseInt(year, 10), grade },
        });
      } else {
        if (!file) {
          setError('Please select a certificate PDF file to upload.');
          setIsSubmitting(false);
          return;
        }
        const formData = new FormData();
        formData.append('studentName', studentName);
        formData.append('course', course);
        formData.append('year', year);
        formData.append('grade', grade);
        formData.append('file', file);

        result = await apiRequest('/certificates/issue-with-file', {
          method: 'POST',
          body: formData,
        });
      }

      setIssueResult(result);
      if (onIssued) onIssued(result);
    } catch (err) {
      setError(err.message || 'Failed to issue certificate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = async () => {
    if (!issueResult?.certificate?.certId) return;
    await navigator.clipboard.writeText(issueResult.certificate.certId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!issueResult?.pdfBase64) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${issueResult.pdfBase64}`;
    link.download = `${issueResult.certificate?.certId || 'certificate'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetAndClose = () => {
    setStudentName('');
    setCourse('');
    setYear('2026');
    setGrade('');
    setFile(null);
    setError('');
    setIssueResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Animated Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto z-10"
          >
            <button
              type="button"
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!issueResult ? (
              <div>
                <div className="mb-4 text-left">
                  <p className="font-mono-tech text-xs uppercase tracking-wider text-indigo-300/80">CREDENTIAL ISSUANCE</p>
                  <h2 className="font-serif-display text-2xl sm:text-3xl text-white font-light mt-0.5">Issue Certificate</h2>
                </div>

                {/* Mode Toggle with Animated Pill */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/5 mb-4">
                  <button
                    type="button"
                    onClick={() => { setMode('generate'); setError(''); }}
                    className={`relative flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-colors ${
                      mode === 'generate' ? 'text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'generate' && (
                      <motion.span
                        layoutId="issue-modal-tab"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-white/[0.12] border border-white/10"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Generate PDF
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('upload'); setError(''); }}
                    className={`relative flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-colors ${
                      mode === 'upload' ? 'text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'upload' && (
                      <motion.span
                        layoutId="issue-modal-tab"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-white/[0.12] border border-white/10"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Upload PDF
                    </span>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-left">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="block font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider mb-1">Student Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rohan Kulkarni"
                      className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider mb-1">Course / Degree</label>
                      <input
                        type="text"
                        required
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="B.Tech Computer Science"
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider mb-1">Year</label>
                      <input
                        type="number"
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider mb-1">Grade / Distinction</label>
                    <input
                      type="text"
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="First Class with Distinction"
                      className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  {mode === 'generate' ? (
                    <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-400">
                      <p className="text-[11px] font-mono-tech text-indigo-300/90 leading-relaxed">
                        Generates a printable A4 certificate with the BMSCE logo, QR code, and SHA-256 fingerprint.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider mb-1">Certificate PDF File</label>
                      <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-3 rounded-xl border border-dashed border-white/20 hover:border-indigo-400 text-left flex items-center justify-between transition-colors bg-white/[0.02]"
                      >
                        <span className="text-xs text-slate-300 truncate">{file ? file.name : 'Select certificate PDF (max 5MB)...'}</span>
                        <UploadCloud className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium bg-white text-[#050816] hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-[#050816]" /> : <span>{mode === 'generate' ? 'Generate & Issue Certificate' : 'Upload & Issue Certificate'}</span>}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-mono-tech text-xs text-emerald-400 uppercase tracking-wider">SUCCESSFULLY ISSUED</p>
                  <h3 className="font-serif-display text-2xl text-white font-light mt-1">Certificate Registered</h3>
                </div>

                {/* Cert ID with Copy button */}
                <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 flex items-center justify-between">
                  <span className="font-mono-tech text-sm text-indigo-300 font-medium">
                    {issueResult.certificate?.certId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-[11px] font-mono-tech text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>

                {/* Prominent Download Certificate PDF button */}
                {issueResult.pdfBase64 && (
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-white text-[#050816] hover:bg-slate-200 active:bg-slate-300 text-sm transition-all focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <Download className="w-4 h-4 text-[#050816]" />
                    <span>Download Certificate PDF</span>
                  </button>
                )}

                {/* QR Code preview & download */}
                {issueResult.qrCode && (
                  <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <img src={issueResult.qrCode} alt="Verification QR Code" className="w-28 h-28 rounded-lg bg-white p-1" />
                    <a
                      href={issueResult.qrCode}
                      download={`qr-${issueResult.certificate?.certId}.png`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-slate-300 hover:text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download QR Image</span>
                    </a>
                  </div>
                )}

                <div className="flex gap-2">
                  <a
                    href={issueResult.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-mono-tech text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <span>Open Verify Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
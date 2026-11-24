import { useState, useRef } from 'react';
import { X, UploadCloud, AlertCircle, Loader2, Sparkles, FileText, Check, Copy, ExternalLink, Download } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';

/**
 * Modal for issuing certificates via either in-memory PDF generation or custom PDF upload.
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

  if (!isOpen) return null;

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
    if (mode === 'upload' && !file) return setError('Please choose a certificate PDF to upload.');

    setIsSubmitting(true);
    try {
      let res;
      if (mode === 'generate') {
        res = await apiRequest('/certificates/generate', {
          method: 'POST',
          body: { studentName, course, year, grade },
        });
      } else {
        const formData = new FormData();
        formData.append('studentName', studentName);
        formData.append('course', course);
        formData.append('year', year);
        formData.append('grade', grade);
        formData.append('file', file);
        res = await apiRequest('/certificates', { method: 'POST', body: formData });
      }

      setIssueResult(res);
      onIssued?.();
    } catch (err) {
      setError(err.message || 'Failed to issue certificate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!issueResult?.pdfBase64) return;
    const byteCharacters = atob(issueResult.pdfBase64);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    const blob = new Blob([byteNumbers], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanName = issueResult.certificate?.studentName?.replace(/\s+/g, '_') || 'Student';
    a.download = `${issueResult.certificate?.certId}-${cleanName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyId = () => {
    if (!issueResult?.certificate?.certId) return;
    navigator.clipboard.writeText(issueResult.certificate.certId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!issueResult ? (
          <div>
            <div className="mb-4">
              <p className="font-mono-tech text-xs uppercase tracking-wider text-cyan-400">CREDENTIAL ISSUANCE</p>
              <h2 className="font-serif-display text-2xl sm:text-3xl text-white font-light mt-0.5">Issue Certificate</h2>
            </div>

            {/* Mode Toggle */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/5 mb-4">
              <button
                type="button"
                onClick={() => { setMode('generate'); setError(''); }}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-all ${
                  mode === 'generate' ? 'bg-white/10 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate PDF
              </button>
              <button
                type="button"
                onClick={() => { setMode('upload'); setError(''); }}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-all ${
                  mode === 'upload' ? 'bg-white/10 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Upload PDF
              </button>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rohan Kulkarni"
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
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
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
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
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {mode === 'generate' ? (
                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-400">
                  <p className="text-[11px] font-mono-tech text-cyan-300/90 leading-relaxed">
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
                    className="w-full p-3 rounded-xl border border-dashed border-white/20 hover:border-cyan-400 text-left flex items-center justify-between transition-colors bg-white/[0.02]"
                  >
                    <span className="text-xs text-slate-300 truncate">{file ? file.name : 'Select certificate PDF (max 5MB)...'}</span>
                    <UploadCloud className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 text-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{mode === 'generate' ? 'Generate & Issue Certificate' : 'Upload & Issue Certificate'}</span>}
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
              <span className="font-mono-tech text-sm text-cyan-300 font-medium">
                {issueResult.certificate?.certId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1 text-[11px] font-mono-tech text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
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
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-xl shadow-cyan-500/20 text-sm transition-all"
              >
                <Download className="w-4 h-4" />
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
      </div>
    </div>
  );
}

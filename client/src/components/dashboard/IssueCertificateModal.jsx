import { useState, useRef } from 'react';
import { X, UploadCloud, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../../lib/api.js';
import IssueSuccessView from './IssueSuccessView.jsx';

/**
 * Modal dialog for issuing certificates with PDF hashing and verification QR generation.
 */
export default function IssueCertificateModal({ isOpen, onClose, onIssued }) {
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('2026');
  const [grade, setGrade] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [issueResult, setIssueResult] = useState(null);
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
    if (!file) return setError('Please choose a certificate PDF to issue.');

    setError('');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('studentName', studentName);
      formData.append('course', course);
      formData.append('year', year);
      formData.append('grade', grade);
      formData.append('file', file);

      const res = await apiRequest('/certificates', { method: 'POST', body: formData });
      setIssueResult(res);
      onIssued?.();
    } catch (err) {
      setError(err.message || 'Failed to issue certificate.');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="mb-5">
              <p className="font-mono-tech text-xs uppercase tracking-wider text-cyan-400">CREDENTIAL ISSUANCE</p>
              <h2 className="font-serif-display text-2xl sm:text-3xl text-white font-light mt-1">Issue New Certificate</h2>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1">Course / Degree</label>
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
                  <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1">Year</label>
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
                <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1">Grade / Distinction</label>
                <input
                  type="text"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="First Class with Distinction"
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block font-mono-tech text-xs text-slate-400 uppercase tracking-wider mb-1">Certificate PDF File</label>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 text-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign & Issue Certificate</span>}
              </button>
            </form>
          </div>
        ) : (
          <IssueSuccessView issueResult={issueResult} onClose={handleResetAndClose} />
        )}
      </div>
    </div>
  );
}

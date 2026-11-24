import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldAlert, Copy, Check, RotateCcw } from 'lucide-react';

/**
 * Result card displaying verification status (valid, revoked, not_found) and certificate details.
 */
export default function VerifyResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const { status, message, certificate, computedHash } = result || {};

  const handleCopyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const isValid = status === 'valid';
  const isRevoked = status === 'revoked';
  const isNotFound = status === 'not_found';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full space-y-6 text-left"
    >
      {/* Header status badge */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {isValid && (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          )}
          {isRevoked && (
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
          )}
          {isNotFound && (
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
          )}
          <div>
            <span
              className={`font-mono-tech text-xs tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                isValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : isRevoked
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {isValid
                ? 'Authentic Certificate'
                : isRevoked
                ? 'Certificate Revoked'
                : 'Not Verified'}
            </span>
            <p className="text-xs text-slate-400 mt-1">{message}</p>
          </div>
        </div>
      </div>

      {/* Warning banner for revoked credentials */}
      {isRevoked && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Warning: This credential was revoked by the issuing institution.</span>
        </div>
      )}

      {/* Certificate metadata */}
      {certificate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
          <div>
            <p className="font-mono-tech text-[11px] text-slate-500 uppercase tracking-wider">Student Name</p>
            <p className="text-sm font-semibold text-white">{certificate.studentName}</p>
          </div>
          <div>
            <p className="font-mono-tech text-[11px] text-slate-500 uppercase tracking-wider">Certificate ID</p>
            <p className="font-mono-tech text-sm text-indigo-300 font-medium">{certificate.certId}</p>
          </div>
          <div>
            <p className="font-mono-tech text-[11px] text-slate-500 uppercase tracking-wider">Course / Degree</p>
            <p className="text-sm text-slate-200">{certificate.course}</p>
          </div>
          <div>
            <p className="font-mono-tech text-[11px] text-slate-500 uppercase tracking-wider">Year & Grade</p>
            <p className="text-sm text-slate-200">{certificate.year} • {certificate.grade}</p>
          </div>
          <div>
            <p className="font-mono-tech text-[11px] text-slate-500 uppercase tracking-wider">Issuer</p>
            <p className="text-sm text-slate-200">
              {certificate.issuer?.name || 'Authorized Issuer'}
              <span className="block text-xs text-slate-400">{certificate.issuer?.organization}</span>
            </p>
          </div>
          <div>
            <p className="font-mono-tech text-[11px] text-slate-500 uppercase tracking-wider">Issued Date</p>
            <p className="text-sm text-slate-200">{formatDate(certificate.issuedAt)}</p>
          </div>

          {certificate.fileHash && (
            <div className="sm:col-span-2 pt-2 border-t border-white/5">
              <p className="font-mono-tech text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                SHA-256 Fingerprint
              </p>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
                <span className="font-mono-tech text-xs text-slate-400 truncate">
                  {certificate.fileHash}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyHash(certificate.fileHash)}
                  className="flex items-center gap-1 text-[11px] font-mono-tech text-indigo-300 hover:text-indigo-200 shrink-0 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Computed Hash for not_found */}
      {isNotFound && computedHash && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
          <p className="font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider">
            Computed File Hash (Unregistered)
          </p>
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
            <span className="font-mono-tech text-xs text-rose-300/80 truncate">
              {computedHash}
            </span>
            <button
              type="button"
              onClick={() => handleCopyHash(computedHash)}
              className="flex items-center gap-1 text-[11px] font-mono-tech text-indigo-300 hover:text-indigo-200 shrink-0 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset action */}
      <button
        type="button"
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Verify Another Certificate</span>
      </button>
    </motion.div>
  );
}

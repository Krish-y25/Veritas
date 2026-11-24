import { useState } from 'react';
import { Check, Copy, ExternalLink, Download } from 'lucide-react';

/**
 * Success view rendered inside IssueCertificateModal upon successful certificate registration.
 */
export default function IssueSuccessView({ issueResult, onClose }) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopy = (text, isId = true) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (isId) {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const certId = issueResult?.certificate?.certId;
  const qrCode = issueResult?.qrCode;
  const verifyUrl = issueResult?.verifyUrl;

  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
        <Check className="w-6 h-6" />
      </div>
      <div>
        <p className="font-mono-tech text-xs text-emerald-400 uppercase tracking-wider">SUCCESSFULLY ISSUED</p>
        <h3 className="font-serif-display text-2xl text-white font-light mt-1">Certificate Registered</h3>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 flex items-center justify-between">
        <span className="font-mono-tech text-sm text-indigo-300 font-medium">{certId}</span>
        <button
          type="button"
          onClick={() => handleCopy(certId, true)}
          className="flex items-center gap-1 text-[11px] font-mono-tech text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
        >
          {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
        </button>
      </div>

      {qrCode && (
        <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <img src={qrCode} alt="Verification QR Code" className="w-32 h-32 rounded-lg bg-white p-1" />
          <a
            href={qrCode}
            download={`qr-${certId}.png`}
            className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR Image</span>
          </a>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleCopy(verifyUrl, false)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-mono-tech text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedUrl ? 'Copied URL' : 'Copy Verify URL'}</span>
        </button>
        <a
          href={verifyUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-mono-tech text-white bg-indigo-600/80 hover:bg-indigo-600 transition-colors"
        >
          <span>Open Verify Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
      >
        Close
      </button>
    </div>
  );
}

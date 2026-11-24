import { AlertTriangle, Loader2 } from 'lucide-react';

/**
 * Confirmation dialog before permanently revoking a certificate.
 */
export default function RevokeConfirmModal({ target, onConfirm, onCancel, isRevoking }) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card max-w-sm w-full p-6 rounded-2xl border border-white/10 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-serif-display text-xl text-white font-light">Revoke Certificate?</h4>
          <p className="font-mono-tech text-xs text-amber-300/80 mt-1">{target.certId}</p>
          <p className="text-xs text-slate-400 mt-2">
            This will permanently mark {target.studentName}&apos;s credential as revoked in the registry.
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRevoking}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors disabled:opacity-50"
          >
            {isRevoking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Confirm Revoke</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

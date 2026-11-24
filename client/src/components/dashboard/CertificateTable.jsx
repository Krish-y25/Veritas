import { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import RevokeConfirmModal from './RevokeConfirmModal.jsx';

/**
 * Filterable table of issued certificates with deep-link navigation and revocation action.
 */
export default function CertificateTable({
  certificates = [],
  onSearchChange,
  onRevokeCertificate,
  isRevoking,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [revokeTarget, setRevokeTarget] = useState(null);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearchChange(val);
  };

  const handleConfirmRevoke = async () => {
    if (!revokeTarget) return;
    await onRevokeCertificate(revokeTarget._id);
    setRevokeTarget(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <h3 className="font-serif-display text-xl text-white font-light self-start sm:self-auto">
          Issued Certificates
        </h3>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search student, course, ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.02] border-b border-white/5 font-mono-tech text-[11px] text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Cert ID</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Course & Year</th>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Issued</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-mono-tech text-xs">
                  No matching certificate records found.
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono-tech font-medium text-indigo-300">{cert.certId}</td>
                  <td className="py-3 px-4 font-medium text-white">{cert.studentName}</td>
                  <td className="py-3 px-4 text-slate-300">
                    {cert.course} <span className="text-slate-500">({cert.year})</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{cert.grade}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono-tech text-[10px] uppercase tracking-wider border ${
                        cert.status === 'valid'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono-tech">{formatDate(cert.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/verify?id=${cert.certId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
                        title="Open verify page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {cert.status === 'valid' && (
                        <button
                          type="button"
                          onClick={() => setRevokeTarget(cert)}
                          className="px-2 py-1 rounded text-[11px] font-mono-tech text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RevokeConfirmModal
        target={revokeTarget}
        onConfirm={handleConfirmRevoke}
        onCancel={() => setRevokeTarget(null)}
        isRevoking={isRevoking}
      />
    </div>
  );
}

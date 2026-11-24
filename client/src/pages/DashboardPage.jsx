import { useState, useEffect, useCallback } from 'react';
import { Plus, Building2, User } from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { apiRequest } from '../lib/api.js';
import StatsCards from '../components/dashboard/StatsCards.jsx';
import CertificateTable from '../components/dashboard/CertificateTable.jsx';
import IssueCertificateModal from '../components/dashboard/IssueCertificateModal.jsx';

/**
 * Protected Issuer Dashboard managing institutional stats, issuance, and revocations.
 */
export default function DashboardPage() {
  const { issuer } = useAuth();
  const [stats, setStats] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiRequest('/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchCertificates = useCallback(async (query = '') => {
    try {
      const path = query ? `/certificates?search=${encodeURIComponent(query)}` : '/certificates';
      const data = await apiRequest(path);
      const list = Array.isArray(data) ? data : data?.certificates || [];
      setCertificates(list);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchCertificates();
  }, [fetchStats, fetchCertificates]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    fetchCertificates(query);
  };

  const handleRevoke = async (id) => {
    setIsRevoking(true);
    try {
      await apiRequest(`/certificates/${id}/revoke`, { method: 'PATCH' });
      await Promise.all([fetchStats(), fetchCertificates(searchQuery)]);
    } catch (err) {
      console.error('Revocation failed:', err);
    } finally {
      setIsRevoking(false);
    }
  };

  const handleCertificateIssued = async () => {
    await Promise.all([fetchStats(), fetchCertificates(searchQuery)]);
  };

  return (
    <div className="flex-1 w-full space-y-8 py-4 sm:py-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono-tech text-xs tracking-widest uppercase text-cyan-400 font-medium">
            ISSUER DASHBOARD
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-white font-light tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400 shrink-0" />
            <span>{issuer?.organization || 'Institutional Registry'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{issuer?.name || 'Authorized Officer'}</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono-tech text-slate-400">{issuer?.email}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 text-xs sm:text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Certificate</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <StatsCards stats={stats} isLoading={isLoadingStats} />

      {/* Certificates Table */}
      <CertificateTable
        certificates={certificates}
        onSearchChange={handleSearchChange}
        onRevokeCertificate={handleRevoke}
        isRevoking={isRevoking}
      />

      {/* Issue Certificate Modal */}
      <IssueCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIssued={handleCertificateIssued}
      />
    </div>
  );
}

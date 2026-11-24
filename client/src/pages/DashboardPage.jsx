import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8">
      <div className="glass-card max-w-2xl w-full p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
          <LayoutDashboard className="w-7 h-7 text-indigo-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Issuer Dashboard</h2>
        <p className="text-sm text-slate-400 mb-6">
          Real-time certificate issuance statistics and management table.
        </p>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          Dashboard metrics, certificate table, and issuance modal will be mounted in upcoming task.
        </div>
      </div>
    </div>
  );
}

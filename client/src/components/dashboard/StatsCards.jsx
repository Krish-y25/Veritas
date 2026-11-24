import { FileCheck2, ShieldCheck, AlertTriangle, SearchCheck } from 'lucide-react';

/**
 * 4-card statistics grid displaying live metrics with loading states.
 */
export default function StatsCards({ stats, isLoading }) {
  const cards = [
    {
      title: 'Total Issued',
      value: stats?.totalIssued ?? 0,
      icon: FileCheck2,
      accent: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    },
    {
      title: 'Active / Valid',
      value: stats?.validCount ?? 0,
      icon: ShieldCheck,
      accent: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    },
    {
      title: 'Revoked',
      value: stats?.revokedCount ?? 0,
      icon: AlertTriangle,
      accent: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    },
    {
      title: 'Total Verifications',
      value: stats?.totalVerifications ?? 0,
      icon: SearchCheck,
      accent: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-tech text-xs uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${card.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              {isLoading ? (
                <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
              ) : (
                <span className="font-mono-tech text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  {card.value.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

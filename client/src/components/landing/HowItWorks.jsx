import { FileUp, QrCode, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    label: 'ISSUE & FINGERPRINT',
    title: 'In-Memory Cryptography',
    description:
      'Issuers upload a certificate PDF. Veritas computes its SHA-256 hash in memory and stores only the fingerprint and metadata—never the file.',
    icon: FileUp,
  },
  {
    number: '02',
    label: 'SHARE PDF OR QR',
    title: 'Deterministic Identifiers',
    description:
      'Each credential gets a unique CERT-XXXXXX ID and scannable QR code linking directly to its permanent cryptographic record.',
    icon: QrCode,
  },
  {
    number: '03',
    label: 'INSTANT VERIFICATION',
    title: 'Single-Byte Integrity Check',
    description:
      'Anyone can drop the PDF or scan the QR code to confirm authenticity, detect single-byte tampering, or spot revoked credentials.',
    icon: ShieldCheck,
  },
];

/**
 * Three-step process breakdown highlighting Veritas core cryptographic pipeline.
 */
export default function HowItWorks() {
  return (
    <section className="w-full py-16 sm:py-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <p className="font-mono-tech text-xs tracking-widest uppercase text-cyan-400 font-medium">
            HOW VERITAS WORKS
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Three steps. Zero guesswork.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-normal">
            A frictionless pipeline engineered to guarantee credential authenticity without storing sensitive student files.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="glass-card glass-card-hover p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-xs text-cyan-400 font-semibold tracking-wider">
                      {step.number} // {step.label}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif-display text-2xl text-white font-normal tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                  <span className="font-mono-tech text-[10px] uppercase tracking-wider text-slate-500">
                    Cryptographically immutable
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

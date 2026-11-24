import { motion } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';

const FILE_STEPS = [
  'Reading PDF bytes',
  'Computing SHA-256 fingerprint',
  'Checking Veritas registry',
];

const ID_STEPS = [
  'Validating ID format',
  'Querying Veritas registry',
  'Verifying issuer record',
];

/**
 * Sequential 3-step progress stepper displayed during verification.
 */
export default function VerifyingStepper({ mode = 'file', currentStep = 1 }) {
  const steps = mode === 'id' ? ID_STEPS : FILE_STEPS;

  return (
    <div className="py-6 px-2 flex flex-col items-center justify-center space-y-4">
      <div className="w-full max-w-sm space-y-3">
        {steps.map((title, index) => {
          const stepNum = index + 1;
          const isDone = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.08 }}
              className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-white shadow-lg shadow-indigo-500/5'
                  : isDone
                  ? 'bg-slate-900/40 border-emerald-500/30 text-slate-300'
                  : 'bg-transparent border-white/5 text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono-tech ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isActive
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-white/5 text-slate-600'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono-tech tracking-wide uppercase">
                  {title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: 'Are uploaded PDF certificates stored on Veritas servers?',
    answer:
      'No. Veritas processes uploaded certificate PDFs purely in volatile memory to compute their SHA-256 cryptographic digest. Once the hash is matched or saved, the buffer is immediately discarded. Veritas never stores, caches, or replicates your PDF files.',
  },
  {
    question: 'What happens if even one character in a PDF is edited?',
    answer:
      'Due to the cryptographic avalanche effect of SHA-256, modifying a single character, date, grade, or pixel generates a completely distinct 64-character hash. The altered file will fail lookup and return an instant "Not Verified" status.',
  },
  {
    question: 'How does certificate revocation work?',
    answer:
      'Authorized issuing institutions can revoke any credential with one click from their dashboard. Revocation is instantaneous: future verification attempts immediately return an amber "Certificate Revoked" warning detailing the issuer and timestamp.',
  },
  {
    question: 'How do recruiters or universities verify a credential?',
    answer:
      'Recruiters can drag-and-drop the candidate\'s PDF into the public verification portal, scan the certificate\'s QR code with a phone camera, or manually enter the CERT-XXXXXX identifier. Verification is instant, free, and requires no account or login.',
  },
];

/**
 * Editorial hairline accordion addressing core student, recruiter, and issuer concerns.
 */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 sm:py-24 border-t border-white/5">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <p className="font-mono-tech text-xs tracking-widest uppercase text-indigo-300/80 font-medium">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Questions about Veritas.
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="py-5 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg text-slate-200 group-hover:text-white font-medium transition-colors">
                    {faq.question}
                  </span>
                  <motion.span
                    className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-white transition-colors"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pr-8">
                        <p className="text-sm text-slate-300 leading-relaxed font-normal">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';

const CREATORS = [
  {
    name: 'Krish Yadav',
    initials: 'KY',
    avatar: 'https://github.com/Krish-y25.png?size=240',
    role: 'CO-CREATOR · FULL-STACK & SECURITY',
    description:
      'Undergraduate in IoT & Cyber Security at B.M.S. College of Engineering. Focused on full-stack systems, cryptographic verification, and clean security-first web architecture.',
    githubUrl: 'https://github.com/Krish-y25',
    handle: '@Krish-y25',
  },
  {
    name: 'Abhinav Singh',
    initials: 'AS',
    avatar: 'https://github.com/abhinavsingh2403.png?size=240',
    role: 'CO-CREATOR · DEVELOPER',
    description:
      'Engineering student and software developer at B.M.S. College of Engineering. Passionate about building reliable web applications, clean interfaces, and practical developer tools.',
    githubUrl: 'https://github.com/abhinavsingh2403',
    handle: '@abhinavsingh2403',
  },
];

function CreatorAvatar({ src, name, initials }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 via-cyan-400 to-indigo-600 shadow-lg shadow-cyan-500/10 shrink-0">
      <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
        {!imgError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-mono-tech font-bold text-lg text-cyan-300">{initials}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Editorial Contact & Creators showcase page.
 */
export default function ContactPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 max-w-2xl mb-12 sm:mb-16"
      >
        <p className="font-mono-tech text-xs tracking-widest uppercase text-cyan-400 font-medium">
          TEAM · BMS COLLEGE OF ENGINEERING
        </p>
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
          Built by students, engineered for trust.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Meet the minds behind Veritas — developed with zero file storage, deterministic cryptography, and an editorial design philosophy.
        </p>
      </motion.div>

      {/* Creator Profile Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
        {CREATORS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <CreatorAvatar src={c.avatar} name={c.name} initials={c.initials} />
                <div>
                  <h2 className="font-serif-display text-2xl font-light text-white">
                    {c.name}
                  </h2>
                  <p className="font-mono-tech text-[11px] text-cyan-400 uppercase tracking-wider mt-0.5">
                    {c.role}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {c.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5">
              <a
                href={c.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono-tech text-xs transition-colors group"
              >
                <Github className="w-4 h-4 text-cyan-400" />
                <span>{c.handle}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Return Link */}
      <div className="mt-12 sm:mt-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-slate-400 hover:text-cyan-300 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

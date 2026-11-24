import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';

const CREATORS = [
  {
    name: 'Krish Yadav',
    initials: 'KY',
    avatar: 'https://github.com/Krish-y25.png?size=240',
    role: 'CO-CREATOR · FULL-STACK DEVELOPER',
    description:
      'Undergraduate in IoT & Cyber Security at B.M.S. College of Engineering. Focused on full-stack systems and clean security-first web architecture.',
    githubUrl: 'https://github.com/Krish-y25',
    handle: '@Krish-y25',
  },
  {
    name: 'Abhinav Singh',
    initials: 'AS',
    avatar: 'https://github.com/abhinavsingh2403.png?size=240',
    role: 'CO-CREATOR · DEVELOPER',
    description:
      'Engineering student and software developer at B.M.S. College of Engineering. Passionate about building reliable web applications and practical developer tools.',
    githubUrl: 'https://github.com/abhinavsingh2403',
    handle: '@abhinavsingh2403',
  },
];

function CreatorAvatar({ src, name, initials }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
        <span className="font-mono-tech font-medium text-sm text-slate-300">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgError(true)}
      className="h-14 w-14 rounded-full object-cover shrink-0"
    />
  );
}

/**
 * Editorial Contact & Creators showcase page.
 * Sized to fit strictly within 100vh on desktop with zero vertical scrollbars.
 */
export default function ContactPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 flex flex-col justify-between items-center text-center py-4 lg:py-0 space-y-6 lg:space-y-0 lg:h-[calc(100vh-10rem)]">
      {/* Header Block with Clean Breathing Room */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2.5 max-w-xl text-center lg:-mt-1 pt-0"
      >
        <p className="font-mono-tech text-[11px] sm:text-xs tracking-widest uppercase text-cyan-400 font-medium">
          TEAM · BMS COLLEGE OF ENGINEERING
        </p>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
          Built by students, engineered for trust.
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          Meet the minds behind Veritas — engineered with zero file storage, deterministic cryptography, and an editorial design philosophy.
        </p>
      </motion.div>

      {/* Balanced, De-congested 2-Column Grid */}
      <div className="w-full max-w-[820px] grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {CREATORS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-card rounded-2xl p-7 sm:p-8 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between gap-5"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CreatorAvatar src={c.avatar} name={c.name} initials={c.initials} />
                <div className="min-w-0">
                  <h2 className="font-serif-display text-2xl font-light text-white truncate">
                    {c.name}
                  </h2>
                  <p className="font-mono-tech text-[10px] sm:text-[11px] text-indigo-300/90 uppercase tracking-wider whitespace-nowrap mt-0.5">
                    {c.role}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 font-normal">
                {c.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href={c.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                <Github className="h-4 w-4 text-slate-400" />
                <span>{c.handle}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Plain text return link */}
      <div className="my-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

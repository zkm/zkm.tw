import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useProfileData } from '../hooks/useProfileData';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
const Resume = React.lazy(() => import('./Resume'));

// Local SVG icon components to avoid external dependency on 'lucide-react'
type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const Github: React.FC<IconProps> = ({ size = 24, className, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M12 0.5C5.73 0.5 0.9 5.34 0.9 11.61c0 4.77 3.09 8.82 7.38 10.25.54.1.74-.24.74-.53 0-.26-.01-1-.02-1.95-3 .66-3.64-1.38-3.64-1.38-.49-1.24-1.2-1.57-1.2-1.57-.98-.67.07-.66.07-.66 1.08.08 1.65 1.11 1.65 1.11.96 1.65 2.52 1.17 3.13.9.1-.71.38-1.17.69-1.44-2.4-.27-4.92-1.2-4.92-5.34 0-1.18.42-2.15 1.11-2.91-.11-.27-.48-1.36.11-2.83 0 0 .91-.29 2.98 1.1.86-.24 1.78-.36 2.7-.36.92 0 1.84.12 2.7.36 2.07-1.39 2.98-1.1 2.98-1.1.59 1.47.22 2.56.11 2.83.69.76 1.11 1.73 1.11 2.91 0 4.15-2.53 5.07-4.94 5.34.39.34.73 1.02.73 2.06 0 1.49-.01 2.69-.01 3.06 0 .29.2.64.75.53 4.29-1.43 7.38-5.48 7.38-10.25C23.1 5.34 18.27 0.5 12 0.5z" />
  </svg>
);

const Linkedin: React.FC<IconProps> = ({ size = 24, className, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <rect x="2" y="2" width="20" height="20" rx="3" />
    <rect x="6" y="10" width="2.5" height="7" fill="white" />
    <circle cx="7.25" cy="7.5" r="1.25" fill="white" />
    <path d="M13 10.5v1.2c0 .6-.01 3.3-2.5 3.3s-2.5-2.7-2.5-3.3V10.5h-2v7h2v-3c0 .01.23 2.3 2.5 2.3 2.27 0 2.5-2.3 2.5-2.3v3h2v-7h-2z" fill="white" />
  </svg>
);

const Instagram: React.FC<IconProps> = ({ size = 24, className, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.5" fill="white" />
    <circle cx="17.6" cy="6.4" r="0.9" fill="white" />
  </svg>
);

const FileText: React.FC<IconProps> = ({ size = 24, className, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M6 2h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
    <path d="M13 3v5h5" fill="white" opacity="0.2" />
    <rect x="8" y="11" width="8" height="1.5" rx="0.3" fill="white" opacity="0.9" />
    <rect x="8" y="14" width="8" height="1.5" rx="0.3" fill="white" opacity="0.9" />
  </svg>
);

// Custom SVG components for icons not available in Lucide
const MastodonIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.193 7.879c0-5.206-3.411-6.732-3.411-6.732C18.062.357 15.108.025 12.041 0h-.076c-3.068.025-6.02.357-7.74 1.147 0 0-3.411 1.526-3.411 6.732 0 1.192-.023 2.618.015 4.129.124 5.092.934 10.109 5.641 11.355 2.17.574 4.034.695 5.535.612 2.722-.15 4.25-.972 4.25-.972l-.09-1.975s-1.945.613-4.129.539c-2.165-.074-4.449-.233-4.799-2.891a5.499 5.499 0 0 1-.048-.745s2.125.52 4.817.643c1.646.075 3.19-.097 4.758-.283 3.007-.359 5.625-2.212 5.954-3.905.517-2.665.475-6.507.475-6.507zm-4.024 6.709h-2.497V8.469c0-1.29-.543-1.944-1.628-1.944-1.2 0-1.802.776-1.802 2.312v3.349h-2.483v-3.35c0-1.536-.602-2.312-1.802-2.312-1.085 0-1.628.655-1.628 1.944v6.119H4.832V8.284c0-1.289.328-2.313.987-3.07.68-.758 1.569-1.146 2.674-1.146 1.278 0 2.246.491 2.886 1.474L12 6.585l.622-1.043c.64-.983 1.608-1.474 2.886-1.474 1.104 0 1.994.388 2.674 1.146.658.757.986 1.781.986 3.07v6.304z" />
  </svg>
);

const XIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0" />
  </svg>
);

const StackOverflowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 800 800"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M189.4,629.2v65.3h315.2v-65.3H189.4z M194.8,511.9l-4.5,65.3 l314.4,21.3l4.1-64.9L194.8,511.9L194.8,511.9z M97.9,484.8V800H150H563h33.2V484.8h-52.1v262.7H150V484.8H97.9L97.9,484.8z  M218.6,373.1L203,436.3l305.8,75.9l15.6-63.6L218.6,373.1z M286.3,215.1l-33.2,56.2L524.8,431l33.2-56.6L286.3,215.1z M452.1,65.3 l-54.2,36.5l175.3,261.5l54.2-36.1L452.1,65.3L452.1,65.3z M663.9,0l-64.9,7.8l38.2,312.8l64.9-7.8L663.9,0z" />
  </svg>
);

// Icon mapping for social platforms
const iconMap = {
  github: Github,
  linkedin: Linkedin,
  mastodon: MastodonIcon,
  x: XIcon,
  instagram: Instagram,
  stackoverflow: StackOverflowIcon,
};

const Portfolio: React.FC = () => {
  const { data, loading, error } = useProfileData();
  const [showResume, setShowResume] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'rgb(31, 38, 50)' }}
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={
            prefersReducedMotion ? {} : { duration: 1, repeat: Infinity, ease: 'linear' }
          }
          className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
          aria-label="Loading"
          role="status"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-100">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  const { profile, socialLinks, resume } = data;

  if (showResume) {
    return (
      <Suspense fallback={<div className="text-white">Loading resume...</div>}>
        <Resume />
      </Suspense>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden dark-bg"
      style={{ backgroundColor: 'rgb(15, 23, 42)' }} // Changed from rgb(31, 38, 50) to darker slate-900 for better contrast
    >
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 bg-slate-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 ${prefersReducedMotion ? '' : 'animate-pulse'}`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 ${prefersReducedMotion ? '' : 'animate-pulse'}`}
          style={prefersReducedMotion ? {} : { animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-40 left-1/2 w-80 h-80 bg-slate-700 rounded-full mix-blend-multiply filter blur-xl opacity-15 ${prefersReducedMotion ? '' : 'animate-pulse'}`}
          style={prefersReducedMotion ? {} : { animationDelay: '4s' }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center relative z-10"
        id="main-content"
        role="main"
      >
        {/* Profile Image */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={prefersReducedMotion ? {} : { delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
            transition={
              prefersReducedMotion ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }
            className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl backdrop-blur-sm relative group"
          >
            <img
              src="/logo.webp"
              alt="Zach Schneider"
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              onError={(e) => {
                // Fallback to gradient background if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center text-white text-6xl font-bold transition-all duration-500 group-hover:scale-105 hidden">
              <span className="drop-shadow-lg">ZS</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        </motion.div>

        {/* Name and Title */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-sm">
            {profile.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 font-light">{profile.title}</p>
        </motion.div>

        {/* Stay in Touch Section */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Stay in Touch</h2>
          <p className="text-gray-200 mb-6 font-medium">{profile.tagline}</p>
        </motion.div>

        {/* Resume Button */}
        {resume.enabled && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { delay: 0.7, duration: 0.6 }}
            className="mb-8"
          >
            <motion.button
              onClick={() => setShowResume(true)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-slate-800 px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-100 cursor-pointer focus-visible:ring-4 focus-visible:ring-blue-400"
              aria-label="View full resume"
            >
              <FileText size={20} />
              View Resume
            </motion.button>
          </motion.div>
        )}

        {/* Social Links */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { delay: 0.8, duration: 0.6 }}
          className="flex justify-center gap-4 mb-8"
        >
          {socialLinks
            .filter((social) => social.display)
            .map((social, index) => {
              const IconComponent = iconMap[social.icon as keyof typeof iconMap];
              return (
                <motion.a
                  key={social.platform}
                  href={social.url}
                  rel={social.rel || 'noreferrer noopener'}
                  target="_blank"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={
                    prefersReducedMotion ? {} : { delay: 0.9 + index * 0.1, duration: 0.3 }
                  }
                  className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-lg group"
                  aria-label={`${social.platform} (opens in new window)`}
                >
                  <IconComponent className="transition-transform duration-300 group-hover:scale-110" />
                </motion.a>
              );
            })}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? {} : { delay: 1.2, duration: 0.6 }}
          className="text-gray-100 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
        >
          © 2025 Zach Schneider, All rights reserved
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Portfolio;

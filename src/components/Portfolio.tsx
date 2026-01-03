import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useProfileData } from '../hooks/useProfileData';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
const Resume = React.lazy(() => import('./Resume'));

// Use local SVG files for social icons to guarantee rendering across browsers
// and avoid any currentColor/fill inheritance quirks.
import iconGithub from './icons/icon_gh.svg';
import iconLinkedin from './icons/icon_li.svg';
import iconInstagram from './icons/icon_ig.svg';
import iconMastodon from './icons/icon_mst.svg';
import iconX from './icons/icon_x.svg';
import iconStackOverflow from './icons/icon_stackoverflow.svg';

type ImageIconProps = { size?: number; className?: string; alt?: string };
const ImageIcon: React.FC<ImageIconProps & { src: string }> = ({
  src,
  size = 24,
  className,
  alt = '',
}) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={`filter invert ${className ?? ''}`}
    loading="lazy"
    decoding="async"
  />
);

const Github: React.FC<ImageIconProps> = (props) => (
  <ImageIcon src={iconGithub} alt="GitHub" {...props} />
);
const Linkedin: React.FC<ImageIconProps> = (props) => (
  <ImageIcon src={iconLinkedin} alt="LinkedIn" {...props} />
);
const Instagram: React.FC<ImageIconProps> = (props) => (
  <ImageIcon src={iconInstagram} alt="Instagram" {...props} />
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

const MastodonIcon: React.FC<ImageIconProps> = (props) => (
  <ImageIcon src={iconMastodon} alt="Mastodon" {...props} />
);
const XIcon: React.FC<ImageIconProps> = (props) => <ImageIcon src={iconX} alt="X" {...props} />;
const StackOverflowIcon: React.FC<ImageIconProps> = (props) => (
  <ImageIcon src={iconStackOverflow} alt="Stack Overflow" {...props} />
);

// Keep this type for FileText inline icon
type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

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
          transition={prefersReducedMotion ? {} : { duration: 1, repeat: Infinity, ease: 'linear' }}
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
          © {new Date().getFullYear()} Zach Schneider, All rights reserved
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Portfolio;

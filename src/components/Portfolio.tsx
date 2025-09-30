import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, FileText } from 'lucide-react';
import { useProfileData } from '../hooks/useProfileData';
const Resume = React.lazy(() => import('./Resume'));

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

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'rgb(31, 38, 50)' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-300">Failed to load profile data</p>
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
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: 'rgb(31, 38, 50)' }}
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-40 left-1/2 w-80 h-80 bg-slate-700 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* Profile Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-sm">
            {profile.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">{profile.title}</p>
        </motion.div>

        {/* Stay in Touch Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Stay in Touch</h2>
          <p className="text-gray-300 mb-6 font-medium">{profile.tagline}</p>
        </motion.div>

        {/* Resume Button */}
        {resume.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-8"
          >
            <motion.button
              onClick={() => setShowResume(true)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-slate-800 px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-100"
            >
              <FileText size={20} />
              View Resume
            </motion.button>
          </motion.div>
        )}

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                  className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-lg group"
                  aria-label={social.platform}
                >
                  <IconComponent className="transition-transform duration-300 group-hover:scale-110" />
                </motion.a>
              );
            })}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-gray-200 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
        >
          © 2025 Zach Schneider, All rights reserved
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Portfolio;

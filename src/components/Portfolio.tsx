import React, { useEffect, useRef, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useProfileData } from '../hooks/useProfileData';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
const Resume = React.lazy(() => import('./Resume'));
import Chatbot from './Chatbot';

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
        aria-hidden={alt ? undefined : true}
        className={`filter invert ${className ?? ''}`}
        loading="lazy"
        decoding="async"
    />
);

const Github: React.FC<ImageIconProps> = (props) => <ImageIcon src={iconGithub} {...props} />;
const Linkedin: React.FC<ImageIconProps> = (props) => <ImageIcon src={iconLinkedin} {...props} />;
const Instagram: React.FC<ImageIconProps> = (props) => <ImageIcon src={iconInstagram} {...props} />;

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
    <ImageIcon src={iconMastodon} {...props} />
);
const XIcon: React.FC<ImageIconProps> = (props) => <ImageIcon src={iconX} {...props} />;
const StackOverflowIcon: React.FC<ImageIconProps> = (props) => (
    <ImageIcon src={iconStackOverflow} {...props} />
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

const fadeInUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
};

const obfuscatedPrimaryEmail = '=02bj5iclRWal5GajNHajFmeAVWb';

const decodeObfuscatedEmail = (obfuscatedEmail: string): string | null => {
    try {
        const reversed = obfuscatedEmail.split('').reverse().join('');
        const decoded = atob(reversed);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decoded)) return null;
        return decoded;
    } catch {
        return null;
    }
};

const Portfolio: React.FC = () => {
    const { data, loading, error } = useProfileData();
    const [showResume, setShowResume] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();
    const canAnimate = !prefersReducedMotion;
    const contactCloseButtonRef = useRef<HTMLButtonElement | null>(null);
    const resumeCloseButtonRef = useRef<HTMLButtonElement | null>(null);
    const lastFocusedElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!showContactModal) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowContactModal(false);
                setCopiedEmail(false);
                lastFocusedElementRef.current?.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [showContactModal]);

    useEffect(() => {
        if (showContactModal) contactCloseButtonRef.current?.focus();
    }, [showContactModal]);

    useEffect(() => {
        if (!showResume) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowResume(false);
                lastFocusedElementRef.current?.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [showResume]);

    useEffect(() => {
        if (showResume) resumeCloseButtonRef.current?.focus();
    }, [showResume]);

    useEffect(() => {
        if (!(showContactModal || showResume)) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [showContactModal, showResume]);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: '#0e1424' }}
            >
                <motion.div
                    animate={canAnimate ? { rotate: 360 } : {}}
                    transition={canAnimate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                    className="w-10 h-10 border-2 border-[#f2cf8f] border-t-transparent rounded-full"
                    aria-label="Loading"
                    role="status"
                />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#0e1424] flex items-center justify-center p-6">
                <div className="text-center border border-[#f2cf8f]/30 rounded-3xl p-10 bg-[#111b2f]/90 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                    <h2 className="text-3xl font-bold text-[#f9f4e8] mb-3">Data unavailable</h2>
                    <p className="text-[#d6dfed]">Failed to load profile data.</p>
                </div>
            </div>
        );
    }

    const { profile, socialLinks, resume } = data;
    const contactEmail = profile.email || decodeObfuscatedEmail(obfuscatedPrimaryEmail);

    const onSayHello = () => {
        lastFocusedElementRef.current = document.activeElement as HTMLElement;
        setShowContactModal(true);
    };

    const onCloseContactModal = () => {
        setShowContactModal(false);
        setCopiedEmail(false);
        lastFocusedElementRef.current?.focus();
    };

    const onOpenResume = () => {
        lastFocusedElementRef.current = document.activeElement as HTMLElement;
        setShowResume(true);
    };

    const onCloseResume = () => {
        setShowResume(false);
        lastFocusedElementRef.current?.focus();
    };

    const onOpenMailClient = () => {
        if (!contactEmail) return;
        window.location.href = `mailto:${contactEmail}`;
    };

    const onCopyEmail = async () => {
        if (!contactEmail || !navigator.clipboard) return;
        await navigator.clipboard.writeText(contactEmail);
        setCopiedEmail(true);
    };

    return (
        <div className="min-h-screen relative overflow-hidden dark-bg bg-[#0e1424] text-[#f9f4e8]">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#f2cf8f] focus:text-[#0e1424] focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
            >
                Skip to main content
            </a>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={`absolute -top-36 -left-24 w-[420px] h-[420px] rounded-full blur-3xl bg-[#1f6f8b]/35 ${canAnimate ? 'animate-pulse' : ''}`}
                ></div>
                <div
                    className={`absolute -bottom-32 right-0 w-[480px] h-[480px] rounded-full blur-3xl bg-[#f2a65a]/25 ${canAnimate ? 'animate-pulse' : ''}`}
                    style={canAnimate ? { animationDelay: '2s' } : {}}
                ></div>
                <div
                    className="absolute inset-0 opacity-15"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(242,207,143,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,207,143,0.16) 1px, transparent 1px)',
                        backgroundSize: '56px 56px',
                    }}
                ></div>
            </div>

            <motion.div
                initial={canAnimate ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-6xl mx-auto p-6 md:p-10"
                id="main-content"
                role="main"
            >
                <motion.div
                    variants={fadeInUp}
                    initial={canAnimate ? 'hidden' : 'show'}
                    animate="show"
                    transition={{ duration: 0.45 }}
                    className="mb-8 flex items-center justify-between gap-4"
                >
                    <p className="uppercase tracking-[0.22em] text-sm text-[#f2cf8f]">ZKM.TW</p>
                    {profile.location && (
                        <p className="text-sm text-[#d6dfed]">{profile.location}</p>
                    )}
                </motion.div>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    <motion.div
                        variants={fadeInUp}
                        initial={canAnimate ? 'hidden' : 'show'}
                        animate="show"
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="lg:col-span-7"
                    >
                        <p className="inline-flex items-center rounded-full border border-[#f2cf8f]/70 bg-[#f2cf8f]/10 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#f2cf8f] mb-5">
                            Creative Technologist
                        </p>

                        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-[#f9f4e8]">
                            {profile.name}
                        </h1>

                        <p className="mt-5 text-xl md:text-2xl text-[#d6dfed] max-w-2xl">
                            {profile.title}
                        </p>

                        <p className="mt-6 text-base md:text-lg text-[#b8c7da] max-w-xl">
                            {profile.tagline}
                        </p>

                        {profile.about && (
                            <div className="mt-6 max-w-3xl rounded-2xl border border-[#8cb5c2]/25 bg-[#132038]/55 p-5 backdrop-blur-sm">
                                <p className="text-sm uppercase tracking-[0.14em] text-[#8cb5c2] mb-2">
                                    About
                                </p>
                                <p className="text-[#d6dfed] leading-relaxed">{profile.about}</p>
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            {resume.enabled && (
                                <motion.button
                                    onClick={onOpenResume}
                                    whileHover={canAnimate ? { y: -2, scale: 1.02 } : {}}
                                    whileTap={canAnimate ? { scale: 0.98 } : {}}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#f2cf8f] text-[#1b2438] px-6 py-3 font-semibold shadow-[0_10px_24px_rgba(242,166,90,0.28)] hover:bg-[#f4d79e] transition-colors cursor-pointer"
                                >
                                    <FileText size={19} />
                                    View Resume
                                </motion.button>
                            )}

                            {contactEmail && (
                                <button
                                    type="button"
                                    onClick={onSayHello}
                                    className="inline-flex cursor-pointer items-center rounded-xl border border-[#8cb5c2]/50 bg-[#142032]/80 px-6 py-3 font-semibold text-[#d6dfed] hover:border-[#f2cf8f]/70 hover:text-[#f2cf8f] transition-colors"
                                >
                                    Say Hello
                                </button>
                            )}
                        </div>

                        <div className="mt-10 rounded-2xl border border-[#8cb5c2]/25 bg-[#132038]/70 p-5 backdrop-blur-sm">
                            <p className="text-sm uppercase tracking-[0.14em] text-[#8cb5c2] mb-2">
                                Current Focus
                            </p>
                            <p className="text-[#e5ecf5] leading-relaxed">
                                {data.contact.cta} - {data.contact.message}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        initial={canAnimate ? 'hidden' : 'show'}
                        animate="show"
                        transition={{ delay: 0.22, duration: 0.5 }}
                        className="lg:col-span-5"
                    >
                        <div className="rounded-3xl border border-[#f2cf8f]/35 bg-[#111b2f]/85 p-5 md:p-6 shadow-[0_18px_50px_rgba(3,8,20,0.45)] backdrop-blur-md">
                            <motion.div
                                animate={canAnimate ? { y: [0, -8, 0] } : {}}
                                transition={
                                    canAnimate
                                        ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                                        : {}
                                }
                                className="relative rounded-2xl overflow-hidden border border-[#8cb5c2]/35 aspect-[4/5]"
                            >
                                <picture>
                                    {profile.image && (
                                        <source
                                            srcSet={profile.image.replace(/\.\w+$/, '.webp')}
                                            type="image/webp"
                                        />
                                    )}
                                    <img
                                        src={profile.image || '/logo.webp'}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                        fetchPriority="high"
                                        decoding="sync"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const fallback =
                                                target.nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                </picture>
                                <div className="hidden w-full h-full items-center justify-center text-5xl font-bold bg-gradient-to-br from-[#1f6f8b] to-[#f2a65a] text-[#0e1424]">
                                    ZS
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/65 to-transparent">
                                    <p className="font-semibold text-[#f9f4e8]">{profile.name}</p>
                                    <p className="text-sm text-[#d6dfed]">
                                        Builder of practical web experiences
                                    </p>
                                </div>
                            </motion.div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                {socialLinks
                                    .filter((social) => social.display)
                                    .map((social, index) => {
                                        const IconComponent =
                                            iconMap[social.icon as keyof typeof iconMap] || Github;
                                        return (
                                            <motion.a
                                                key={social.platform}
                                                href={social.url}
                                                rel={social.rel || 'noreferrer noopener'}
                                                target="_blank"
                                                initial={
                                                    canAnimate
                                                        ? { opacity: 0, y: 8 }
                                                        : { opacity: 1 }
                                                }
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={
                                                    canAnimate
                                                        ? {
                                                              delay: 0.3 + index * 0.06,
                                                              duration: 0.25,
                                                          }
                                                        : {}
                                                }
                                                whileHover={canAnimate ? { y: -2 } : {}}
                                                className="flex items-center gap-3 rounded-xl border border-[#8cb5c2]/30 bg-[#142032]/75 p-3 text-sm hover:border-[#f2cf8f]/75 transition-colors"
                                                aria-label={`${social.platform} (opens in new window)`}
                                            >
                                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0e1424] border border-[#8cb5c2]/35">
                                                    <IconComponent size={18} />
                                                </span>
                                                <span className="text-[#e8eef7]">
                                                    {social.platform}
                                                </span>
                                            </motion.a>
                                        );
                                    })}
                            </div>
                        </div>
                    </motion.div>
                </section>

                <motion.footer
                    variants={fadeInUp}
                    initial={canAnimate ? 'hidden' : 'show'}
                    animate="show"
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#8cb5c2]/25 pt-5 text-sm text-[#b8c7da]"
                >
                    <span>© {new Date().getFullYear()} Zach Schneider</span>
                    <span>Designed for speed, clarity, and personality.</span>
                </motion.footer>

                {showContactModal && contactEmail && (
                    <div
                        className="fixed inset-0 z-40 flex items-center justify-center bg-[#060912]/75 p-4"
                        role="presentation"
                        onClick={onCloseContactModal}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="contact-modal-title"
                            aria-describedby="contact-modal-description"
                            className="w-full max-w-md rounded-2xl border border-[#8cb5c2]/35 bg-[#111b2f]/95 p-6 shadow-[0_28px_60px_rgba(0,0,0,0.5)]"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <h2
                                id="contact-modal-title"
                                className="text-2xl font-bold text-[#f9f4e8]"
                            >
                                Say Hello
                            </h2>
                            <p
                                id="contact-modal-description"
                                className="mt-2 text-sm text-[#b8c7da]"
                            >
                                Pick how you want to reach out.
                            </p>

                            <p className="mt-4 rounded-lg border border-[#8cb5c2]/30 bg-[#0e1424]/80 px-4 py-3 text-[#e5ecf5]">
                                {contactEmail}
                            </p>

                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={onOpenMailClient}
                                    className="rounded-xl bg-[#f2cf8f] px-4 py-3 font-semibold text-[#1b2438] hover:bg-[#f4d79e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2cf8f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1424] transition-colors"
                                >
                                    Open Mail App
                                </button>
                                <button
                                    type="button"
                                    onClick={onCopyEmail}
                                    className="rounded-xl border border-[#8cb5c2]/45 bg-[#142032]/80 px-4 py-3 font-semibold text-[#d6dfed] hover:border-[#f2cf8f]/70 hover:text-[#f2cf8f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2cf8f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1424] transition-colors"
                                >
                                    {copiedEmail ? 'Copied' : 'Copy Email'}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={onCloseContactModal}
                                ref={contactCloseButtonRef}
                                className="mt-4 w-full rounded-xl border border-[#8cb5c2]/30 bg-transparent px-4 py-3 text-[#d6dfed] hover:border-[#f2cf8f]/70 hover:text-[#f2cf8f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2cf8f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1424] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {showResume && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#060912]/85 p-4 md:p-8"
                        role="presentation"
                        onClick={onCloseResume}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="resume-dialog-title"
                            aria-describedby="resume-dialog-description"
                            className="relative h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#8cb5c2]/30 bg-[#0e1424] shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <h2 id="resume-dialog-title" className="sr-only">
                                Resume
                            </h2>
                            <p id="resume-dialog-description" className="sr-only">
                                Resume content in a modal dialog. Press Escape to close.
                            </p>
                            <button
                                type="button"
                                onClick={onCloseResume}
                                ref={resumeCloseButtonRef}
                                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#8cb5c2]/45 bg-[#111b2f]/90 text-[#e8eef7] hover:border-[#f2cf8f]/70 hover:text-[#f2cf8f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2cf8f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1424] transition-colors"
                                aria-label="Close resume"
                            >
                                X
                            </button>
                            <Suspense
                                fallback={
                                    <div className="flex h-full items-center justify-center text-[#f9f4e8]">
                                        Loading resume...
                                    </div>
                                }
                            >
                                <div className="h-full overflow-y-auto">
                                    <Resume />
                                </div>
                            </Suspense>
                        </div>
                    </div>
                )}
            </motion.div>

            <Chatbot />
        </div>
    );
};

export default Portfolio;

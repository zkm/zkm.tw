import React, { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useProfileData } from '../hooks/useProfileData';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useFocusTrap } from '../hooks/useFocusTrap';
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
        aria-hidden="true"
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
    const contactDialogRef = useRef<HTMLDivElement | null>(null);
    const resumeDialogRef = useRef<HTMLDivElement | null>(null);
    useFocusTrap(contactDialogRef, showContactModal);
    useFocusTrap(resumeDialogRef, showResume);

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

    // The resume is a history entry (#resume), so Back (the button, a swipe, Android's
    // gesture) closes it instead of leaving the site. Every other way of closing it goes
    // back through history too, which keeps the entry and the dialog in step.
    const openResume = useCallback(() => {
        lastFocusedElementRef.current = document.activeElement as HTMLElement;
        window.history.pushState({ resume: true }, '', '#resume');
        setShowResume(true);
    }, []);

    const closeResume = useCallback(() => {
        if (window.history.state?.resume) {
            window.history.back(); // the popstate handler below closes the dialog
        } else {
            setShowResume(false);
            lastFocusedElementRef.current?.focus();
        }
    }, []);

    useEffect(() => {
        const onPopState = (event: PopStateEvent) => {
            const open = Boolean(event.state?.resume);
            setShowResume(open);
            if (!open) lastFocusedElementRef.current?.focus();
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    // zkm.tw/#resume opens straight to the resume, with the page underneath it in history.
    useEffect(() => {
        if (window.location.hash !== '#resume' || window.history.state?.resume) return;
        const { pathname, search } = window.location;
        window.history.replaceState(null, '', pathname + search);
        openResume();
    }, [openResume]);

    useEffect(() => {
        if (!showResume) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeResume();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [showResume, closeResume]);

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
                    className="w-10 h-10 border-2 border-[#02cacc] border-t-transparent rounded-full"
                    aria-label="Loading"
                    role="status"
                />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#0e1424] flex items-center justify-center p-6">
                <div className="text-center border border-[#02cacc]/30 rounded-3xl p-10 bg-[#111b2f]/90 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                    <h2 className="text-3xl font-bold text-[#f9f4e8] mb-3">Data unavailable</h2>
                    <p className="text-[#d6dfed]">Failed to load profile data.</p>
                </div>
            </div>
        );
    }

    const { profile, socialLinks, resume, projects = [] } = data;
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
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#02cacc] focus:text-[#0e1424] focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
            >
                Skip to main content
            </a>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={`absolute -top-36 -left-24 w-[420px] h-[420px] rounded-full blur-3xl bg-[#02cacc]/20 ${canAnimate ? 'animate-pulse' : ''}`}
                ></div>
                <div
                    className={`absolute -bottom-32 right-0 w-[480px] h-[480px] rounded-full blur-3xl bg-[#6511aa]/35 ${canAnimate ? 'animate-pulse' : ''}`}
                    style={canAnimate ? { animationDelay: '2s' } : {}}
                ></div>
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 1200 900"
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                >
                    {/* Teal brushstrokes and purple zigzags, after the avatar's background */}
                    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path
                            d="M-40 170 C 160 120, 300 150, 470 70"
                            stroke="#02cacc"
                            strokeWidth="46"
                            opacity="0.07"
                        />
                        <path
                            d="M760 860 C 900 790, 1050 820, 1260 700"
                            stroke="#02cacc"
                            strokeWidth="58"
                            opacity="0.06"
                        />
                    </g>
                    <g fill="none" stroke="#9b5de5" strokeWidth="5" strokeLinejoin="miter">
                        <polyline
                            points="890,120 930,82 948,118 990,76 1008,112 1050,70"
                            opacity="0.35"
                        />
                        <polyline points="40,560 78,526 94,560 134,522 150,556" opacity="0.28" />
                        <polyline
                            points="1020,520 1056,488 1072,520 1110,484 1126,516 1164,480"
                            opacity="0.22"
                        />
                        <polyline points="560,870 596,836 612,868 650,832 666,864" opacity="0.25" />
                    </g>
                </svg>
                <div
                    className="absolute inset-0 opacity-15"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(2,202,204,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(2,202,204,0.10) 1px, transparent 1px)',
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
                    <p className="uppercase tracking-[0.22em] text-sm text-[#02cacc]">ZKM.TW</p>
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
                        <p className="inline-flex items-center rounded-full border border-[#02cacc]/70 bg-[#02cacc]/10 px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#02cacc] mb-5">
                            Creative Technologist
                        </p>

                        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-[#f9f4e8]">
                            {profile.name}
                        </h1>
                        <div className="jazz-zigzag mt-4 w-40" aria-hidden="true" />

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
                                <button
                                    type="button"
                                    onClick={openResume}
                                    className="jazz-pop inline-flex items-center gap-2 rounded-xl bg-[#02cacc] text-[#1b2438] px-6 py-3 font-semibold hover:bg-[#3fdcdd] cursor-pointer"
                                >
                                    <FileText size={19} />
                                    View Resume
                                </button>
                            )}

                            {contactEmail && (
                                <button
                                    type="button"
                                    onClick={onSayHello}
                                    className="jazz-pop jazz-pop-teal inline-flex cursor-pointer items-center rounded-xl border border-[#8cb5c2]/50 bg-[#142032]/80 px-6 py-3 font-semibold text-[#d6dfed] hover:border-[#b48cff] hover:bg-[#6511aa]/40 hover:text-[#f9f4e8]"
                                >
                                    Say Hello
                                </button>
                            )}
                        </div>

                        <div className="mt-10 rounded-2xl border border-[#8cb5c2]/25 bg-[#132038]/70 p-5 backdrop-blur-sm">
                            <p className="text-sm uppercase tracking-[0.14em] text-[#8cb5c2] mb-2">
                                Current Focus
                            </p>
                            {data.focus && data.focus.length > 0 ? (
                                <ul className="space-y-2 text-[#e5ecf5] leading-relaxed">
                                    {data.focus.map((item) => (
                                        <li key={item} className="flex gap-3">
                                            <span
                                                className="mt-2 h-2 w-2 flex-none rotate-45 bg-[#02cacc]"
                                                aria-hidden="true"
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[#e5ecf5] leading-relaxed">
                                    {data.contact.cta} - {data.contact.message}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        initial={canAnimate ? 'hidden' : 'show'}
                        animate="show"
                        transition={{ delay: 0.22, duration: 0.5 }}
                        className="lg:col-span-5"
                    >
                        <div className="rounded-3xl border border-[#02cacc]/35 bg-[#111b2f]/85 p-5 md:p-6 shadow-[10px_10px_0_rgba(101,17,170,0.55)] backdrop-blur-md">
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
                                            // The placeholder is a sibling of <picture>, not of the <img>.
                                            const picture = (e.target as HTMLImageElement).closest(
                                                'picture',
                                            );
                                            const fallback =
                                                picture?.nextElementSibling as HTMLElement | null;
                                            if (picture && fallback) {
                                                picture.style.display = 'none';
                                                fallback.style.display = 'flex';
                                            }
                                        }}
                                    />
                                </picture>
                                <div className="hidden w-full h-full items-center justify-center text-5xl font-bold bg-gradient-to-br from-[#02cacc] to-[#6511aa] text-[#0e1424]">
                                    ZS
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#0e1424]/90 via-[#0e1424]/60 to-transparent">
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
                                                className="jazz-pop group flex items-center gap-3 rounded-xl border border-[#8cb5c2]/30 bg-[#142032]/75 p-3 text-sm hover:border-[#02cacc]"
                                                aria-label={`${social.platform} (opens in new window)`}
                                            >
                                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0e1424] border border-[#8cb5c2]/35 transition-colors group-hover:border-[#02cacc] group-hover:bg-[#02cacc] group-hover:text-[#0e1424]">
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

                {projects.length > 0 && (
                    <motion.section
                        variants={fadeInUp}
                        initial={canAnimate ? 'hidden' : 'show'}
                        animate="show"
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-16"
                        aria-labelledby="projects-heading"
                    >
                        <h2
                            id="projects-heading"
                            className="font-display text-3xl md:text-4xl tracking-tight text-[#f9f4e8]"
                        >
                            Projects
                        </h2>
                        <div className="jazz-zigzag mt-3 w-28" aria-hidden="true" />

                        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <article
                                    key={project.name}
                                    className="flex flex-col rounded-2xl border border-[#02cacc]/35 bg-[#111b2f]/85 p-6 shadow-[8px_8px_0_rgba(101,17,170,0.45)] backdrop-blur-sm"
                                >
                                    <h3 className="font-display text-xl text-[#02cacc]">
                                        {project.name}
                                    </h3>
                                    <p className="mt-3 flex-1 leading-relaxed text-[#d6dfed]">
                                        {project.description}
                                    </p>

                                    {project.tech && project.tech.length > 0 && (
                                        <ul
                                            className="mt-4 flex flex-wrap gap-2"
                                            aria-label="Built with"
                                        >
                                            {project.tech.map((item) => (
                                                <li
                                                    key={item}
                                                    className="rounded-md bg-[#02cacc]/10 px-2 py-1 text-xs font-semibold text-[#7fe3e4]"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {project.links.map((link) => (
                                            <a
                                                key={link.url}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="jazz-pop jazz-pop-teal inline-flex items-center gap-1 rounded-lg border border-[#8cb5c2]/45 bg-[#142032]/80 px-3 py-2 text-sm font-semibold text-[#e8eef7] hover:border-[#b48cff] hover:bg-[#6511aa]/40 hover:text-[#f9f4e8]"
                                                aria-label={`${project.name}: ${link.label} (opens in new window)`}
                                            >
                                                {link.label}
                                                <span aria-hidden="true">↗</span>
                                            </a>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </motion.section>
                )}

                <motion.footer
                    variants={fadeInUp}
                    initial={canAnimate ? 'hidden' : 'show'}
                    animate="show"
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="mt-10 text-sm text-[#b8c7da]"
                >
                    <div className="jazz-zigzag mb-5 w-full opacity-60" aria-hidden="true" />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span>© {new Date().getFullYear()} Zach Schneider</span>
                        <span>Designed for speed, clarity, and personality.</span>
                    </div>
                </motion.footer>

                {showContactModal && contactEmail && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#060912]/75 p-4">
                        <button
                            type="button"
                            aria-label="Close dialog"
                            tabIndex={-1}
                            className="absolute inset-0 cursor-default appearance-none border-0 bg-transparent p-0"
                            onClick={onCloseContactModal}
                        />
                        <div
                            ref={contactDialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="contact-modal-title"
                            aria-describedby="contact-modal-description"
                            className="w-full max-w-md rounded-2xl border border-[#8cb5c2]/35 bg-[#111b2f]/95 p-6 shadow-[0_28px_60px_rgba(0,0,0,0.5)]"
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
                                    className="jazz-pop rounded-xl bg-[#02cacc] px-4 py-3 font-semibold text-[#1b2438] hover:bg-[#3fdcdd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02cacc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1424]"
                                >
                                    Open Mail App
                                </button>
                                <button
                                    type="button"
                                    onClick={onCopyEmail}
                                    className="jazz-pop jazz-pop-teal rounded-xl border border-[#8cb5c2]/45 bg-[#142032]/80 px-4 py-3 font-semibold text-[#d6dfed] hover:border-[#b48cff] hover:bg-[#6511aa]/40 hover:text-[#f9f4e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02cacc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1424]"
                                >
                                    {copiedEmail ? 'Copied' : 'Copy Email'}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={onCloseContactModal}
                                ref={contactCloseButtonRef}
                                className="mt-4 w-full rounded-xl border border-[#8cb5c2]/30 bg-transparent px-4 py-3 text-[#d6dfed] hover:border-[#02cacc]/70 hover:text-[#02cacc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02cacc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1424] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {showResume && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060912]/85 p-4 md:p-8">
                        <button
                            type="button"
                            aria-label="Close dialog"
                            tabIndex={-1}
                            className="absolute inset-0 cursor-default appearance-none border-0 bg-transparent p-0"
                            onClick={closeResume}
                        />
                        <div
                            ref={resumeDialogRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="resume-dialog-title"
                            aria-describedby="resume-dialog-description"
                            className="relative h-[92dvh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#8cb5c2]/30 bg-[#0e1424] shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
                        >
                            <h2 id="resume-dialog-title" className="sr-only">
                                Resume
                            </h2>
                            <p id="resume-dialog-description" className="sr-only">
                                Resume content in a modal dialog. Press Escape to close.
                            </p>
                            <button
                                type="button"
                                onClick={closeResume}
                                ref={resumeCloseButtonRef}
                                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#8cb5c2]/45 bg-[#111b2f]/90 text-[#e8eef7] hover:border-[#02cacc]/70 hover:text-[#02cacc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02cacc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1424] transition-colors"
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
                                    <Resume embedded />
                                </div>
                            </Suspense>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Portfolio;

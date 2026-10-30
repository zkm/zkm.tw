import React from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
    Award,
    GraduationCap,
    HeartHandshake,
    Briefcase,
    Code2,
    Mail,
    Phone,
    Globe,
    Star,
    Book,
    Users,
    Copy as CopyIcon,
    Check as CheckIcon,
    Shield,
    Palette,
    Server,
    Settings,
    Plus,
    Minus,
} from 'lucide-react';

// Lazy-load just the Bar component to keep the main bundle small
const BarChart = React.lazy(() => import('react-chartjs-2').then((m) => ({ default: m.Bar })));
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { useResumeData } from '../hooks/useResumeData';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/** --- small shared helper --- */
const base64Decode = (str: string) => {
    if (typeof window !== 'undefined' && window.atob) return window.atob(str);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    str = String(str).replace(/=+$/, '');
    if (str.length % 4 === 1) throw new Error('Invalid base64');
    let bc = 0;
    let bs = 0;
    for (let i = 0; i < str.length; i++) {
        const idx = chars.indexOf(str.charAt(i));
        if (~idx) {
            bs = bc % 4 ? bs * 64 + idx : idx;
            if (bc++ % 4) output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
        }
    }
    return output;
};

/** =========================
 *  Reveal: PHONE
 * ========================= */
const RevealPhone: React.FC = () => {
    const obfuscatedPhone = '==QO5UTOwgTOzczN';
    const [revealed, setRevealed] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const decodeDigits = React.useCallback(() => {
        try {
            const reversed = obfuscatedPhone.split('').reverse().join('');
            const decoded = base64Decode(reversed);
            if (!/^\d{10}$/.test(decoded)) return null;
            return decoded;
        } catch {
            return null;
        }
    }, []);

    const pretty = (d: string) => `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    const e164 = (d: string) => `+1${d}`;

    const onReveal = () => {
        setRevealed(true);
        const live = document.getElementById('sr-live');
        const d = decodeDigits();
        if (live && d) live.textContent = `Phone number revealed: ${pretty(d)}`;
    };

    const onCopy = async () => {
        const d = decodeDigits();
        if (!d) return;
        await navigator.clipboard.writeText(e164(d));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const d = revealed ? decodeDigits() : null;
    const prettyText = d ? pretty(d) : null;
    const telHref = d ? `tel:${e164(d)}` : undefined;

    return (
        <div className="flex items-center gap-2">
            <Phone className="inline text-[#02cacc] flex-shrink-0" size={16} aria-hidden="true" />
            {!revealed ? (
                <button
                    type="button"
                    className="jazz-link text-[#7fe3e4] hover:text-[#c4f4f4] min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#02cacc] rounded px-2"
                    onClick={onReveal}
                    aria-label="Reveal phone number"
                >
                    Reveal
                </button>
            ) : prettyText && telHref ? (
                <>
                    <a
                        id="tel"
                        className="jazz-link text-[#7fe3e4] hover:text-[#c4f4f4]"
                        href={telHref}
                    >
                        {prettyText}
                    </a>
                    <button
                        type="button"
                        onClick={onCopy}
                        className="ml-2 text-xs px-3 py-2 rounded bg-slate-800 text-[#7fe3e4] hover:bg-slate-700 inline-flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center focus-visible:ring-2 focus-visible:ring-[#02cacc]"
                        aria-label="Copy phone number"
                    >
                        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </>
            ) : (
                <span className="text-red-300">(error)</span>
            )}
        </div>
    );
};

/** =========================
 *  Reveal: EMAIL
 * ========================= */
const RevealEmail: React.FC = () => {
    const obfuscatedEmail = '=02bj5iclRWal5GajNHajFmeAVWb';
    const [showModal, setShowModal] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const dialogRef = React.useRef<HTMLDivElement | null>(null);
    useFocusTrap(dialogRef, showModal);
    const lastFocusedElementRef = React.useRef<HTMLElement | null>(null);

    const decodeEmail = React.useCallback(() => {
        try {
            const reversed = obfuscatedEmail.split('').reverse().join('');
            const decoded = base64Decode(reversed);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decoded)) return null;
            return decoded;
        } catch {
            return null;
        }
    }, []);

    const onReveal = () => {
        lastFocusedElementRef.current = document.activeElement as HTMLElement;
        setShowModal(true);
        const live = document.getElementById('sr-live');
        const em = decodeEmail();
        if (live && em) live.textContent = 'Email contact options opened.';
    };

    const onCloseModal = React.useCallback(() => {
        setShowModal(false);
        setCopied(false);
        lastFocusedElementRef.current?.focus();
    }, []);

    React.useEffect(() => {
        if (showModal) closeButtonRef.current?.focus();
    }, [showModal]);

    React.useEffect(() => {
        if (!showModal) return;

        // Capture phase + stopPropagation so Escape only dismisses this modal, not the
        // resume dialog (Portfolio) that it is rendered inside.
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onCloseModal();
            }
        };

        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
    }, [showModal, onCloseModal]);

    const onCopy = async () => {
        const em = decodeEmail();
        if (!em) return;
        await navigator.clipboard.writeText(em);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const em = decodeEmail();
    const mailto = em ? `mailto:${em}` : undefined;

    return (
        <div className="flex items-center gap-2">
            <Mail className="inline text-[#02cacc] flex-shrink-0" size={16} aria-hidden="true" />
            <button
                type="button"
                className="jazz-link text-[#7fe3e4] hover:text-[#c4f4f4] min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#02cacc] rounded px-2"
                onClick={onReveal}
                aria-label="Reveal email address"
            >
                Reveal
            </button>

            {showModal && em && mailto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <button
                        type="button"
                        aria-label="Close dialog"
                        tabIndex={-1}
                        className="absolute inset-0 cursor-default appearance-none border-0 bg-transparent p-0"
                        onClick={onCloseModal}
                    />
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="resume-email-modal-title"
                        aria-describedby="resume-email-modal-description"
                        className="w-full max-w-md rounded-2xl border border-slate-600 bg-slate-900 p-6 shadow-2xl"
                    >
                        <h3
                            id="resume-email-modal-title"
                            className="text-xl font-bold text-[#f9f4e8]"
                        >
                            Email Contact
                        </h3>
                        <p
                            id="resume-email-modal-description"
                            className="mt-2 text-sm text-slate-300"
                        >
                            Choose how to connect.
                        </p>

                        <p className="mt-4 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-[#f9f4e8]">
                            {em}
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = mailto;
                                }}
                                className="jazz-pop rounded-xl bg-[#02cacc] px-4 py-3 font-semibold text-slate-900 hover:bg-[#3fdcdd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02cacc] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                            >
                                Open Mail App
                            </button>
                            <button
                                type="button"
                                onClick={onCopy}
                                className="jazz-pop jazz-pop-teal rounded-xl border border-slate-500 bg-slate-800 px-4 py-3 font-semibold text-[#f9f4e8] hover:border-[#b48cff] hover:bg-[#6511aa]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02cacc] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 inline-flex items-center justify-center gap-2"
                                aria-label="Copy email address"
                            >
                                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                                {copied ? 'Copied' : 'Copy Email'}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onCloseModal}
                            ref={closeButtonRef}
                            className="mt-4 w-full rounded-xl border border-slate-500 px-4 py-3 text-slate-100 hover:border-[#02cacc] hover:text-[#7fe3e4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02cacc] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showModal && !em && <span className="text-red-300">(error)</span>}

            <noscript>
                <span className="ml-2 align-middle">
                    <svg width="210" height="16" aria-label="Email image">
                        <text x="0" y="12" fontFamily="monospace" fontSize="14" fill="#02cacc">
                            me [at] zachschneider [dot] com
                        </text>
                    </svg>
                </span>
            </noscript>
        </div>
    );
};

// Module-level so its identity is stable across Resume re-renders (keeps open/closed state).
const CollapsibleSection: React.FC<{
    id: string;
    title: React.ReactNode;
    children: React.ReactNode;
}> = ({ id, title, children }) => {
    const [open, setOpen] = React.useState(true); // Start expanded for better UX
    const headerId = `${id}-header`;
    const contentId = `${id}-content`;

    return (
        <div className="mb-6">
            <button
                id={headerId}
                type="button"
                onClick={() => setOpen(!open)}
                className="jazz-pop w-full text-left p-4 bg-gray-50 hover:bg-white hover:border-[#02cacc] rounded-lg border border-gray-200 flex items-center justify-between font-semibold text-gray-900 focus-visible:ring-2 focus-visible:ring-[#00777a] focus-visible:ring-offset-2"
                aria-expanded={open}
                aria-controls={contentId}
            >
                <span className="flex items-center gap-3 text-xl">{title}</span>
                {open ? (
                    <Minus size={20} aria-hidden="true" className="flex-shrink-0" />
                ) : (
                    <Plus size={20} aria-hidden="true" className="flex-shrink-0" />
                )}
            </button>

            {/* Grid-rows transition sizes to content (no fixed max-height clipping);
                `invisible` when closed removes the content from tab order and the a11y tree. */}
            <section
                id={contentId}
                aria-labelledby={headerId}
                className={`grid transition-all duration-300 ${
                    open
                        ? 'grid-rows-[1fr] opacity-100 mt-4 mb-8'
                        : 'invisible grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        {children}
                    </div>
                </div>
            </section>
            {open && <hr className="border-b border-gray-200 mt-4" />}
        </div>
    );
};

// `embedded`: rendered inside Portfolio's dialog, which already provides the page's
// main landmark and h1 — so use a plain container and a lower heading level.
const Resume: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
    // ✅ All hooks at the top, always called in the same order
    const { resumeData, loading, error } = useResumeData();
    const prefersReducedMotion = usePrefersReducedMotion();

    // Pull name/title/site from JSON (safe); keep phone/email via reveal components
    const name = resumeData?.personalInfo?.name ?? 'Zach Schneider';
    const title = resumeData?.personalInfo?.title ?? 'Cosmic Code Crusader';
    const website = resumeData?.personalInfo?.website ?? 'https://www.zachschneider.com';
    const websiteHost = (() => {
        try {
            return new URL(website).host;
        } catch {
            return website;
        }
    })();
    const experienceStartYear = resumeData?.experienceStartYear;
    const experienceYears =
        typeof experienceStartYear === 'number'
            ? Math.max(0, new Date().getFullYear() - experienceStartYear)
            : null;
    const summaryRaw = resumeData?.summary ?? '';
    const summary =
        experienceYears !== null
            ? summaryRaw.replace('{experienceYears}', `${experienceYears}+ years`)
            : summaryRaw;

    // ✅ useMemo hooks moved above any conditional return, using safe fallbacks
    const chartData = React.useMemo(() => {
        const langs = resumeData?.technicalSkills?.languages ?? {};
        const labels = Object.keys(langs);
        const values = Object.values(langs).map((skills: string[]) =>
            Array.isArray(skills) ? skills.length : 0,
        );
        return {
            labels,
            datasets: [
                {
                    label: 'Skill Count',
                    data: values,
                    // By position, in languages order: matches the HTML/CSS/JavaScript/Other chips
                    backgroundColor: [
                        'rgba(242,146,96,0.85)', // coral
                        'rgba(2,202,204,0.85)', // teal
                        'rgba(101,17,170,0.85)', // purple
                        'rgba(51,65,85,0.85)', // slate
                        'rgba(0,119,122,0.85)', // deep teal
                        'rgba(155,93,229,0.85)', // light purple
                    ],
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: 'rgba(30,41,59,0.2)',
                },
            ],
        };
    }, [resumeData?.technicalSkills?.languages]);

    const chartOptions = React.useMemo(
        () => ({
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Skill Distribution' },
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { display: false } },
            },
        }),
        [],
    );

    // ✅ Skills section state hooks at top level
    type SkillKey = 'frontend' | 'backend' | 'infrastructure' | 'security';
    const skillGroups: [SkillKey, string][] = [
        ['frontend', 'Frontend & UI'],
        ['backend', 'Backend & Cloud'],
        ['infrastructure', 'Infrastructure & DevOps'],
        ['security', 'Security & Testing'],
    ];

    const Wrapper = embedded ? 'div' : 'main';
    const Heading = embedded ? 'h3' : 'h1';
    const landmarkLabel = (label: string) => (embedded ? {} : { 'aria-label': label });

    // ⬇️ Conditional returns AFTER all hooks
    if (loading) {
        return (
            <Wrapper
                className="min-h-screen flex items-center justify-center bg-gray-900"
                aria-busy="true"
                {...landmarkLabel('Loading resume')}
            >
                <div className="text-center">
                    <div
                        className={`${prefersReducedMotion ? '' : 'animate-spin'} rounded-full h-24 w-24 border-b-2 border-[#02cacc] mx-auto`}
                        role="status"
                        aria-label="Loading spinner"
                    ></div>
                    <p className="mt-4 text-gray-300">Loading resume...</p>
                </div>
            </Wrapper>
        );
    }
    if (error) {
        return (
            <Wrapper
                className="min-h-screen flex items-center justify-center bg-red-900"
                {...landmarkLabel('Error loading resume')}
            >
                <div className="text-center">
                    <p className="text-red-300">Error loading resume: {error}</p>
                </div>
            </Wrapper>
        );
    }

    // ⬇️ Main render after all hooks and conditionals
    return (
        <Wrapper
            className="min-h-screen w-full flex items-center justify-center bg-gray-900"
            {...landmarkLabel('Resume')}
        >
            <style>{`
        @media print {
          html, body { background:#fff !important; }
          .bg-gray-900, .bg-slate-900 { background:#fff !important; color:#000 !important; }
          a { color:#000 !important; text-decoration:none !important; }
          .shadow-xl, .rounded-2xl { box-shadow:none !important; border-radius:0 !important; }
        }
      `}</style>

            <div className="flex flex-col w-full max-w-6xl mx-auto p-6 gap-4">
                <div className="flex flex-col md:flex-row w-full gap-8">
                    {/* Sidebar/Profile */}
                    <aside
                        className="w-full md:w-1/3 bg-slate-900 rounded-2xl shadow-[10px_10px_0_rgba(101,17,170,0.55)] p-8 flex flex-col items-start text-white"
                        data-nosnippet
                    >
                        <div className="mb-8 w-full">
                            <Heading className="text-3xl font-extrabold mb-2 text-[#02cacc] tracking-tight text-left">
                                {name}
                            </Heading>
                            <p className="text-lg font-semibold mb-4 text-gray-100 text-left">
                                {title}
                            </p>
                            <div className="jazz-zigzag w-32" aria-hidden="true" />
                        </div>

                        <div className="w-full mt-6">
                            <h2 className="text-xl font-bold text-[#02cacc] mb-2 uppercase tracking-wide text-left">
                                About Me
                            </h2>
                            <p className="text-gray-100 text-base mb-6 leading-relaxed text-left">
                                {summary}
                            </p>

                            <h2 className="text-xl font-bold text-[#02cacc] mb-2 uppercase tracking-wide text-left">
                                Languages
                            </h2>
                            <ul className="text-gray-100 text-base mb-6 space-y-1 text-left">
                                <li>English</li>
                            </ul>

                            <h2 className="text-xl font-bold text-[#02cacc] mb-2 uppercase tracking-wide text-left">
                                Contact
                            </h2>
                            <ul className="text-gray-100 text-base space-y-2 text-left">
                                <li>
                                    <RevealEmail />
                                </li>
                                <li>
                                    <RevealPhone />
                                </li>
                                <li className="flex items-center gap-2">
                                    <Globe className="inline text-[#02cacc]" aria-hidden="true" />
                                    <a
                                        href={website}
                                        className="jazz-link text-[#7fe3e4] hover:text-[#c4f4f4]"
                                        rel="noopener me"
                                        target="_blank"
                                        aria-label={`Visit ${websiteHost} (opens in new window)`}
                                    >
                                        {websiteHost}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Under the contact list: the sidebar stretches to the resume's full
                            height, so anything pinned to its bottom ends up far out of view. */}
                        <svg
                            className="pointer-events-none mt-10 h-32 w-64 self-center"
                            viewBox="0 0 288 160"
                            aria-hidden="true"
                        >
                            <path
                                d="M10 140 C 90 110, 170 125, 280 60"
                                fill="none"
                                stroke="#02cacc"
                                strokeWidth="34"
                                strokeLinecap="round"
                                opacity="0.12"
                            />
                            <polyline
                                points="120,70 150,44 164,70 196,42 210,68 242,40"
                                fill="none"
                                stroke="#9b5de5"
                                strokeWidth="5"
                                opacity="0.45"
                            />
                        </svg>

                        <span id="sr-live" className="sr-only" aria-live="polite" />
                    </aside>

                    {/* Main Content */}
                    <section className="w-full md:w-2/3 bg-white rounded-2xl shadow-[10px_10px_0_rgba(2,202,204,0.45)] p-8 text-left">
                        {/* Professional Summary */}
                        <CollapsibleSection
                            id="summary"
                            title={
                                <>
                                    <Book className="text-[#02cacc]" aria-hidden="true" /> Summary
                                </>
                            }
                        >
                            <p className="text-gray-900 leading-relaxed text-lg font-normal">
                                {summary}
                            </p>
                        </CollapsibleSection>

                        {/* Skills + Chart */}
                        <CollapsibleSection
                            id="skills"
                            title={
                                <>
                                    <Code2 className="text-[#02cacc]" aria-hidden="true" /> Skills
                                </>
                            }
                        >
                            <div className="space-y-6">
                                {/* Programming Languages */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <Code2 className="text-[#02cacc]" size={20} />
                                        Programming Languages
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(
                                            resumeData?.technicalSkills?.languages || {},
                                        ).map(([lang, skills]) => {
                                            const langConfig = {
                                                HTML: {
                                                    color: 'text-[#a3461a]',
                                                    bg: 'bg-[#f29260]/10',
                                                    border: 'border-[#f29260]/40',
                                                },
                                                CSS: {
                                                    color: 'text-[#00777a]',
                                                    bg: 'bg-[#02cacc]/10',
                                                    border: 'border-[#02cacc]/40',
                                                },
                                                JavaScript: {
                                                    color: 'text-[#6511aa]',
                                                    bg: 'bg-[#6511aa]/[0.06]',
                                                    border: 'border-[#6511aa]/25',
                                                },
                                                Other: {
                                                    color: 'text-slate-700',
                                                    bg: 'bg-slate-50',
                                                    border: 'border-slate-300',
                                                },
                                            }[lang] || {
                                                color: 'text-gray-600',
                                                bg: 'bg-gray-50',
                                                border: 'border-gray-200',
                                            };

                                            return (
                                                <div
                                                    key={lang}
                                                    className={`flex items-start gap-3 p-3 rounded-lg ${langConfig.bg} ${langConfig.border} border`}
                                                >
                                                    <span
                                                        className={`font-semibold min-w-[80px] text-sm ${langConfig.color}`}
                                                    >
                                                        {lang}:
                                                    </span>
                                                    <span className="text-gray-700 text-sm">
                                                        {Array.isArray(skills)
                                                            ? skills.join(', ')
                                                            : skills}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tech Stack Grid */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <Star className="text-[#6511aa]" size={20} />
                                        Technology Stack
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {skillGroups.map(([key, label]) => {
                                            const items = resumeData?.technicalSkills?.[key] as
                                                | string[]
                                                | undefined;
                                            const isArray = Array.isArray(items);
                                            if (!isArray || items.length === 0) return null;

                                            const categoryConfig = {
                                                frontend: {
                                                    icon: <Palette size={18} />,
                                                    color: 'text-[#00777a]',
                                                    bg: 'bg-gradient-to-br from-[#02cacc]/10 to-[#02cacc]/[0.03]',
                                                    border: 'border-[#02cacc]/40',
                                                    tagBg: 'bg-[#02cacc]/15',
                                                    tagHover: 'hover:bg-[#02cacc]/25',
                                                    pop: 'jazz-pop-teal',
                                                },
                                                backend: {
                                                    icon: <Server size={18} />,
                                                    color: 'text-[#6511aa]',
                                                    bg: 'bg-gradient-to-br from-[#6511aa]/[0.07] to-[#6511aa]/[0.02]',
                                                    border: 'border-[#6511aa]/25',
                                                    tagBg: 'bg-[#6511aa]/10',
                                                    tagHover: 'hover:bg-[#6511aa]/20',
                                                    pop: '',
                                                },
                                                infrastructure: {
                                                    icon: <Settings size={18} />,
                                                    color: 'text-slate-800',
                                                    bg: 'bg-gradient-to-br from-slate-100 to-slate-50',
                                                    border: 'border-slate-300',
                                                    tagBg: 'bg-slate-200',
                                                    tagHover: 'hover:bg-slate-300',
                                                    pop: 'jazz-pop-slate',
                                                },
                                                security: {
                                                    icon: <Shield size={18} />,
                                                    color: 'text-[#a3461a]',
                                                    bg: 'bg-gradient-to-br from-[#f29260]/15 to-[#f29260]/5',
                                                    border: 'border-[#f29260]/40',
                                                    tagBg: 'bg-[#f29260]/20',
                                                    tagHover: 'hover:bg-[#f29260]/30',
                                                    pop: 'jazz-pop-coral',
                                                },
                                            }[key] || {
                                                icon: <Code2 size={18} />,
                                                color: 'text-gray-700',
                                                bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
                                                border: 'border-gray-200',
                                                tagBg: 'bg-gray-100',
                                                tagHover: 'hover:bg-gray-200',
                                                pop: '',
                                            };
                                            return (
                                                <div
                                                    key={key}
                                                    className={`jazz-pop ${categoryConfig.pop} ${categoryConfig.bg} ${categoryConfig.border} border-2 rounded-xl p-6`}
                                                >
                                                    <h4
                                                        className={`font-bold mb-4 text-base uppercase tracking-wider flex items-center gap-3 ${categoryConfig.color}`}
                                                    >
                                                        {categoryConfig.icon}
                                                        <span className="font-extrabold">
                                                            {label}
                                                        </span>
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {items.map((item: string) => (
                                                            <span
                                                                key={item}
                                                                className={`${categoryConfig.tagBg} ${categoryConfig.tagHover} text-gray-800 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border border-transparent hover:border-gray-300 hover:-rotate-2 hover:scale-105 cursor-default`}
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <React.Suspense
                                    fallback={
                                        <div className="h-40 bg-gray-100 rounded animate-pulse" />
                                    }
                                >
                                    <BarChart data={chartData} options={chartOptions} />
                                </React.Suspense>
                            </div>
                        </CollapsibleSection>

                        {/* Work Experience */}
                        <CollapsibleSection
                            id="experience"
                            title={
                                <>
                                    <Briefcase className="text-[#02cacc]" aria-hidden="true" />{' '}
                                    Experience
                                </>
                            }
                        >
                            <div className="jazz-divided">
                                {resumeData?.workExperience?.map((exp) => {
                                    const companyLabel = exp.companyUrl ? (
                                        <a
                                            href={exp.companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="jazz-link jazz-link-light text-[#00777a] hover:text-[#004f51] focus-visible:ring-2 focus-visible:ring-[#00777a] rounded"
                                            aria-label={`${exp.company} (opens in new window)`}
                                        >
                                            {exp.company}
                                        </a>
                                    ) : (
                                        exp.company
                                    );

                                    const extras = (
                                        <>
                                            {(exp.notableProjects?.length ?? 0) > 0 && (
                                                <div className="ml-4 mt-2">
                                                    <div className="p-3 my-2 rounded bg-[#02cacc]/10 border-l-4 border-[#02cacc]">
                                                        <h4 className="font-medium text-[#004f51] flex items-center gap-2">
                                                            <Star aria-hidden="true" /> Notable
                                                            Projects:
                                                        </h4>
                                                        <ul className="list-disc list-inside text-gray-900">
                                                            {exp.notableProjects?.map((proj) => (
                                                                <li key={proj.name}>
                                                                    <strong>{proj.name}</strong>:{' '}
                                                                    {proj.description}{' '}
                                                                    <span className="text-gray-700">
                                                                        [
                                                                        {proj.technologies?.join(
                                                                            ', ',
                                                                        )}
                                                                        ]
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                            {(exp.honorsAndAwards?.length ?? 0) > 0 && (
                                                <div className="ml-4 mt-2">
                                                    <div className="p-3 my-2 rounded bg-[#f29260]/15 border-l-4 border-[#f29260]">
                                                        <h4 className="font-medium text-[#7a3412] flex items-center gap-2">
                                                            <Award aria-hidden="true" /> Honors &
                                                            Awards:
                                                        </h4>
                                                        <ul className="list-disc list-inside text-gray-900">
                                                            {exp.honorsAndAwards?.map((award) => (
                                                                <li key={award.award}>
                                                                    <strong>{award.award}</strong>{' '}
                                                                    <span className="text-gray-700">
                                                                        ({award.date})
                                                                    </span>{' '}
                                                                    -{' '}
                                                                    <span className="text-gray-800">
                                                                        {award.issuer}
                                                                    </span>
                                                                    : {award.description}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );

                                    if (exp.positions && exp.positions.length > 0) {
                                        return (
                                            <div key={exp.company}>
                                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                    <Briefcase
                                                        className="text-[#02cacc]"
                                                        aria-hidden="true"
                                                    />{' '}
                                                    {companyLabel}
                                                </h3>
                                                <div className="mt-3 space-y-4 border-l-2 border-[#02cacc]/50 pl-4">
                                                    {exp.positions.map((pos) => (
                                                        <div key={pos.position}>
                                                            <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                                                <Users
                                                                    className="text-[#02cacc]"
                                                                    aria-hidden="true"
                                                                />{' '}
                                                                {pos.position}
                                                            </h4>
                                                            <p className="text-gray-900 mb-1">
                                                                {pos.period}
                                                            </p>
                                                            <ul className="list-disc list-inside text-gray-900 mb-2">
                                                                {pos.responsibilities?.map(
                                                                    (r: string) => (
                                                                        <li key={r}>{r}</li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                                {extras}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={exp.company}>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <Users
                                                    className="text-[#02cacc]"
                                                    aria-hidden="true"
                                                />{' '}
                                                {exp.position}
                                                <span className="text-gray-900 font-normal">
                                                    @ {companyLabel}
                                                </span>
                                            </h3>
                                            <p className="text-gray-900 mb-1">{exp.period}</p>
                                            <ul className="list-disc list-inside text-gray-900 mb-2">
                                                {exp.responsibilities?.map((r: string) => (
                                                    <li key={r}>{r}</li>
                                                ))}
                                            </ul>
                                            {extras}
                                        </div>
                                    );
                                })}
                            </div>
                        </CollapsibleSection>

                        {/* Education */}
                        <CollapsibleSection
                            id="education"
                            title={
                                <>
                                    <GraduationCap className="text-[#02cacc]" aria-hidden="true" />{' '}
                                    Education
                                </>
                            }
                        >
                            <div className="space-y-8">
                                {resumeData?.education?.map((edu) => (
                                    <div key={`${edu.institution}-${edu.degree}`}>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Book className="text-[#02cacc]" aria-hidden="true" />{' '}
                                            {edu.degree},{' '}
                                            <span className="text-gray-900 font-normal">
                                                {edu.institution}
                                            </span>
                                        </h3>
                                        <p className="text-gray-900 mb-1">
                                            {edu.field} ({edu.period})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>

                        {/* Activities & Volunteer */}
                        <CollapsibleSection
                            id="activities"
                            title={
                                <>
                                    <HeartHandshake className="text-[#02cacc]" aria-hidden="true" />{' '}
                                    Activities
                                </>
                            }
                        >
                            <div className="space-y-8">
                                {resumeData?.activitiesAndVolunteer?.map((act) => (
                                    <div key={`${act.organization}-${act.role}`}>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Users className="text-[#02cacc]" aria-hidden="true" />{' '}
                                            {act.role}{' '}
                                            <span className="text-gray-900 font-normal">
                                                at {act.organization}
                                            </span>
                                        </h3>
                                        <p className="text-gray-900 mb-1">{act.period}</p>
                                        <p className="text-gray-900 mb-2">{act.description}</p>

                                        {(act.notableProjects?.length ?? 0) > 0 && (
                                            <div className="ml-4 mt-2">
                                                <div className="p-3 my-2 rounded bg-[#02cacc]/10 border-l-4 border-[#02cacc]">
                                                    <h4 className="font-medium text-[#004f51] flex items-center gap-2">
                                                        <Star aria-hidden="true" /> Notable
                                                        Projects:
                                                    </h4>
                                                    <ul className="list-disc list-inside text-gray-900">
                                                        {act.notableProjects?.map((proj) => (
                                                            <li key={proj.name}>
                                                                <strong>{proj.name}</strong>:{' '}
                                                                {proj.description}{' '}
                                                                <span className="text-gray-700">
                                                                    [{proj.technologies?.join(', ')}
                                                                    ]
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>

                        {/* References note */}
                        <div className="pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-black mb-3 tracking-tight">
                                References
                            </h2>
                            <p className="text-gray-800">Available upon request.</p>
                        </div>
                    </section>
                </div>
            </div>
        </Wrapper>
    );
};

export default Resume;

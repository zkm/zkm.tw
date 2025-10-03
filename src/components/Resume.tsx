import React from 'react';
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
  for (let bc = 0, bs = 0, buffer, i = 0; (buffer = str.charAt(i++));) {
    const idx = chars.indexOf(buffer);
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
      const decoded = base64Decode(reversed); // "7739809599"
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
      <Phone className="inline text-yellow-300 flex-shrink-0" size={16} aria-hidden="true" />
      {!revealed ? (
        <button
          className="underline text-yellow-200 hover:text-yellow-100 min-h-[44px] focus-visible:ring-2 focus-visible:ring-yellow-400 rounded px-2"
          onClick={onReveal}
          aria-label="Reveal phone number"
        >
          Reveal
        </button>
      ) : prettyText && telHref ? (
        <>
          <a id="tel" className="underline text-yellow-200 hover:text-yellow-100" href={telHref}>
            {prettyText}
          </a>
          <button
            onClick={onCopy}
            className="ml-2 text-xs px-3 py-2 rounded bg-slate-800 text-yellow-200 hover:bg-slate-700 inline-flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Copy phone number"
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </>
      ) : (
        <span className="text-red-300">(error)</span>
      )}

      <noscript>
        <span className="ml-2 align-middle">
          <svg width="140" height="16" aria-label="Phone number image">
            <text x="0" y="12" fontFamily="monospace" fontSize="14" fill="#FDE047">
              (773) 980-9599
            </text>
          </svg>
        </span>
      </noscript>
    </div>
  );
};

/** =========================
 *  Reveal: EMAIL
 * ========================= */
const RevealEmail: React.FC = () => {
  const obfuscatedEmail = '=02bj5iclRWal5GajNHajFmeAVWb';
  const [revealed, setRevealed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const decodeEmail = React.useCallback(() => {
    try {
      const reversed = obfuscatedEmail.split('').reverse().join('');
      const decoded = base64Decode(reversed); // "me@zachschneider.com"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decoded)) return null;
      return decoded;
    } catch {
      return null;
    }
  }, []);

  const onReveal = () => {
    setRevealed(true);
    const live = document.getElementById('sr-live');
    const em = decodeEmail();
    if (live && em) live.textContent = `Email revealed: ${em}`;
  };

  const onCopy = async () => {
    const em = decodeEmail();
    if (!em) return;
    await navigator.clipboard.writeText(em);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const em = revealed ? decodeEmail() : null;
  const mailto = em ? `mailto:${em}` : undefined;

  return (
    <div className="flex items-center gap-2">
      <Mail className="inline text-yellow-300 flex-shrink-0" size={16} aria-hidden="true" />
      {!revealed ? (
        <button
          className="underline text-yellow-200 hover:text-yellow-100 min-h-[44px] focus-visible:ring-2 focus-visible:ring-yellow-400 rounded px-2"
          onClick={onReveal}
          aria-label="Reveal email address"
        >
          Reveal
        </button>
      ) : em && mailto ? (
        <>
          <a className="underline text-yellow-200 hover:text-yellow-100" href={mailto}>
            {em}
          </a>
          <button
            onClick={onCopy}
            className="ml-2 text-xs px-3 py-2 rounded bg-slate-800 text-yellow-200 hover:bg-slate-700 inline-flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Copy email address"
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </>
      ) : (
        <span className="text-red-300">(error)</span>
      )}

      <noscript>
        <span className="ml-2 align-middle">
          <svg width="210" height="16" aria-label="Email image">
            <text x="0" y="12" fontFamily="monospace" fontSize="14" fill="#FDE047">
              me@zachschneider.com
            </text>
          </svg>
        </span>
      </noscript>
    </div>
  );
};

const Resume: React.FC = () => {
  // ✅ All hooks at the top, always called in the same order
  const { resumeData, loading, error } = useResumeData();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Pull name/title/site from JSON (safe); keep phone/email via reveal components
  const name = resumeData?.personalInfo?.name ?? 'Zach Schneider';
  const title = resumeData?.personalInfo?.title ?? 'Cosmic Code Crusader';
  const website = resumeData?.personalInfo?.website ?? 'https://www.zachschneider.com';

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
          backgroundColor: [
            'rgba(30,41,59,0.85)',
            'rgba(37,99,235,0.85)',
            'rgba(29,78,216,0.85)',
            'rgba(51,65,85,0.85)',
            'rgba(30,64,175,0.85)',
            'rgba(17,24,39,0.85)',
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
      plugins: { legend: { display: false }, title: { display: true, text: 'Skill Distribution' } },
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

  // ⬇️ Conditional returns AFTER all hooks
  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-gray-900"
        aria-busy="true"
        aria-label="Loading resume"
      >
        <div className="text-center">
          <div
            className={`${prefersReducedMotion ? '' : 'animate-spin'} rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto`}
            role="status"
            aria-label="Loading spinner"
          ></div>
          <p className="mt-4 text-gray-300">Loading resume...</p>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-red-900"
        aria-label="Error loading resume"
      >
        <div className="text-center">
          <p className="text-red-300">Error loading resume: {error}</p>
        </div>
      </main>
    );
  }

  // ⬇️ Main render after all hooks and conditionals
  // CollapsibleSection component
  const CollapsibleSection: React.FC<{
    id: string;
    title: React.ReactNode;
    children: React.ReactNode;
  }> = ({ id, title, children }) => {
    const [open, setOpen] = React.useState(true); // Start expanded for better UX
    const headerId = `${id}-header`;
    const contentId = `${id}-content`;
    const descriptionId = `${id}-description`;

    return (
      <div className="mb-6">
        <button
          id={headerId}
          onClick={() => setOpen(!open)}
          className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200 flex items-center justify-between font-semibold text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls={contentId}
          aria-describedby={descriptionId}
        >
          <span className="flex items-center gap-3 text-xl">{title}</span>
          <span
            className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>

        <div
          id={contentId}
          role="region"
          aria-labelledby={headerId}
          aria-describedby={descriptionId}
          className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-[5000px] opacity-100 mt-4 mb-8' : 'max-h-0 opacity-0'
            }`}
        >
          <div
            id={descriptionId}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            {children}
          </div>
        </div>
        {open && (
          <div className="border-b border-gray-200 mt-4" role="separator" aria-hidden="true"></div>
        )}
      </div>
    );
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center bg-gray-900"
      aria-label="Resume"
    >
      <style>{`
        @media print {
          html, body { background:#fff !important; }
          .bg-gray-900, .bg-slate-900 { background:#fff !important; color:#000 !important; }
          a { color:#000 !important; text-decoration:none !important; }
          .shadow-xl, .rounded-2xl { box-shadow:none !important; border-radius:0 !important; }
        }
      `}</style>

      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-6 gap-8">
        {/* Sidebar/Profile */}
        <aside
          className="w-full md:w-1/3 bg-slate-900 rounded-2xl shadow-xl p-8 flex flex-col items-start text-white"
          data-nosnippet
        >
          <div className="mb-8 w-full">
            <h1 className="text-3xl font-extrabold mb-2 text-yellow-300 tracking-tight text-left">
              {name}
            </h1>
            <p className="text-lg font-semibold mb-4 text-gray-100 text-left">{title}</p>
          </div>

          <div className="w-full mt-6">
            <h2 className="text-xl font-bold text-yellow-300 mb-2 uppercase tracking-wide text-left">
              About Me
            </h2>
            <p className="text-gray-100 text-base mb-6 leading-relaxed text-left">
              {resumeData?.summary}
            </p>

            <h2 className="text-xl font-bold text-yellow-300 mb-2 uppercase tracking-wide text-left">
              Languages
            </h2>
            <ul className="text-gray-100 text-base mb-6 space-y-1 text-left">
              <li>English</li>
            </ul>

            <h2 className="text-xl font-bold text-yellow-300 mb-2 uppercase tracking-wide text-left">
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
                <Globe className="inline text-yellow-300" aria-hidden="true" />
                <a
                  href={website}
                  className="underline text-yellow-200 hover:text-yellow-100"
                  rel="me"
                  target="_blank"
                  aria-label={`Visit ${new URL(website).host} (opens in new window)`}
                >
                  {new URL(website).host}
                </a>
              </li>
            </ul>
          </div>

          <span id="sr-live" className="sr-only" aria-live="polite" />
        </aside>

        {/* Main Content */}
        <section className="w-full md:w-2/3 bg-white rounded-2xl shadow-xl p-8 text-left">
          {/* Professional Summary */}
          <CollapsibleSection
            id="summary"
            title={
              <>
                <Book className="text-blue-400" aria-hidden="true" /> Summary
              </>
            }
          >
            <p className="text-gray-900 leading-relaxed text-lg font-normal">
              {resumeData?.summary}
            </p>
          </CollapsibleSection>

          {/* Skills + Chart */}
          <CollapsibleSection
            id="skills"
            title={
              <>
                <Code2 className="text-blue-400" aria-hidden="true" /> Skills
              </>
            }
          >
            <div className="space-y-6">
              {/* Programming Languages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <Code2 className="text-blue-500" size={20} />
                  Programming Languages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(resumeData?.technicalSkills?.languages || {}).map(
                    ([lang, skills]) => {
                      const langConfig = {
                        HTML: {
                          color: 'text-orange-600',
                          bg: 'bg-orange-50',
                          border: 'border-orange-200',
                        },
                        CSS: {
                          color: 'text-blue-600',
                          bg: 'bg-blue-50',
                          border: 'border-blue-200',
                        },
                        JavaScript: {
                          color: 'text-yellow-600',
                          bg: 'bg-yellow-50',
                          border: 'border-yellow-200',
                        },
                        Other: {
                          color: 'text-purple-600',
                          bg: 'bg-purple-50',
                          border: 'border-purple-200',
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
                            {Array.isArray(skills) ? skills.join(', ') : skills}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Tech Stack Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <Star className="text-purple-500" size={20} />
                  Technology Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skillGroups.map(([key, label]) => {
                    const items = resumeData?.technicalSkills?.[key] as string[] | undefined;
                    const isArray = Array.isArray(items);
                    if (!isArray || items.length === 0) return null;

                    const categoryConfig = {
                      frontend: {
                        icon: <Palette size={18} />,
                        color: 'text-blue-700',
                        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                        border: 'border-blue-200',
                        tagBg: 'bg-blue-100',
                        tagHover: 'hover:bg-blue-200',
                        shadow: 'hover:shadow-blue-200/30',
                      },
                      backend: {
                        icon: <Server size={18} />,
                        color: 'text-emerald-700',
                        bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
                        border: 'border-emerald-200',
                        tagBg: 'bg-emerald-100',
                        tagHover: 'hover:bg-emerald-200',
                        shadow: 'hover:shadow-emerald-200/30',
                      },
                      infrastructure: {
                        icon: <Settings size={18} />,
                        color: 'text-purple-700',
                        bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
                        border: 'border-purple-200',
                        tagBg: 'bg-purple-100',
                        tagHover: 'hover:bg-purple-200',
                        shadow: 'hover:shadow-purple-200/30',
                      },
                      security: {
                        icon: <Shield size={18} />,
                        color: 'text-orange-700',
                        bg: 'bg-gradient-to-br from-orange-50 to-red-50',
                        border: 'border-orange-200',
                        tagBg: 'bg-orange-100',
                        tagHover: 'hover:bg-orange-200',
                        shadow: 'hover:shadow-orange-200/30',
                      },
                    }[key] || {
                      icon: <Code2 size={18} />,
                      color: 'text-gray-700',
                      bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
                      border: 'border-gray-200',
                      tagBg: 'bg-gray-100',
                      tagHover: 'hover:bg-gray-200',
                      shadow: 'hover:shadow-gray-200/30',
                    };
                    return (
                      <div
                        key={key}
                        className={`${categoryConfig.bg} ${categoryConfig.border} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${categoryConfig.shadow} transform hover:-translate-y-1`}
                      >
                        <h4
                          className={`font-bold mb-4 text-base uppercase tracking-wider flex items-center gap-3 ${categoryConfig.color}`}
                        >
                          {categoryConfig.icon}
                          <span className="font-extrabold">{label}</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {items.map((item: string) => (
                            <span
                              key={item}
                              className={`${categoryConfig.tagBg} ${categoryConfig.tagHover} text-gray-800 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border border-transparent hover:border-gray-300 hover:scale-105 cursor-default`}
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
              <React.Suspense fallback={<div className="h-40 bg-gray-100 rounded animate-pulse" />}>
                <BarChart data={chartData} options={chartOptions} />
              </React.Suspense>
            </div>
          </CollapsibleSection>

          {/* Work Experience */}
          <CollapsibleSection
            id="experience"
            title={
              <>
                <Briefcase className="text-blue-400" aria-hidden="true" /> Experience
              </>
            }
          >
            <div className="space-y-8">
              {resumeData?.workExperience?.map((exp, idx: number) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="text-blue-400" aria-hidden="true" /> {exp.position}
                    <span className="text-gray-900 font-normal">
                      @{' '}
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                          aria-label={`${exp.company} (opens in new window)`}
                        >
                          {exp.company}
                        </a>
                      ) : (
                        exp.company
                      )}
                    </span>
                  </h3>
                  <p className="text-gray-900 mb-1">{exp.period}</p>
                  <ul className="list-disc list-inside text-gray-900 mb-2">
                    {exp.responsibilities?.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>

                  {(exp.notableProjects?.length ?? 0) > 0 && (
                    <div className="ml-4 mt-2">
                      <div className="p-3 my-2 rounded bg-blue-50 border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 flex items-center gap-2">
                          <Star aria-hidden="true" /> Notable Projects:
                        </h4>
                        <ul className="list-disc list-inside text-gray-900">
                          {exp.notableProjects?.map((proj, pi: number) => (
                            <li key={pi}>
                              <strong>{proj.name}</strong>: {proj.description}{' '}
                              <span className="text-gray-700">
                                [{proj.technologies?.join(', ')}]
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {(exp.honorsAndAwards?.length ?? 0) > 0 && (
                    <div className="ml-4 mt-2">
                      <div className="p-3 my-2 rounded bg-yellow-50 border-l-4 border-yellow-400">
                        <h4 className="font-medium text-yellow-900 flex items-center gap-2">
                          <Award aria-hidden="true" /> Honors & Awards:
                        </h4>
                        <ul className="list-disc list-inside text-gray-900">
                          {exp.honorsAndAwards?.map((award, ai: number) => (
                            <li key={ai}>
                              <strong>{award.award}</strong>{' '}
                              <span className="text-gray-700">({award.date})</span> -{' '}
                              <span className="text-gray-800">{award.issuer}</span>:{' '}
                              {award.description}
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

          {/* Education */}
          <CollapsibleSection
            id="education"
            title={
              <>
                <GraduationCap className="text-blue-400" aria-hidden="true" /> Education
              </>
            }
          >
            <div className="space-y-8">
              {resumeData?.education?.map((edu, idx: number) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Book className="text-blue-400" aria-hidden="true" /> {edu.degree},{' '}
                    <span className="text-gray-900 font-normal">{edu.institution}</span>
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
                <HeartHandshake className="text-blue-400" aria-hidden="true" /> Activities
              </>
            }
          >
            <div className="space-y-8">
              {resumeData?.activitiesAndVolunteer?.map((act, idx: number) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="text-blue-400" aria-hidden="true" /> {act.role}{' '}
                    <span className="text-gray-900 font-normal">at {act.organization}</span>
                  </h3>
                  <p className="text-gray-900 mb-1">{act.period}</p>
                  <p className="text-gray-900 mb-2">{act.description}</p>

                  {(act.notableProjects?.length ?? 0) > 0 && (
                    <div className="ml-4 mt-2">
                      <div className="p-3 my-2 rounded bg-blue-50 border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 flex items-center gap-2">
                          <Star aria-hidden="true" /> Notable Projects:
                        </h4>
                        <ul className="list-disc list-inside text-gray-900">
                          {act.notableProjects?.map((proj, pi: number) => (
                            <li key={pi}>
                              <strong>{proj.name}</strong>: {proj.description}{' '}
                              <span className="text-gray-700">
                                [{proj.technologies?.join(', ')}]
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
            <h2 className="text-2xl font-bold text-black mb-3 tracking-tight">References</h2>
            <p className="text-gray-800">Available upon request.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Resume;

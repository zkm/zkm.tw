import React from 'react';

// Lazy-load just the Bar component to keep the main bundle small
const BarChart = React.lazy(() => import('react-chartjs-2').then((m) => ({ default: m.Bar })));
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { useResumeData } from '../hooks/useResumeData';
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
} from 'lucide-react';

/** --- small shared helper --- */
const base64Decode = (str: string) => {
  if (typeof window !== 'undefined' && window.atob) return window.atob(str);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  str = String(str).replace(/=+$/, '');
  if (str.length % 4 === 1) throw new Error('Invalid base64');
  for (let bc = 0, bs = 0, buffer, i = 0; (buffer = str.charAt(i++)); ) {
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
      <Phone className="inline text-yellow-400 flex-shrink-0" size={16} aria-hidden="true" />
      {!revealed ? (
        <button
          className="underline text-yellow-300 hover:text-yellow-400"
          onClick={onReveal}
          aria-label="Reveal phone number"
        >
          Reveal
        </button>
      ) : prettyText && telHref ? (
        <>
          <a id="tel" className="underline text-yellow-300 hover:text-yellow-400" href={telHref}>
            {prettyText}
          </a>
          <button
            onClick={onCopy}
            className="ml-2 text-xs px-2 py-1 rounded bg-slate-800 text-yellow-300 hover:bg-slate-700 inline-flex items-center gap-1"
            aria-label="Copy phone number"
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </>
      ) : (
        <span className="text-red-400">(error)</span>
      )}

      <noscript>
        <span className="ml-2 align-middle">
          <svg width="140" height="16" aria-label="Phone number image">
            <text x="0" y="12" fontFamily="monospace" fontSize="14" fill="#FDE68A">
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
      <Mail className="inline text-yellow-400 flex-shrink-0" size={16} aria-hidden="true" />
      {!revealed ? (
        <button
          className="underline text-yellow-300 hover:text-yellow-400"
          onClick={onReveal}
          aria-label="Reveal email address"
        >
          Reveal
        </button>
      ) : em && mailto ? (
        <>
          <a className="underline hover:text-yellow-300" href={mailto}>
            {em}
          </a>
          <button
            onClick={onCopy}
            className="ml-2 text-xs px-2 py-1 rounded bg-slate-800 text-yellow-300 hover:bg-slate-700 inline-flex items-center gap-1"
            aria-label="Copy email address"
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </>
      ) : (
        <span className="text-red-400">(error)</span>
      )}

      <noscript>
        <span className="ml-2 align-middle">
          <svg width="210" height="16" aria-label="Email image">
            <text x="0" y="12" fontFamily="monospace" fontSize="14" fill="#FDE68A">
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

  // Pull name/title/site from JSON (safe); keep phone/email via reveal components
  const name = resumeData?.personalInfo?.name ?? 'Zach Schneider';
  const title = resumeData?.personalInfo?.title ?? 'Web Developer Advisor';
  const website = resumeData?.personalInfo?.website ?? 'https://www.zachschneider.com';

  // ✅ useMemo hooks moved above any conditional return, using safe fallbacks
  const chartData = React.useMemo(() => {
    const langs = resumeData?.technicalSkills?.languages ?? {};
    const labels = Object.keys(langs);
    const values = Object.values(langs).map((skills: string[]) => (Array.isArray(skills) ? skills.length : 0));
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
      scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { display: false } } },
    }),
    []
  );

  // ⬇️ Conditional returns AFTER all hooks
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900" aria-busy="true" aria-label="Loading resume">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto" role="status" aria-label="Loading spinner"></div>
          <p className="mt-4 text-gray-300">Loading resume...</p>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900" aria-label="Resume error">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading resume: {error}</p>
        </div>
      </main>
    );
  }
  if (!resumeData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900" aria-label="No resume data">
        <p className="text-gray-300">No resume data found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-900" aria-label="Resume">
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
        <aside className="w-full md:w-1/3 bg-slate-900 rounded-2xl shadow-xl p-8 flex flex-col items-start text-white" data-nosnippet>
          <div className="mb-8 w-full">
            <h1 className="text-3xl font-extrabold mb-2 text-yellow-400 tracking-tight text-left">{name}</h1>
            <p className="text-lg font-semibold mb-4 text-gray-200 text-left">{title}</p>
          </div>

          <div className="w-full mt-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wide text-left">About Me</h2>
            <p className="text-gray-200 text-base mb-6 leading-relaxed text-left">{resumeData.summary}</p>

            <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wide text-left">Languages</h2>
            <ul className="text-gray-200 text-base mb-6 space-y-1 text-left">
              <li>English</li>
            </ul>

            <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wide text-left">Contact</h2>
            <ul className="text-gray-200 text-base space-y-2 text-left">
              <li><RevealEmail /></li>
              <li><RevealPhone /></li>
              <li className="flex items-center gap-2">
                <Globe className="inline text-yellow-400" aria-hidden="true" />
                <a href={website} className="underline hover:text-yellow-300" rel="me" target='_blank'>
                  {new URL(website).host}
                </a>
              </li>
            </ul>
          </div>

          <span id="sr-live" className="sr-only" aria-live="polite" />
        </aside>

        {/* Main Content */}
        <section className="w-full md:w-2/3 bg-white rounded-2xl shadow-xl p-8 text-left">
          {/* Collapsible helper */}
            {/** Simple accessible collapsible section */}
            {(() => {
              type CollapsibleProps = {
                id: string;
                title: React.ReactNode;
                children: React.ReactNode;
                className?: string;
                defaultOpen?: boolean;
              };
              // Accessible collapsible section component with improved styling and animations
              // Updated: August 12, 2025
              const CollapsibleSection: React.FC<CollapsibleProps> = ({ id, title, children, className = '', defaultOpen = true }) => {
                const [open, setOpen] = React.useState(defaultOpen);
                const contentId = `${id}-content`;
                const headerId = `${id}-header`;
                
                return (
                  <div className={`mb-8 ${className}`}>
                    <h2 id={headerId} className="mb-0">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={contentId}
                        aria-describedby={headerId}
                        onClick={() => setOpen((v) => !v)}
                        className="w-full flex items-center justify-between gap-4 group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 focus:from-blue-100 focus:to-indigo-100 rounded-xl p-4 border border-blue-200 hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        <span className="text-2xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">{title}</span>
                        <div className={`transition-all duration-300 ${open ? 'rotate-180' : 'rotate-0'} bg-white rounded-full p-2 shadow-sm group-hover:shadow-md flex-shrink-0`}>
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="text-blue-600"
                            aria-hidden="true"
                            role="img"
                            aria-label={open ? 'Collapse section' : 'Expand section'}
                          >
                            <polyline points="6,9 12,15 18,9"></polyline>
                          </svg>
                        </div>
                        <span className="sr-only">
                          {open ? 'Collapse' : 'Expand'} section
                        </span>
                      </button>
                    </h2>
                    <div 
                      id={contentId} 
                      role="region"
                      aria-labelledby={headerId}
                      className={`transition-all duration-300 overflow-hidden ${
                        open 
                          ? 'max-h-[5000px] opacity-100 mt-4 mb-8' 
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        {children}
                      </div>
                    </div>
                    {open && <div className="border-b border-gray-200 mt-4" role="separator" aria-hidden="true"></div>}
                  </div>
                );
              };

              return (
                <>
                  {/* Professional Summary */}
                  <CollapsibleSection id="summary" title={<><Book className="text-blue-400" aria-hidden="true" /> Summary</>}>
                    <p className="text-gray-900 leading-relaxed text-lg font-normal">{resumeData.summary}</p>
                  </CollapsibleSection>

                  {/* Technical Skills + Chart */}
                  <CollapsibleSection id="skills" title={<><Code2 className="text-blue-400" aria-hidden="true" /> Skills</>}>
                    <ul className="list-disc list-inside text-gray-900 text-base mb-6 space-y-1">
                      <li><strong className="text-blue-600">HTML:</strong> {resumeData.technicalSkills.languages.HTML.join(', ')}</li>
                      <li><strong className="text-green-600">CSS:</strong> {resumeData.technicalSkills.languages.CSS.join(', ')}</li>
                      <li><strong className="text-yellow-500">JavaScript:</strong> {resumeData.technicalSkills.languages.JavaScript.join(', ')}</li>
                      <li><strong className="text-purple-600">PHP:</strong> {resumeData.technicalSkills.languages.PHP.join(', ')}</li>
                      <li><strong className="text-gray-700">Other:</strong> {resumeData.technicalSkills.languages.Other.join(', ')}</li>
                      <li><strong className="text-indigo-600">Frameworks:</strong> {resumeData.technicalSkills.frameworks.join(', ')}</li>
                      <li><strong className="text-pink-600">CMS:</strong> {resumeData.technicalSkills.cms.join(', ')}</li>
                      <li><strong className="text-orange-500">Cloud:</strong> {resumeData.technicalSkills.cloud.join(', ')}</li>
                      <li><strong className="text-teal-600">Tools:</strong> {resumeData.technicalSkills.tools.join(', ')}</li>
                      <li><strong className="text-red-500">Testing:</strong> {resumeData.technicalSkills.testing.join(', ')}</li>
                      <li><strong className="text-blue-500">Methodologies:</strong> {resumeData.technicalSkills.methodologies.join(', ')}</li>
                    </ul>

                    <div className="mt-6">
                      <React.Suspense fallback={<div className="h-40 bg-gray-100 rounded animate-pulse" />}>
                        <BarChart data={chartData} options={chartOptions} />
                      </React.Suspense>
                    </div>
                  </CollapsibleSection>

                  {/* Work Experience */}
                  <CollapsibleSection id="experience" title={<><Briefcase className="text-blue-400" aria-hidden="true" /> Experience</>}>
                    <div className="space-y-8">
                      {resumeData.workExperience.map((exp, idx: number) => (
                        <div key={idx}>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Users className="text-blue-400" aria-hidden="true" /> {exp.position}
                            <span className="text-gray-900 font-normal">@ {exp.company}</span>
                          </h3>
                          <p className="text-gray-900 mb-1">{exp.period}</p>
                          <ul className="list-disc list-inside text-gray-900 mb-2">
                            {exp.responsibilities.map((r: string, i: number) => <li key={i}>{r}</li>)}
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
                                      <span className="text-gray-700">[{proj.technologies.join(', ')}]</span>
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
                                      <span className="text-gray-800">{award.issuer}</span>: {award.description}
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
                  <CollapsibleSection id="education" title={<><GraduationCap className="text-blue-400" aria-hidden="true" /> Education</>}>
                    <div className="space-y-8">
                      {resumeData.education.map((edu, idx: number) => (
                        <div key={idx}>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Book className="text-blue-400" aria-hidden="true" /> {edu.degree},{' '}
                            <span className="text-gray-900 font-normal">{edu.institution}</span>
                          </h3>
                          <p className="text-gray-900 mb-1">{edu.field} ({edu.period})</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  {/* Activities & Volunteer */}
                  <CollapsibleSection id="activities" title={<><HeartHandshake className="text-blue-400" aria-hidden="true" /> Activities</>}>
                    <div className="space-y-8">
                      {resumeData.activitiesAndVolunteer.map((act, idx: number) => (
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
                                      <span className="text-gray-700">[{proj.technologies.join(', ')}]</span>
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
                </>
              );
            })()}

          
        </section>
      </div>
    </main>
  );
};

export default Resume;

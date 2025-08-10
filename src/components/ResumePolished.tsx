import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { useResumeData } from '../hooks/useResumeData';
import { User, Award, GraduationCap, HeartHandshake, Briefcase, Code2, Mail, Phone, Globe, Star, Book, Users, Download } from 'lucide-react';

const ResumePolished: React.FC = () => {
  const { resumeData, loading, error } = useResumeData();

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

  // Chart data for skills
  const skillLabels = Object.keys(resumeData.technicalSkills.languages);
  const skillValues = Object.values(resumeData.technicalSkills.languages).map((skills: string[]) => skills.length);
  const chartData = {
    labels: skillLabels,
    datasets: [
      {
        label: 'Skill Count',
        data: skillValues,
        backgroundColor: [
          'rgba(30,41,59,0.85)', // dark blue-gray
          'rgba(37,99,235,0.85)', // blue
          'rgba(29,78,216,0.85)', // dark blue
          'rgba(51,65,85,0.85)', // slate
          'rgba(30,64,175,0.85)', // indigo
          'rgba(17,24,39,0.85)', // almost black
        ],
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(30,41,59,0.2)',
      },
    ],
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-900" aria-label="Resume">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-6 gap-8">
        {/* Sidebar/Profile */}
        <aside className="w-full md:w-1/3 bg-slate-900 rounded-2xl shadow-xl p-8 flex flex-col items-start text-white text-left">
          <div className="mb-8 w-full">
            <h1 className="text-3xl font-extrabold mb-2 text-yellow-400 tracking-tight">Zach Schneider</h1>
            <p className="text-lg font-semibold mb-4 text-gray-200">Senior Web Developer & Technical Advisor</p>
          </div>
          <div className="w-full mt-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wide">About Me</h2>
            <p className="text-gray-200 text-base mb-6 leading-relaxed">Experienced Senior Web Developer with 15+ years of expertise in modern frontend technologies, team leadership, and technical architecture.</p>
            <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wide">Languages</h2>
            <ul className="text-gray-200 text-base mb-6 space-y-1">
              <li>English</li>
              {/* TODO: Fetch languages from resume.json for data-driven rendering */}
            </ul>
            <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-wide">Contact</h2>
            <ul className="text-gray-200 text-base space-y-2">
              <li className="flex items-center gap-2"><Mail className="inline text-yellow-400" /> me@zachschneider.com</li>
              <li className="flex items-center gap-2"><Phone className="inline text-yellow-400" /> (260) 435-9767</li>
              <li className="flex items-center gap-2"><Globe className="inline text-yellow-400" /> <a href="https://www.zachschneider.com" className="underline hover:text-yellow-300">zachschneider.com</a></li>
            </ul>
          </div>
        </aside>
        {/* Main Content */}
        <section className="w-full md:w-2/3 bg-white rounded-2xl shadow-xl p-8">
          {/* Professional Summary */}
          <div className="mb-10 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-3 flex items-center gap-2 tracking-tight"><Book className="text-indigo-400" /> Professional Summary</h2>
            <p className="text-gray-900 leading-relaxed text-lg font-normal">Experienced Senior Web Developer with 15+ years of expertise in modern frontend technologies, team leadership, and technical architecture. Proven track record of successfully migrating legacy systems to modern frameworks, leading cross-functional teams, and delivering high-impact web solutions. Passionate about mentoring developers and implementing best practices that drive business results.</p>
          </div>
          {/* Technical Skills + Chart */}
          <div className="mb-10 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-3 flex items-center gap-2 tracking-tight"><Code2 className="text-blue-400" /> Technical Skills</h2>
            <ul className="list-disc list-inside text-gray-900 text-base mb-6 space-y-1">
              <li><strong className="text-blue-600">HTML:</strong> HTML5, XHTML, HAML, Web Components</li>
              <li><strong className="text-green-600">CSS:</strong> SASS, SCSS, LESS, CSS3, Tailwind CSS, PostCSS</li>
              <li><strong className="text-yellow-500">JavaScript:</strong> ES2024, TypeScript, React, Node.js, Next.js, Vite, jQuery, Webpack</li>
              <li><strong className="text-purple-600">PHP:</strong> Zend, Symfony, CodeIgniter</li>
              <li><strong className="text-gray-700">Other:</strong> Python, Java, Ruby</li>
              <li><strong className="text-indigo-600">Frameworks:</strong> React 18+, Next.js, Angular, Vue.js, Express.js, Backbone.js</li>
              <li><strong className="text-pink-600">CMS:</strong> WordPress, Drupal, Magento, Contentful, Strapi</li>
              <li><strong className="text-orange-500">Cloud:</strong> AWS, Azure, Vercel, Netlify</li>
              <li><strong className="text-teal-600">Tools:</strong> Git, Docker, JIRA, Figma, Adobe Creative Suite</li>
              <li><strong className="text-red-500">Testing:</strong> Jest, Cypress, Playwright, React Testing Library</li>
              <li><strong className="text-blue-500">Methodologies:</strong> Agile, SCRUM, CI/CD, DevOps</li>
            </ul>
            <div className="mt-6">
              <Bar data={chartData} options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Skill Distribution' }
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true, grid: { display: false } }
                }
              }} />
            </div>
          </div>
          {/* Work Experience */}
          <div className="mb-10 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2 tracking-tight"><Briefcase className="text-blue-400" /> Work Experience</h2>
            <div className="space-y-8">
              {resumeData.workExperience.map((exp, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="text-blue-400" /> {exp.position}
                    <span className="text-gray-900 font-normal">@ {exp.company}</span>
                  </h3>
                  <p className="text-gray-900 mb-1">{exp.period}</p>
                  <ul className="list-disc list-inside text-gray-900 mb-2">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  {exp.notableProjects && exp.notableProjects.length > 0 && (
                    <div className="ml-4 mt-2">
                      <div className="p-3 my-2 rounded bg-blue-50 border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 flex items-center gap-2"><Star aria-hidden="true" /> Notable Projects:</h4>
                        <ul className="list-disc list-inside text-gray-900">
                          {exp.notableProjects.map((proj, pi) => (
                            <li key={pi}><strong>{proj.name}</strong>: {proj.description} <span className="text-gray-700">[{proj.technologies.join(', ')}]</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {exp.honorsAndAwards && exp.honorsAndAwards.length > 0 && (
                    <div className="ml-4 mt-2">
                      <div className="p-3 my-2 rounded bg-yellow-50 border-l-4 border-yellow-400">
                        <h4 className="font-medium text-yellow-900 flex items-center gap-2"><Award aria-hidden="true" /> Honors & Awards:</h4>
                        <ul className="list-disc list-inside text-gray-900">
                          {exp.honorsAndAwards.map((award, ai) => (
                            <li key={ai}><strong>{award.award}</strong> <span className="text-gray-700">({award.date})</span> - <span className="text-gray-800">{award.issuer}</span>: {award.description}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Education */}
          <div className="mb-10 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2 tracking-tight"><GraduationCap className="text-yellow-400" /> Education</h2>
            <div className="space-y-8">
              {resumeData.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Book className="text-yellow-400" /> {edu.degree}, <span className="text-gray-900 font-normal">{edu.institution}</span>
                  </h3>
                  <p className="text-gray-900 mb-1">{edu.field} ({edu.period})</p>
                </div>
              ))}
            </div>
          </div>
          {/* Activities & Volunteer */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2 tracking-tight"><HeartHandshake className="text-pink-400" /> Activities & Volunteer</h2>
            <div className="space-y-8">
              {resumeData.activitiesAndVolunteer.map((act, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="text-pink-400" /> {act.role} <span className="text-gray-900 font-normal">at {act.organization}</span>
                  </h3>
                  <p className="text-gray-900 mb-1">{act.period}</p>
                  <p className="text-gray-900 mb-2">{act.description}</p>
                  {act.notableProjects && act.notableProjects.length > 0 && (
                    <div className="ml-4 mt-2">
                      <div className="p-3 my-2 rounded bg-pink-50 border-l-4 border-pink-400">
                        <h4 className="font-medium text-pink-900 flex items-center gap-2"><Star aria-hidden="true" /> Notable Projects:</h4>
                        <ul className="list-disc list-inside text-gray-900">
                          {act.notableProjects.map((proj, pi) => (
                            <li key={pi}><strong>{proj.name}</strong>: {proj.description} <span className="text-gray-700">[{proj.technologies.join(', ')}]</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ResumePolished;

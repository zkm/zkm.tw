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
      <main className="min-h-screen flex items-center justify-center bg-background-dark" aria-busy="true" aria-label="Loading resume">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto" role="status" aria-label="Loading spinner"></div>
          <p className="mt-4 text-gray-300">Loading resume...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background-dark" aria-label="Resume error">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading resume: {error}</p>
        </div>
      </main>
    );
  }

  if (!resumeData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background-dark" aria-label="No resume data">
        <p className="text-gray-300">No resume data found.</p>
      </main>
    );
  }

  // Chart data for skills
  const skillLabels = Object.keys(resumeData.technicalSkills.languages);
  const skillValues = skillLabels.map(lang => resumeData.technicalSkills.languages[lang].length);
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
  <main className="min-h-screen flex items-center justify-center bg-background-dark" aria-label="Resume">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:ring-2 focus:ring-blue-600">Skip to main content</a>
      <div className="max-w-4xl w-full mx-auto p-6 relative" id="main-content" tabIndex={-1}>
        {/* Floating Action Button for PDF Download */}
        <button
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg p-4 hover:scale-105 focus:ring-4 focus:ring-pink-400 transition-all"
          aria-label="Download Resume as PDF"
        >
          <Download size={28} />
        </button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background-dark rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-800"
          role="region" aria-labelledby="resume-header"
        >
          <div className="bg-background-dark text-white p-8">
            <h1 id="resume-header" className="text-4xl font-extrabold mb-1 flex items-center gap-3 drop-shadow-lg">
              <User aria-hidden="true" className="text-pink-300" /> {resumeData.personalInfo.name}
            </h1>
            <p className="text-lg text-pink-200 mb-2 font-semibold flex items-center gap-2">
              <Star className="inline text-yellow-300" aria-hidden="true" /> {resumeData.personalInfo.title}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-blue-100 text-base mt-2">
              <span className="flex items-center gap-2"><Mail className="inline text-blue-300" aria-hidden="true" />{resumeData.personalInfo.email}</span>
              <span className="flex items-center gap-2"><Phone className="inline text-green-300" aria-hidden="true" />{resumeData.personalInfo.phone}</span>
              {resumeData.personalInfo.website && <span className="flex items-center gap-2"><Globe className="inline text-pink-300" aria-hidden="true" />{resumeData.personalInfo.website}</span>}
            </div>
          </div>
        </motion.div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Professional Summary */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-background-dark rounded-xl shadow-lg p-6 border border-gray-800"
            role="region" aria-labelledby="summary-header"
          >
            <h2 id="summary-header" className="text-xl font-bold text-pink-700 mb-2 flex items-center gap-2">
              <Book aria-hidden="true" className="text-indigo-400" /> Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-base font-medium">{resumeData.summary}</p>
          </motion.section>

          {/* Technical Skills + Chart */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-background-dark rounded-xl shadow-lg p-6 border border-gray-800"
            role="region" aria-labelledby="skills-header"
          >
            <h2 id="skills-header" className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
              <Code2 aria-hidden="true" className="text-blue-400" /> Technical Skills
            </h2>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(236,72,153,0.9)', titleColor: '#fff', bodyColor: '#fff' } } }} aria-label="Skills chart" />
            <ul className="list-disc list-inside text-gray-700 text-sm mt-4">
              {Object.entries(resumeData.technicalSkills.languages).map(([lang, skills]) => (
                <li key={lang}><strong className="text-blue-700">{lang}:</strong> {skills.join(', ')}</li>
              ))}
              <li><strong className="text-indigo-700">Frameworks:</strong> {resumeData.technicalSkills.frameworks.join(', ')}</li>
              <li><strong className="text-pink-700">CMS:</strong> {resumeData.technicalSkills.cms.join(', ')}</li>
              <li><strong className="text-yellow-700">Cloud:</strong> {resumeData.technicalSkills.cloud.join(', ')}</li>
              <li><strong className="text-green-700">Tools:</strong> {resumeData.technicalSkills.tools.join(', ')}</li>
              <li><strong className="text-red-700">Testing:</strong> {resumeData.technicalSkills.testing.join(', ')}</li>
              <li><strong className="text-blue-700">Methodologies:</strong> {resumeData.technicalSkills.methodologies.join(', ')}</li>
            </ul>
          </motion.section>
        </div>

        {/* Work Experience */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-background-dark rounded-xl shadow-lg p-8 mt-10 border border-blue-900"
          role="region" aria-labelledby="work-header"
        >
          <h2 id="work-header" className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
            <Briefcase aria-hidden="true" className="text-blue-400" /> Work Experience
          </h2>
          {resumeData.workExperience.map((exp, idx) => (
            <div key={idx} className="mb-8">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Users aria-hidden="true" className="text-pink-400" /> {exp.position} <span className="text-gray-600">@ {exp.company}</span>
              </h3>
              <p className="text-gray-500 mb-2">{exp.period}</p>
              <ul className="list-disc list-inside text-gray-700 mb-2">
                {exp.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              {exp.notableProjects && exp.notableProjects.length > 0 && (
                <div className="ml-4 mt-2">
                  <div className="p-3 my-2">
                    <h4 className="font-medium text-white flex items-center gap-2"><Star aria-hidden="true" /> Notable Projects:</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {exp.notableProjects.map((proj, pi) => (
                        <li key={pi}><strong>{proj.name}</strong>: {proj.description} <span className="text-gray-500">[{proj.technologies.join(', ')}]</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {exp.honorsAndAwards && exp.honorsAndAwards.length > 0 && (
                <div className="ml-4 mt-2">
                  <div className="p-3 my-2">
                    <h4 className="font-medium text-white flex items-center gap-2"><Award aria-hidden="true" /> Honors & Awards:</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {exp.honorsAndAwards.map((award, ai) => (
                        <li key={ai}><strong>{award.award}</strong> ({award.date}) - {award.issuer}: {award.description}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="bg-background-dark rounded-xl shadow-lg p-8 mt-10 border border-blue-900"
          role="region" aria-labelledby="education-header"
        >
          <h2 id="education-header" className="text-2xl font-bold text-pink-700 mb-6 flex items-center gap-2">
            <GraduationCap aria-hidden="true" className="text-indigo-400" /> Education
          </h2>
          {resumeData.education.map((edu, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Book aria-hidden="true" className="text-pink-400" /> {edu.degree}, {edu.institution}
              </h3>
              <p className="text-gray-600">{edu.field} ({edu.period})</p>
            </div>
          ))}
        </motion.section>

        {/* Activities & Volunteer */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-background-dark rounded-xl shadow-lg p-8 mt-10 border border-blue-900"
          role="region" aria-labelledby="activities-header"
        >
          <h2 id="activities-header" className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
            <HeartHandshake aria-hidden="true" className="text-pink-400" /> Activities & Volunteer
          </h2>
          {resumeData.activitiesAndVolunteer.map((act, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Users aria-hidden="true" className="text-indigo-400" /> {act.role} at {act.organization}
              </h3>
              <p className="text-gray-600">{act.period}</p>
              <p className="text-gray-700 mb-2">{act.description}</p>
              {act.notableProjects && act.notableProjects.length > 0 && (
                <div className="ml-4 mt-2">
                  <div className="p-3 my-2">
                    <h4 className="font-medium text-white flex items-center gap-2"><Star aria-hidden="true" /> Notable Projects:</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {act.notableProjects.map((proj, pi) => (
                        <li key={pi}><strong>{proj.name}</strong>: {proj.description} <span className="text-gray-500">[{proj.technologies.join(', ')}]</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.section>
      </div>
    </main>
  );
};

export default ResumePolished;

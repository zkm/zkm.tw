import React from 'react';
import { motion } from 'framer-motion';
import { useResumeData } from '../hooks/useResumeData';

const Resume: React.FC = () => {
	const { resumeData, loading, error } = useResumeData();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(31, 38, 50)' }}>
				<div className="text-center">
					<div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-300">Loading resume...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(31, 38, 50)' }}>
				<div className="text-center">
					<p className="text-red-400 mb-4">Error loading resume: {error}</p>
				</div>
			</div>
		);
	}

	if (!resumeData) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(31, 38, 50)' }}>
				<p className="text-gray-300">No resume data found.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(31, 38, 50)' }}>
			<div className="max-w-4xl w-full mx-auto p-6">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-blue-100"
				>
					<div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8">
						<h1 className="text-4xl font-bold mb-1">{resumeData.personalInfo.name}</h1>
						<p className="text-lg text-blue-100 mb-2">{resumeData.personalInfo.title}</p>
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 text-blue-200 text-sm">
							<span>{resumeData.personalInfo.email}</span>
							<span>{resumeData.personalInfo.phone}</span>
							{resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
						</div>
					</div>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Professional Summary */}
					<motion.section
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="bg-white rounded-xl shadow p-6 border border-gray-100"
					>
						<h2 className="text-xl font-bold text-blue-700 mb-2">Professional Summary</h2>
						<p className="text-gray-700 leading-relaxed text-base">{resumeData.summary}</p>
					</motion.section>

					{/* Technical Skills */}
					<motion.section
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.15 }}
						className="bg-white rounded-xl shadow p-6 border border-gray-100"
					>
						<h2 className="text-xl font-bold text-blue-700 mb-2">Technical Skills</h2>
						<ul className="list-disc list-inside text-gray-700 text-sm">
							{Object.entries(resumeData.technicalSkills.languages).map(([lang, skills]) => (
								<li key={lang}><strong>{lang}:</strong> {skills.join(', ')}</li>
							))}
							<li><strong>Frameworks:</strong> {resumeData.technicalSkills.frameworks.join(', ')}</li>
							<li><strong>CMS:</strong> {resumeData.technicalSkills.cms.join(', ')}</li>
							<li><strong>Cloud:</strong> {resumeData.technicalSkills.cloud.join(', ')}</li>
							<li><strong>Tools:</strong> {resumeData.technicalSkills.tools.join(', ')}</li>
							<li><strong>Testing:</strong> {resumeData.technicalSkills.testing.join(', ')}</li>
							<li><strong>Methodologies:</strong> {resumeData.technicalSkills.methodologies.join(', ')}</li>
						</ul>
					</motion.section>
				</div>

				{/* Work Experience */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-white rounded-xl shadow p-8 mt-10 border border-gray-100"
				>
					<h2 className="text-2xl font-bold text-blue-700 mb-6">Work Experience</h2>
					{resumeData.workExperience.map((exp, idx) => (
						<div key={idx} className="mb-8">
							<h3 className="text-lg font-semibold text-blue-800">{exp.position} <span className="text-gray-600">@ {exp.company}</span></h3>
							<p className="text-gray-500 mb-2">{exp.period}</p>
							<ul className="list-disc list-inside text-gray-700 mb-2">
								{exp.responsibilities.map((r, i) => (
									<li key={i}>{r}</li>
								))}
							</ul>
							{exp.notableProjects && exp.notableProjects.length > 0 && (
								<div className="ml-4 mt-2">
									<h4 className="font-medium text-gray-800">Notable Projects:</h4>
									<ul className="list-disc list-inside text-gray-700">
										{exp.notableProjects.map((proj, pi) => (
											<li key={pi}><strong>{proj.name}</strong>: {proj.description} <span className="text-gray-500">[{proj.technologies.join(', ')}]</span></li>
										))}
									</ul>
								</div>
							)}
							{exp.honorsAndAwards && exp.honorsAndAwards.length > 0 && (
								<div className="ml-4 mt-2">
									<h4 className="font-medium text-gray-800">Honors & Awards:</h4>
									<ul className="list-disc list-inside text-gray-700">
										{exp.honorsAndAwards.map((award, ai) => (
											<li key={ai}><strong>{award.award}</strong> ({award.date}) - {award.issuer}: {award.description}</li>
										))}
									</ul>
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
					className="bg-white rounded-xl shadow p-8 mt-10 border border-gray-100"
				>
					<h2 className="text-2xl font-bold text-blue-700 mb-6">Education</h2>
					{resumeData.education.map((edu, idx) => (
						<div key={idx} className="mb-6">
							<h3 className="text-lg font-semibold text-blue-800">{edu.degree}, {edu.institution}</h3>
							<p className="text-gray-600">{edu.field} ({edu.period})</p>
						</div>
					))}
				</motion.section>

				{/* Activities & Volunteer */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="bg-white rounded-xl shadow p-8 mt-10 border border-gray-100"
				>
					<h2 className="text-2xl font-bold text-blue-700 mb-6">Activities & Volunteer</h2>
					{resumeData.activitiesAndVolunteer.map((act, idx) => (
						<div key={idx} className="mb-6">
							<h3 className="text-lg font-semibold text-blue-800">{act.role} at {act.organization}</h3>
							<p className="text-gray-600">{act.period}</p>
							<p className="text-gray-700 mb-2">{act.description}</p>
							{act.notableProjects && act.notableProjects.length > 0 && (
								<div className="ml-4 mt-2">
									<h4 className="font-medium text-gray-800">Notable Projects:</h4>
									<ul className="list-disc list-inside text-gray-700">
										{act.notableProjects.map((proj, pi) => (
											<li key={pi}><strong>{proj.name}</strong>: {proj.description} <span className="text-gray-500">[{proj.technologies.join(', ')}]</span></li>
										))}
									</ul>
								</div>
							)}
						</div>
					))}
				</motion.section>
			</div>
		</div>
	);
};

export default Resume;

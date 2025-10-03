import { useState, useEffect } from 'react';

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    portfolio: string;
  };
  summary: string;
  technicalSkills: {
    languages: {
      [key: string]: string[];
    };
    // Explicit categories for typed access in the Resume component
    frontend?: string[];
    backend?: string[];
    infrastructure?: string[];
    security?: string[];
    frameworks: string[];
    cms: string[];
    cloud: string[];
    tools: string[];
    testing: string[];
    methodologies: string[];
  };
  workExperience: Array<{
    company: string;
    companyUrl?: string;
    position: string;
    period: string;
    responsibilities: string[];
    notableProjects?: Array<{
      name: string;
      period?: string;
      description: string;
      technologies: string[];
      impact: string;
    }>;
    honorsAndAwards?: Array<{
      award: string;
      issuer: string;
      date: string;
      description: string;
      source?: string;
    }>;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    period: string;
  }>;
  activitiesAndVolunteer: Array<{
    organization: string;
    role: string;
    period?: string;
    description: string;
    notableProjects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      impact: string;
    }>;
  }>;
  references: Array<{
    name: string;
    phone: string;
    email: string;
  }>;
}

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/data/resume.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch resume data: ${response.status}`);
        }

        const data = await response.json();
        setResumeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resume data');
        console.error('Error fetching resume data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  return { resumeData, loading, error };
}

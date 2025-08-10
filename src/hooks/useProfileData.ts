import { useState, useEffect } from 'react';

export interface ProfileData {
  profile: {
    name: string;
    title: string;
    tagline: string;
    image: string;
    location?: string;
    email?: string;
    phone?: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
    display: boolean;
    rel?: string;
  }>;
  resume: {
    enabled: boolean;
    pdfUrl?: string;
    lastUpdated?: string;
  };
  contact: {
    cta: string;
    message: string;
  };
}

export const useProfileData = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/profile.json');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const profileData = await response.json();
        setData(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

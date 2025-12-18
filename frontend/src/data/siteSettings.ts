import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  heroIntro: string;
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
    twitter?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  avatarUrl: string;
}

const defaultSiteSettings: SiteSettings = {
  siteTitle: 'minhduc.dev',
  tagline: 'Full-Stack Developer & Designer',
  heroIntro: 'I build beautiful, scalable web applications with modern technologies.',
  socialLinks: {
    github: 'https://github.com/minhduc',
    linkedin: 'https://linkedin.com/in/minhduc',
    email: 'hello@minhduc.dev',
    twitter: 'https://twitter.com/minhduc',
  },
  seo: {
    metaTitle: 'Minh Duc - Full-Stack Developer',
    metaDescription: 'Personal portfolio of Minh Duc, a full-stack developer specializing in React, TypeScript, and Node.js.',
  },
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
};

export function getSiteSettings(): SiteSettings {
  return getStorageItem(STORAGE_KEYS.SITE_SETTINGS, defaultSiteSettings);
}

export function saveSiteSettings(settings: SiteSettings): void {
  setStorageItem(STORAGE_KEYS.SITE_SETTINGS, settings);
}

export function resetSiteSettings(): SiteSettings {
  setStorageItem(STORAGE_KEYS.SITE_SETTINGS, defaultSiteSettings);
  return defaultSiteSettings;
}

export { defaultSiteSettings };

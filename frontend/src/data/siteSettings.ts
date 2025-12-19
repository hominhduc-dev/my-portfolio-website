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
  resumeUrl?: string;
}

type BackendSiteSettings = {
  siteTitle: string;
  tagline: string;
  heroIntro: string;
  socialGithub: string;
  socialLinkedin: string;
  socialEmail: string;
  socialTwitter?: string | null;
  seoMetaTitle: string;
  seoMetaDesc: string;
  resumeUrl?: string | null;
};

export const defaultSiteSettings: SiteSettings = {
  siteTitle: 'minhduc.dev',
  tagline: '',
  heroIntro: 'I build beautiful, scalable web applications with modern technologies.',
  socialLinks: {
    github: 'https://github.com/minhduc',
    linkedin: 'https://linkedin.com/in/minhduc',
    email: 'hello@minhduc.dev',
    twitter: 'https://twitter.com/minhduc',
  },
  seo: {
    metaTitle: 'Minh Duc - Back-end Developer',
    metaDescription: 'Personal portfolio of Minh Duc, a Back-end Developer specializing in React, TypeScript, and Node.js.',
  },
  resumeUrl: '',
};

import { apiFetch } from "@/lib/api";

const toFrontend = (data?: BackendSiteSettings | null): SiteSettings => {
  if (!data) return defaultSiteSettings;
  return {
    siteTitle: data.siteTitle,
    tagline: data.tagline,
    heroIntro: data.heroIntro,
    socialLinks: {
      github: data.socialGithub,
      linkedin: data.socialLinkedin,
      email: data.socialEmail,
      twitter: data.socialTwitter ?? "",
    },
    seo: {
      metaTitle: data.seoMetaTitle,
      metaDescription: data.seoMetaDesc,
    },
    resumeUrl: data.resumeUrl || "",
  };
};

const toBackend = (settings: SiteSettings): BackendSiteSettings => ({
  siteTitle: settings.siteTitle,
  tagline: settings.tagline,
  heroIntro: settings.heroIntro,
  socialGithub: settings.socialLinks.github,
  socialLinkedin: settings.socialLinks.linkedin,
  socialEmail: settings.socialLinks.email,
  socialTwitter: settings.socialLinks.twitter || null,
  seoMetaTitle: settings.seo.metaTitle,
  seoMetaDesc: settings.seo.metaDescription,
  resumeUrl: settings.resumeUrl || null,
});

export async function fetchSiteSettings(isPublic = false): Promise<SiteSettings> {
  const path = isPublic ? "/public/settings" : "/api/settings";
  try {
    const res = await apiFetch<BackendSiteSettings>(path);
    return toFrontend(res.data) ?? defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

export async function updateSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  const res = await apiFetch<BackendSiteSettings>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(toBackend(settings)),
  });
  return toFrontend(res.data) ?? settings;
}

export async function updateResumeUrl(resumeUrl: string | null): Promise<SiteSettings> {
  const res = await apiFetch<BackendSiteSettings>("/api/settings/resume", {
    method: "PUT",
    body: JSON.stringify({ resumeUrl }),
  });
  return toFrontend(res.data) ?? defaultSiteSettings;
}

export async function uploadAvatar(file: File, oldUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const query = oldUrl ? `?oldUrl=${encodeURIComponent(oldUrl)}` : "";
  const res = await apiFetch<{ url: string }>(`/upload/avatar${query}`, {
    method: "POST",
    body: formData,
  });
  return res.data?.url ?? "";
}

export async function uploadResume(file: File, oldUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const query = oldUrl ? `?oldUrl=${encodeURIComponent(oldUrl)}` : "";
  const res = await apiFetch<{ url: string }>(`/upload/resume${query}`, {
    method: "POST",
    body: formData,
  });
  return res.data?.url ?? "";
}

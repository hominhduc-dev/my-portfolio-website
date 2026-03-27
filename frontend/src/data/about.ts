export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface AboutData {
  avatarUrl?: string | null;
  location?: string | null;
  shortBio: string;
  longStory: string;
  education: TimelineItem[];
  experience: TimelineItem[];
}

export const defaultAboutData: AboutData = {
  avatarUrl: "",
  location: "",
  shortBio: 'Backend Developer & Automation',
  longStory: ``,
  education: [
    {
      id: 'education-placeholder-1',
      title: '',
      organization: '',
      period: '',
      description: '',
    },
    {
      id: 'education-placeholder-2',
      title: 'B',
      organization: '',
      period: '',
      description: '',
    },
  ],
  experience: [
    {
      id: 'experience-placeholder-1',
      title: '',
      organization: '',
      period: '',
      description: '',
    },
    {
      id: 'experience-placeholder-2',
      title: '',
      organization: '',
      period: '',
      description: '',
    },
    {
      id: 'experience-placeholder-3',
      title: '',
      organization: '',
      period: '',
      description: '',
    },
  ],
};

import { apiFetch } from "@/lib/api";

export async function fetchAboutData(isPublic = false): Promise<AboutData> {
  const path = isPublic ? "/public/about" : "/api/about";
  try {
    const res = await apiFetch<AboutData>(path);
    return { ...defaultAboutData, ...(res.data ?? {}) };
  } catch {
    return defaultAboutData;
  }
}

export async function saveAboutData(data: AboutData): Promise<AboutData> {
  const res = await apiFetch<AboutData>("/api/about", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return { ...defaultAboutData, ...(res.data ?? data) };
}

export async function uploadAboutAvatar(file: File, oldUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const query = oldUrl ? `?oldUrl=${encodeURIComponent(oldUrl)}` : "";
  const res = await apiFetch<{ url: string }>(`/upload/avatar${query}`, {
    method: "POST",
    body: formData,
  });
  return res.data?.url ?? "";
}

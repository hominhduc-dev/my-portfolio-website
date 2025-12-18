import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';

export interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface SkillGroup {
  id: string;
  name: string;
  skills: Skill[];
}

export interface SkillsData {
  groups: SkillGroup[];
}

const defaultSkillsData: SkillsData = {
  groups: [
    {
      id: 'languages',
      name: 'Languages',
      skills: [
        { id: 'ts', name: 'TypeScript', level: 'expert' },
        { id: 'js', name: 'JavaScript', level: 'expert' },
        { id: 'py', name: 'Python', level: 'advanced' },
        { id: 'go', name: 'Go', level: 'intermediate' },
        { id: 'rust', name: 'Rust', level: 'beginner' },
      ],
    },
    {
      id: 'frameworks',
      name: 'Frameworks',
      skills: [
        { id: 'react', name: 'React', level: 'expert' },
        { id: 'nextjs', name: 'Next.js', level: 'advanced' },
        { id: 'node', name: 'Node.js', level: 'expert' },
        { id: 'express', name: 'Express', level: 'advanced' },
        { id: 'tailwind', name: 'Tailwind CSS', level: 'expert' },
      ],
    },
    {
      id: 'tools',
      name: 'Tools',
      skills: [
        { id: 'git', name: 'Git', level: 'expert' },
        { id: 'vscode', name: 'VS Code', level: 'expert' },
        { id: 'figma', name: 'Figma', level: 'advanced' },
        { id: 'docker', name: 'Docker', level: 'advanced' },
      ],
    },
    {
      id: 'databases',
      name: 'Databases',
      skills: [
        { id: 'postgres', name: 'PostgreSQL', level: 'advanced' },
        { id: 'mongodb', name: 'MongoDB', level: 'intermediate' },
        { id: 'redis', name: 'Redis', level: 'intermediate' },
        { id: 'supabase', name: 'Supabase', level: 'advanced' },
      ],
    },
    {
      id: 'devops',
      name: 'DevOps',
      skills: [
        { id: 'aws', name: 'AWS', level: 'advanced' },
        { id: 'vercel', name: 'Vercel', level: 'expert' },
        { id: 'k8s', name: 'Kubernetes', level: 'intermediate' },
        { id: 'gh-actions', name: 'GitHub Actions', level: 'advanced' },
      ],
    },
  ],
};

export function getSkillsData(): SkillsData {
  return getStorageItem(STORAGE_KEYS.SKILLS, defaultSkillsData);
}

export function saveSkillsData(data: SkillsData): void {
  setStorageItem(STORAGE_KEYS.SKILLS, data);
}

export function resetSkillsData(): SkillsData {
  setStorageItem(STORAGE_KEYS.SKILLS, defaultSkillsData);
  return defaultSkillsData;
}

export { defaultSkillsData };

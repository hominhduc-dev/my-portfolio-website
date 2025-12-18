import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';

export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  thumbnailUrl: string;
  links: {
    github?: string;
    demo?: string;
  };
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

const defaultProjects: AdminProject[] = [
  {
    id: 'devflow',
    title: 'DevFlow',
    slug: 'devflow',
    shortDescription: 'A visual workflow builder for developers to automate CI/CD pipelines.',
    fullDescription: `DevFlow reimagines how teams build and manage deployment pipelines. With an intuitive visual interface, developers can create complex workflows without writing YAML.

## Features
- Drag-and-drop workflow builder
- Real-time collaboration
- Integrated testing
- Seamless GitHub integration`,
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=400&fit=crop',
    links: {
      github: 'https://github.com/example/devflow',
      demo: 'https://devflow.example.com',
    },
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-12-10',
  },
  {
    id: 'synthwave-ui',
    title: 'Synthwave UI',
    slug: 'synthwave-ui',
    shortDescription: 'A retro-futuristic component library inspired by 80s aesthetics.',
    fullDescription: `Synthwave UI brings the neon-soaked aesthetic of the 1980s to modern web applications.

## Components
- Buttons with glow effects
- Neon-styled cards
- Gradient backgrounds
- Animated transitions`,
    tags: ['React', 'Tailwind CSS', 'Storybook', 'Design System'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
    links: {
      github: 'https://github.com/example/synthwave-ui',
      demo: 'https://synthwave-ui.example.com',
    },
    status: 'published',
    createdAt: '2024-02-20',
    updatedAt: '2024-11-05',
  },
  {
    id: 'markdown-studio',
    title: 'Markdown Studio',
    slug: 'markdown-studio',
    shortDescription: 'A distraction-free writing environment with live preview.',
    fullDescription: `Markdown Studio is built for writers who think in Markdown.

## Features
- Clean, minimal interface
- Live preview
- Custom themes
- Export to PDF/HTML
- Cloud sync`,
    tags: ['Electron', 'React', 'TypeScript', 'MDX'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
    links: {
      github: 'https://github.com/example/markdown-studio',
    },
    status: 'draft',
    createdAt: '2023-08-10',
    updatedAt: '2024-10-20',
  },
];

export function getProjects(): AdminProject[] {
  return getStorageItem(STORAGE_KEYS.PROJECTS, defaultProjects);
}

export function getProjectById(id: string): AdminProject | undefined {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
}

export function saveProject(project: AdminProject): void {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = { ...project, updatedAt: new Date().toISOString().split('T')[0] };
  } else {
    projects.push({ ...project, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] });
  }
  setStorageItem(STORAGE_KEYS.PROJECTS, projects);
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  setStorageItem(STORAGE_KEYS.PROJECTS, projects);
}

export function resetProjects(): AdminProject[] {
  setStorageItem(STORAGE_KEYS.PROJECTS, defaultProjects);
  return defaultProjects;
}

export { defaultProjects };

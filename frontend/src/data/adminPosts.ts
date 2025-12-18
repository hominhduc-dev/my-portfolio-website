import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';

export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'writing' | 'tech';
  coverImageUrl: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

const defaultPosts: AdminPost[] = [
  {
    id: 'post-1',
    title: 'Building Scalable React Applications',
    slug: 'building-scalable-react-applications',
    excerpt: 'A deep dive into patterns and practices for creating maintainable React codebases.',
    content: `## Introduction

Building scalable React applications requires careful consideration of architecture, state management, and code organization.

## Component Architecture

The key to scalable React is thinking in terms of composable, reusable components.

### Atomic Design Principles

- **Atoms**: Basic building blocks (buttons, inputs, labels)
- **Molecules**: Simple groups of atoms (search bars, card headers)
- **Organisms**: Complex UI sections (navigation, forms)

## State Management

For state management, I recommend starting simple and scaling up:

1. **Local state** for component-specific data
2. **Context** for theme, auth, and app-wide settings
3. **Server state** (React Query/SWR) for API data
4. **Global state** (Zustand/Redux) only when necessary`,
    category: 'tech',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    status: 'published',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-10',
  },
  {
    id: 'post-2',
    title: 'The Art of Writing Clean Code',
    slug: 'the-art-of-writing-clean-code',
    excerpt: 'Why clean code matters and how to cultivate the discipline to write it consistently.',
    content: `## What is Clean Code?

Clean code is code that is easy to understand and easy to change.

## The Four Pillars

### 1. Readability
Code is read far more often than it's written.

### 2. Simplicity
The best code is the code you didn't write.

### 3. Consistency
Pick patterns and stick to them.

### 4. Testability
If your code is hard to test, it's probably doing too much.`,
    category: 'tech',
    coverImageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop',
    status: 'published',
    createdAt: '2024-11-28',
    updatedAt: '2024-11-28',
  },
  {
    id: 'post-3',
    title: 'On Creativity and Constraints',
    slug: 'on-creativity-and-constraints',
    excerpt: 'Why limitations often lead to more creative solutions than unlimited freedom.',
    content: `## The Paradox of Choice

When faced with infinite possibilities, we often freeze.

## Constraints in Software

### Time Constraints
Deadlines force prioritization.

### Technical Constraints
Working within limitations breeds innovation.

### Resource Constraints
Small teams must be creative.`,
    category: 'writing',
    coverImageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=400&fit=crop',
    status: 'draft',
    createdAt: '2024-10-15',
    updatedAt: '2024-10-15',
  },
];

export function getPosts(): AdminPost[] {
  return getStorageItem(STORAGE_KEYS.POSTS, defaultPosts);
}

export function getPostById(id: string): AdminPost | undefined {
  const posts = getPosts();
  return posts.find((p) => p.id === id);
}

export function savePost(post: AdminPost): void {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index >= 0) {
    posts[index] = { ...post, updatedAt: new Date().toISOString().split('T')[0] };
  } else {
    posts.push({ ...post, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] });
  }
  setStorageItem(STORAGE_KEYS.POSTS, posts);
}

export function deletePost(id: string): void {
  const posts = getPosts().filter((p) => p.id !== id);
  setStorageItem(STORAGE_KEYS.POSTS, posts);
}

export function resetPosts(): AdminPost[] {
  setStorageItem(STORAGE_KEYS.POSTS, defaultPosts);
  return defaultPosts;
}

export { defaultPosts };

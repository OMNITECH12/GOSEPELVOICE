export enum MediaType {
  MUSIC = 'Music',
  VIDEO = 'Video',
  EBOOK = 'eBook',
  SERMON = 'Sermon',
  PODCAST = 'Podcast'
}

export interface MediaItem {
  id: string;
  title: string;
  author: string;
  type: MediaType;
  thumbnailUrl: string;
  duration?: string; // For audio/video
  description: string;
  downloadUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; // The correct answer string
}

export interface Devotional {
  title: string;
  scripture: string;
  content: string;
  prayer: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Editor';
  password?: string; // In a real app, this would be a hash, for mock we simplify
}
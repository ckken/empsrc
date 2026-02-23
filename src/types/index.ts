export interface Project {
  name: string;
  repo: string;
  category: string;
  commit: string;
  branch: string;
  description?: string;
  added: string;
  updated?: string;
}

export interface SourcesData {
  projects: Project[];
}

export interface AddOptions {
  category: string;
  branch?: string;
}

export interface ListOptions {
  category?: string;
}

export interface UpdateOptions {
  name?: string;
}

export interface RemoveOptions {
  name: string;
}

export interface SearchOptions {
  keyword: string;
  category?: string;
}

export interface StatsOptions {
  category?: string;
}

export interface InitOptions {
  force?: boolean;
}

export type Category = 'frontend' | 'backend' | 'ai' | 'tools';

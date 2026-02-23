import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Project, SourcesData } from '../types';

const REFS_DIR = 'refs';
const SOURCES_FILE = join(REFS_DIR, 'sources.json');
const AGENTS_FILE = 'AGENTS.md';
const GITIGNORE_FILE = '.gitignore';

export class Config {
  constructor() {
    this.ensureRefsDir();
  }

  ensureRefsDir(): void {
    if (!existsSync(REFS_DIR)) {
      mkdirSync(REFS_DIR, { recursive: true });
    }
  }

  loadSources(): SourcesData {
    if (!existsSync(SOURCES_FILE)) {
      return { projects: [] };
    }
    const content = readFileSync(SOURCES_FILE, 'utf-8');
    return JSON.parse(content);
  }

  saveSources(data: SourcesData): void {
    writeFileSync(SOURCES_FILE, JSON.stringify(data, null, 2));
  }

  addProject(project: Project): void {
    const sources = this.loadSources();
    const existing = sources.projects.findIndex(p => p.name === project.name);
    
    if (existing >= 0) {
      sources.projects[existing] = project;
    } else {
      sources.projects.push(project);
    }
    
    this.saveSources(sources);
  }

  removeProject(name: string): void {
    const sources = this.loadSources();
    sources.projects = sources.projects.filter(p => p.name !== name);
    this.saveSources(sources);
  }

  getProject(name: string): Project | undefined {
    const sources = this.loadSources();
    return sources.projects.find(p => p.name === name);
  }

  updateGitignore(): void {
    let content = '';
    if (existsSync(GITIGNORE_FILE)) {
      content = readFileSync(GITIGNORE_FILE, 'utf-8');
    }

    if (!content.includes('refs/')) {
      content += '\n# empsrc reference projects\nrefs/\n';
      writeFileSync(GITIGNORE_FILE, content);
    }
  }

  updateAgentsFile(): void {
    if (!existsSync(AGENTS_FILE)) {
      return;
    }

    let content = readFileSync(AGENTS_FILE, 'utf-8');
    const sources = this.loadSources();

    const marker = '## Reference Projects (refs/)';
    const endMarker = '##';
    
    let section = `${marker}\n\n`;
    section += 'AI Agent can reference these projects for implementation details:\n\n';

    const byCategory: Record<string, Project[]> = {};
    sources.projects.forEach(p => {
      if (!byCategory[p.category]) byCategory[p.category] = [];
      byCategory[p.category].push(p);
    });

    Object.keys(byCategory).sort().forEach(cat => {
      section += `### ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n\n`;
      byCategory[cat].forEach(p => {
        section += `- **${p.name}** (\`refs/${p.category}/${p.name}/\`) - ${p.repo}\n`;
        if (p.description) {
          section += `  ${p.description}\n`;
        }
      });
      section += '\n';
    });

    const markerIndex = content.indexOf(marker);
    if (markerIndex >= 0) {
      const nextSection = content.indexOf(endMarker, markerIndex + marker.length);
      if (nextSection >= 0) {
        content = content.substring(0, markerIndex) + section + content.substring(nextSection);
      } else {
        content = content.substring(0, markerIndex) + section;
      }
    } else {
      content += '\n' + section;
    }

    writeFileSync(AGENTS_FILE, content);
  }
}

export const config = new Config();

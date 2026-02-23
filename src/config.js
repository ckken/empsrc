const fs = require('fs');
const path = require('path');

const REFS_DIR = 'refs';
const SOURCES_FILE = path.join(REFS_DIR, 'sources.json');
const AGENTS_FILE = 'AGENTS.md';
const GITIGNORE_FILE = '.gitignore';

class Config {
  constructor() {
    this.ensureRefsDir();
  }

  ensureRefsDir() {
    if (!fs.existsSync(REFS_DIR)) {
      fs.mkdirSync(REFS_DIR, { recursive: true });
    }
  }

  loadSources() {
    if (!fs.existsSync(SOURCES_FILE)) {
      return { projects: [] };
    }
    return JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf-8'));
  }

  saveSources(data) {
    fs.writeFileSync(SOURCES_FILE, JSON.stringify(data, null, 2));
  }

  addProject(project) {
    const sources = this.loadSources();
    const existing = sources.projects.findIndex(p => p.name === project.name);
    
    if (existing >= 0) {
      sources.projects[existing] = project;
    } else {
      sources.projects.push(project);
    }
    
    this.saveSources(sources);
  }

  removeProject(name) {
    const sources = this.loadSources();
    sources.projects = sources.projects.filter(p => p.name !== name);
    this.saveSources(sources);
  }

  getProject(name) {
    const sources = this.loadSources();
    return sources.projects.find(p => p.name === name);
  }

  updateGitignore() {
    let content = '';
    if (fs.existsSync(GITIGNORE_FILE)) {
      content = fs.readFileSync(GITIGNORE_FILE, 'utf-8');
    }

    if (!content.includes('refs/')) {
      content += '\n# empsrc reference projects\nrefs/\n';
      fs.writeFileSync(GITIGNORE_FILE, content);
    }
  }

  updateAgentsFile() {
    if (!fs.existsSync(AGENTS_FILE)) {
      return;
    }

    let content = fs.readFileSync(AGENTS_FILE, 'utf-8');
    const sources = this.loadSources();

    const marker = '## Reference Projects (refs/)';
    const endMarker = '##';
    
    let section = `${marker}\n\n`;
    section += 'AI Agent can reference these projects for implementation details:\n\n';

    const byCategory = {};
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

    // Replace or append section
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

    fs.writeFileSync(AGENTS_FILE, content);
  }
}

module.exports = new Config();

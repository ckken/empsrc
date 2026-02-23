import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Config } from '../src/utils/config';

const TEST_DIR = join(process.cwd(), 'test-workspace');
const REFS_DIR = join(TEST_DIR, 'refs');

describe('Config', () => {
  let config: Config;

  beforeEach(() => {
    // Create test workspace
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
    process.chdir(TEST_DIR);
    
    config = new Config();
  });

  afterEach(() => {
    process.chdir('..');
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  test('should create refs directory', () => {
    expect(existsSync(REFS_DIR)).toBe(true);
  });

  test('should load empty sources', () => {
    const sources = config.loadSources();
    expect(sources.projects).toEqual([]);
  });

  test('should add project', () => {
    const project = {
      name: 'test-project',
      repo: 'owner/test-project',
      category: 'tools',
      commit: 'abc123',
      branch: 'main',
      added: '2026-02-23'
    };

    config.addProject(project);
    const sources = config.loadSources();
    
    expect(sources.projects).toHaveLength(1);
    expect(sources.projects[0]).toEqual(project);
  });

  test('should update existing project', () => {
    const project = {
      name: 'test-project',
      repo: 'owner/test-project',
      category: 'tools',
      commit: 'abc123',
      branch: 'main',
      added: '2026-02-23'
    };

    config.addProject(project);
    
    const updated = { ...project, commit: 'def456' };
    config.addProject(updated);
    
    const sources = config.loadSources();
    expect(sources.projects).toHaveLength(1);
    expect(sources.projects[0].commit).toBe('def456');
  });

  test('should remove project', () => {
    const project = {
      name: 'test-project',
      repo: 'owner/test-project',
      category: 'tools',
      commit: 'abc123',
      branch: 'main',
      added: '2026-02-23'
    };

    config.addProject(project);
    config.removeProject('test-project');
    
    const sources = config.loadSources();
    expect(sources.projects).toHaveLength(0);
  });

  test('should get project by name', () => {
    const project = {
      name: 'test-project',
      repo: 'owner/test-project',
      category: 'tools',
      commit: 'abc123',
      branch: 'main',
      added: '2026-02-23'
    };

    config.addProject(project);
    const found = config.getProject('test-project');
    
    expect(found).toEqual(project);
  });

  test('should update gitignore', () => {
    config.updateGitignore();
    
    const gitignorePath = join(TEST_DIR, '.gitignore');
    expect(existsSync(gitignorePath)).toBe(true);
    
    const content = Bun.file(gitignorePath).text();
    expect(content).resolves.toContain('refs/');
  });

  test('should update AGENTS.md', () => {
    // Create AGENTS.md
    writeFileSync(join(TEST_DIR, 'AGENTS.md'), '# Test\n');
    
    const project = {
      name: 'test-project',
      repo: 'owner/test-project',
      category: 'tools',
      commit: 'abc123',
      branch: 'main',
      description: 'Test project',
      added: '2026-02-23'
    };

    config.addProject(project);
    config.updateAgentsFile();
    
    const agentsPath = join(TEST_DIR, 'AGENTS.md');
    const content = Bun.file(agentsPath).text();
    
    expect(content).resolves.toContain('Reference Projects');
    expect(content).resolves.toContain('test-project');
  });
});

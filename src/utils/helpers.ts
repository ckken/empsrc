import { $ } from 'bun';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import type { Project } from '../types';

export async function cloneRepo(
  repoUrl: string,
  targetDir: string,
  branch?: string
): Promise<void> {
  await $`git clone --depth 1 ${branch ? `-b ${branch}` : ''} ${repoUrl} ${targetDir}`.quiet();
}

export async function getCommitHash(dir: string): Promise<string> {
  const result = await $`git -C ${dir} log -1 --format=%h`.text();
  return result.trim();
}

export async function fetchAndPull(dir: string): Promise<{ current: string; latest: string }> {
  const current = await getCommitHash(dir);
  await $`git -C ${dir} fetch`.quiet();
  await $`git -C ${dir} pull`.quiet();
  const latest = await getCommitHash(dir);
  return { current, latest };
}

export function readPackageJson(dir: string): { description?: string } | null {
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) return null;
  
  try {
    const content = readFileSync(pkgPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function parseRepo(repo: string): { owner: string; name: string } | null {
  const cleaned = repo.replace('github:', '').trim();
  const parts = cleaned.split('/');
  
  if (parts.length !== 2) return null;
  
  return {
    owner: parts[0],
    name: parts[1]
  };
}

export function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function removeDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function formatDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function groupByCategory(projects: Project[]): Record<string, Project[]> {
  const grouped: Record<string, Project[]> = {};
  projects.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });
  return grouped;
}

export { chalk, ora };

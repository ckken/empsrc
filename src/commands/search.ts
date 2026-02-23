import { $ } from 'bun';
import { join } from 'path';
import chalk from 'chalk';
import { config } from '../utils/config';
import type { SearchOptions } from '../types';

export async function search(options: SearchOptions): Promise<void> {
  const sources = config.loadSources();
  let projects = sources.projects;

  if (options.category) {
    projects = projects.filter(p => p.category === options.category);
  }

  if (projects.length === 0) {
    console.log(chalk.yellow('No projects to search'));
    return;
  }

  console.log(chalk.blue(`\n🔍 Searching for "${options.keyword}"...\n`));

  let found = 0;

  for (const project of projects) {
    const targetDir = join('refs', project.category, project.name);
    
    try {
      // Use ripgrep if available, fallback to grep
      const result = await $`rg -i -n "${options.keyword}" ${targetDir} 2>/dev/null || grep -rni "${options.keyword}" ${targetDir} 2>/dev/null || true`.text();
      
      if (result.trim()) {
        found++;
        console.log(chalk.green(`\n📦 ${project.name} (${project.repo})`));
        console.log(chalk.gray('─'.repeat(50)));
        
        const lines = result.trim().split('\n').slice(0, 5); // Show first 5 matches
        lines.forEach(line => {
          console.log(chalk.gray(`  ${line}`));
        });
        
        if (result.split('\n').length > 5) {
          console.log(chalk.gray(`  ... and ${result.split('\n').length - 5} more matches`));
        }
      }
    } catch {
      // Skip projects with search errors
    }
  }

  if (found === 0) {
    console.log(chalk.yellow(`No matches found for "${options.keyword}"`));
  } else {
    console.log(chalk.blue(`\n✓ Found matches in ${found} project(s)\n`));
  }
}

import chalk from 'chalk';
import { config } from '../utils/config';
import { groupByCategory } from '../utils/helpers';
import type { ListOptions } from '../types';

export function list(options: ListOptions): void {
  const sources = config.loadSources();
  let projects = sources.projects;

  if (options.category) {
    projects = projects.filter(p => p.category === options.category);
  }

  if (projects.length === 0) {
    console.log(chalk.yellow('No projects found'));
    return;
  }

  console.log(chalk.blue(`\n📚 Reference Projects (${projects.length})\n`));

  const byCategory = groupByCategory(projects);

  Object.keys(byCategory).sort().forEach(cat => {
    console.log(chalk.bold(`\n${cat.toUpperCase()}`));
    console.log(chalk.gray('─'.repeat(50)));
    
    byCategory[cat].forEach(p => {
      console.log(chalk.green(`\n  ${p.name}`));
      console.log(chalk.gray(`  └─ Repo: ${p.repo}`));
      console.log(chalk.gray(`  └─ Path: refs/${p.category}/${p.name}/`));
      console.log(chalk.gray(`  └─ Commit: ${p.commit}`));
      if (p.description) {
        console.log(chalk.gray(`  └─ ${p.description}`));
      }
      console.log(chalk.gray(`  └─ Added: ${p.added}`));
    });
  });

  console.log('');
}

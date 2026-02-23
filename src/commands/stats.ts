import chalk from 'chalk';
import { config } from '../utils/config';
import { groupByCategory } from '../utils/helpers';
import type { StatsOptions } from '../types';

export function stats(options: StatsOptions): void {
  const sources = config.loadSources();
  let projects = sources.projects;

  if (options.category) {
    projects = projects.filter(p => p.category === options.category);
  }

  if (projects.length === 0) {
    console.log(chalk.yellow('No projects found'));
    return;
  }

  console.log(chalk.blue(`\n📊 Statistics\n`));

  const byCategory = groupByCategory(projects);
  const categories = Object.keys(byCategory).sort();

  console.log(chalk.bold('By Category:'));
  console.log(chalk.gray('─'.repeat(50)));
  categories.forEach(cat => {
    const count = byCategory[cat].length;
    const bar = '█'.repeat(Math.min(count, 20));
    console.log(chalk.green(`  ${cat.padEnd(15)} ${bar} ${count}`));
  });

  console.log(chalk.bold('\nTotal Projects:'), chalk.green(projects.length));

  // Recent additions
  const recent = [...projects]
    .sort((a, b) => b.added.localeCompare(a.added))
    .slice(0, 5);

  console.log(chalk.bold('\nRecent Additions:'));
  console.log(chalk.gray('─'.repeat(50)));
  recent.forEach(p => {
    console.log(chalk.gray(`  ${p.added} - ${p.name} (${p.category})`));
  });

  // Recently updated
  const updated = [...projects]
    .filter(p => p.updated)
    .sort((a, b) => (b.updated || '').localeCompare(a.updated || ''))
    .slice(0, 5);

  if (updated.length > 0) {
    console.log(chalk.bold('\nRecently Updated:'));
    console.log(chalk.gray('─'.repeat(50)));
    updated.forEach(p => {
      console.log(chalk.gray(`  ${p.updated} - ${p.name} (${p.category})`));
    });
  }

  console.log('');
}

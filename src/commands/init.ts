import { existsSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import type { InitOptions } from '../types';

const AGENTS_TEMPLATE = `## Reference Projects (refs/)

AI Agent can reference these projects for implementation details:

(Run \`empsrc add <repo>\` to add projects)
`;

export function init(options: InitOptions): void {
  const spinner = ora('Initializing empsrc...').start();

  try {
    // Create refs directory
    if (!existsSync('refs')) {
      Bun.write('refs/.gitkeep', '');
    }

    // Create .gitignore
    if (!existsSync('.gitignore') || options.force) {
      writeFileSync('.gitignore', '# empsrc reference projects\nrefs/\n');
      spinner.info('Created .gitignore');
    }

    // Create AGENTS.md if not exists
    if (!existsSync('AGENTS.md') || options.force) {
      writeFileSync('AGENTS.md', AGENTS_TEMPLATE);
      spinner.info('Created AGENTS.md');
    }

    // Create sources.json
    if (!existsSync('refs/sources.json') || options.force) {
      writeFileSync('refs/sources.json', JSON.stringify({ projects: [] }, null, 2));
      spinner.info('Created refs/sources.json');
    }

    spinner.succeed(chalk.green('✓ Initialized empsrc'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('  empsrc add vercel/next.js --category frontend'));
    console.log(chalk.gray('  empsrc list'));

  } catch (error) {
    spinner.fail(chalk.red(`Failed to initialize: ${error}`));
    process.exit(1);
  }
}

#!/usr/bin/env bun

import { Command } from 'commander';
import { add } from './commands/add';
import { list } from './commands/list';
import { update } from './commands/update';
import { remove } from './commands/remove';
import { init } from './commands/init';
import { search } from './commands/search';
import { stats } from './commands/stats';

const program = new Command();

program
  .name('empsrc')
  .description('GitHub reference project manager for AI coding agents')
  .version('0.3.0');

program
  .command('init')
  .description('Initialize empsrc in current directory')
  .option('-f, --force', 'Overwrite existing files')
  .action((options) => init(options));

program
  .command('add <repo>')
  .description('Add a GitHub repository as reference (e.g., vercel/next.js)')
  .option('-c, --category <category>', 'Category (frontend/backend/ai/tools)', 'tools')
  .option('-b, --branch <branch>', 'Branch or tag to checkout')
  .action((repo, options) => add(repo, options));

program
  .command('list')
  .description('List all reference projects')
  .option('-c, --category <category>', 'Filter by category')
  .action((options) => list(options));

program
  .command('update [name]')
  .description('Update all projects or a specific one')
  .action((name) => update({ name }));

program
  .command('remove <name>')
  .description('Remove a reference project')
  .action((name) => remove({ name }));

program
  .command('search <keyword>')
  .description('Search for keyword in reference projects')
  .option('-c, --category <category>', 'Filter by category')
  .action((keyword, options) => search({ keyword, ...options }));

program
  .command('stats')
  .description('Show statistics about reference projects')
  .option('-c, --category <category>', 'Filter by category')
  .action((options) => stats(options));

program.parse();

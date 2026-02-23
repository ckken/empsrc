#!/usr/bin/env node

const { program } = require('commander');
const { add } = require('../src/commands/add');
const { update } = require('../src/commands/update');
const { remove } = require('../src/commands/remove');
const { list } = require('../src/commands/list');

program
  .name('empsrc')
  .description('GitHub reference project manager for AI coding agents')
  .version('0.1.0');

program
  .command('add <repo>')
  .description('Add a GitHub repository as reference (e.g., vercel/next.js)')
  .option('-c, --category <category>', 'Category (frontend/backend/ai/tools)', 'tools')
  .option('-b, --branch <branch>', 'Branch or tag to checkout')
  .action(add);

program
  .command('update [name]')
  .description('Update all projects or a specific one')
  .action(update);

program
  .command('remove <name>')
  .description('Remove a reference project')
  .action(remove);

program
  .command('list')
  .description('List all reference projects')
  .option('-c, --category <category>', 'Filter by category')
  .action(list);

program.parse();

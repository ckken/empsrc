import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { config } from '../utils/config';
import { fetchAndPull, formatDate } from '../utils/helpers';
import type { UpdateOptions } from '../types';

export async function update(options: UpdateOptions): Promise<void> {
  const sources = config.loadSources();
  const projects = options.name 
    ? sources.projects.filter(p => p.name === options.name)
    : sources.projects;

  if (projects.length === 0) {
    console.log(chalk.yellow(options.name ? `Project ${options.name} not found` : 'No projects to update'));
    return;
  }

  console.log(chalk.blue(`Updating ${projects.length} project(s)...\n`));

  for (const project of projects) {
    const spinner = ora(`Updating ${project.name}...`).start();
    const targetDir = join('refs', project.category, project.name);

    try {
      const { current, latest } = await fetchAndPull(targetDir);

      if (current === latest) {
        spinner.info(chalk.gray(`${project.name} is up to date (${current})`));
      } else {
        project.commit = latest;
        project.updated = formatDate();
        config.addProject(project);
        
        spinner.succeed(chalk.green(`✓ ${project.name} updated: ${current} → ${latest}`));
      }

    } catch (error) {
      spinner.fail(chalk.red(`Failed to update ${project.name}: ${error}`));
    }
  }

  config.updateAgentsFile();
}

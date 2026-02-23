import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { config } from '../utils/config';
import { removeDir } from '../utils/helpers';
import type { RemoveOptions } from '../types';

export async function remove(options: RemoveOptions): Promise<void> {
  const project = config.getProject(options.name);
  
  if (!project) {
    console.log(chalk.yellow(`Project ${options.name} not found`));
    return;
  }

  const targetDir = join('refs', project.category, project.name);

  // Simple confirmation via prompt
  console.log(chalk.yellow(`\nRemove ${options.name} from refs/${project.category}/?`));
  console.log(chalk.gray('Press Ctrl+C to cancel, or Enter to continue...'));
  
  // Wait for user input
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  const spinner = ora(`Removing ${options.name}...`).start();

  try {
    removeDir(targetDir);
    config.removeProject(options.name);
    config.updateAgentsFile();

    spinner.succeed(chalk.green(`✓ Removed ${options.name}`));

  } catch (error) {
    spinner.fail(chalk.red(`Failed to remove ${options.name}: ${error}`));
    process.exit(1);
  }
}

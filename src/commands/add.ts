import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { config } from '../utils/config';
import { cloneRepo, getCommitHash, parseRepo, ensureDir, readPackageJson, formatDate } from '../utils/helpers';
import type { AddOptions } from '../types';

export async function add(repo: string, options: AddOptions): Promise<void> {
  const spinner = ora('Adding reference project...').start();

  try {
    const parsed = parseRepo(repo);
    if (!parsed) {
      spinner.fail('Invalid repo format. Use: owner/repo or github:owner/repo');
      process.exit(1);
    }

    const { owner, name } = parsed;
    const projectName = name;
    const category = options.category || 'tools';
    const targetDir = join('refs', category, projectName);

    if (await Bun.file(targetDir).exists()) {
      spinner.warn(`Project ${projectName} already exists in ${category}`);
      return;
    }

    ensureDir(join('refs', category));

    spinner.text = `Cloning ${owner}/${name}...`;
    const repoUrl = `https://github.com/${owner}/${name}.git`;
    
    await cloneRepo(repoUrl, targetDir, options.branch);

    const commit = await getCommitHash(targetDir);

    const pkg = readPackageJson(targetDir);
    const description = pkg?.description || '';

    const project = {
      name: projectName,
      repo: `${owner}/${name}`,
      category,
      commit,
      branch: options.branch || 'main',
      description,
      added: formatDate()
    };

    config.addProject(project);
    config.updateGitignore();
    config.updateAgentsFile();

    spinner.succeed(chalk.green(`✓ Added ${projectName} to refs/${category}/`));
    console.log(chalk.gray(`  Repo: ${owner}/${name}`));
    console.log(chalk.gray(`  Commit: ${commit}`));
    if (description) {
      console.log(chalk.gray(`  Description: ${description}`));
    }

  } catch (error) {
    spinner.fail(chalk.red(`Failed to add project: ${error}`));
    process.exit(1);
  }
}

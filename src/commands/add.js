const chalk = require('chalk');
const ora = require('ora');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const config = require('../config');

async function add(repo, options) {
  const spinner = ora('Adding reference project...').start();

  try {
    // Parse repo (support github:owner/repo or owner/repo)
    const repoName = repo.replace('github:', '').trim();
    const [owner, name] = repoName.split('/');
    
    if (!owner || !name) {
      spinner.fail('Invalid repo format. Use: owner/repo or github:owner/repo');
      return;
    }

    const projectName = name;
    const category = options.category || 'tools';
    const targetDir = path.join('refs', category, projectName);

    // Check if already exists
    if (fs.existsSync(targetDir)) {
      spinner.warn(`Project ${projectName} already exists in ${category}`);
      return;
    }

    // Ensure category dir exists
    fs.mkdirSync(path.join('refs', category), { recursive: true });

    // Clone repo
    spinner.text = `Cloning ${repoName}...`;
    const git = simpleGit();
    const repoUrl = `https://github.com/${repoName}.git`;
    
    await git.clone(repoUrl, targetDir, ['--depth', '1']);

    // Checkout specific branch if provided
    if (options.branch) {
      spinner.text = `Checking out ${options.branch}...`;
      const projectGit = simpleGit(targetDir);
      await projectGit.checkout(options.branch);
    }

    // Get commit hash
    const projectGit = simpleGit(targetDir);
    const log = await projectGit.log(['-1']);
    const commit = log.latest.hash.substring(0, 7);

    // Read description from package.json or README
    let description = '';
    const pkgPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      description = pkg.description || '';
    }

    // Save to sources.json
    const project = {
      name: projectName,
      repo: repoName,
      category,
      commit,
      branch: options.branch || 'main',
      description,
      added: new Date().toISOString().split('T')[0]
    };

    config.addProject(project);

    // Update .gitignore
    config.updateGitignore();

    // Update AGENTS.md
    config.updateAgentsFile();

    spinner.succeed(chalk.green(`✓ Added ${projectName} to refs/${category}/`));
    console.log(chalk.gray(`  Repo: ${repoName}`));
    console.log(chalk.gray(`  Commit: ${commit}`));
    if (description) {
      console.log(chalk.gray(`  Description: ${description}`));
    }

  } catch (error) {
    spinner.fail(chalk.red(`Failed to add project: ${error.message}`));
    process.exit(1);
  }
}

module.exports = { add };

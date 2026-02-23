const chalk = require('chalk');
const ora = require('ora');
const simpleGit = require('simple-git');
const path = require('path');
const config = require('../config');

async function update(name) {
  const sources = config.loadSources();
  const projects = name 
    ? sources.projects.filter(p => p.name === name)
    : sources.projects;

  if (projects.length === 0) {
    console.log(chalk.yellow(name ? `Project ${name} not found` : 'No projects to update'));
    return;
  }

  console.log(chalk.blue(`Updating ${projects.length} project(s)...\n`));

  for (const project of projects) {
    const spinner = ora(`Updating ${project.name}...`).start();
    const targetDir = path.join('refs', project.category, project.name);

    try {
      const git = simpleGit(targetDir);
      
      // Fetch latest
      await git.fetch();
      
      // Get current commit
      const currentLog = await git.log(['-1']);
      const currentCommit = currentLog.latest.hash.substring(0, 7);
      
      // Pull latest
      await git.pull();
      
      // Get new commit
      const newLog = await git.log(['-1']);
      const newCommit = newLog.latest.hash.substring(0, 7);

      if (currentCommit === newCommit) {
        spinner.info(chalk.gray(`${project.name} is up to date (${currentCommit})`));
      } else {
        // Update sources.json
        project.commit = newCommit;
        project.updated = new Date().toISOString().split('T')[0];
        config.addProject(project);
        
        spinner.succeed(chalk.green(`✓ ${project.name} updated: ${currentCommit} → ${newCommit}`));
      }

    } catch (error) {
      spinner.fail(chalk.red(`Failed to update ${project.name}: ${error.message}`));
    }
  }

  // Update AGENTS.md
  config.updateAgentsFile();
}

module.exports = { update };

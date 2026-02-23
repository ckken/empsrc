const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const config = require('../config');

async function remove(name) {
  const project = config.getProject(name);
  
  if (!project) {
    console.log(chalk.yellow(`Project ${name} not found`));
    return;
  }

  const targetDir = path.join('refs', project.category, project.name);

  // Confirm deletion
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Remove ${name} from refs/${project.category}/?`,
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.gray('Cancelled'));
    return;
  }

  const spinner = ora(`Removing ${name}...`).start();

  try {
    // Remove directory
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    // Remove from sources.json
    config.removeProject(name);

    // Update AGENTS.md
    config.updateAgentsFile();

    spinner.succeed(chalk.green(`✓ Removed ${name}`));

  } catch (error) {
    spinner.fail(chalk.red(`Failed to remove ${name}: ${error.message}`));
    process.exit(1);
  }
}

module.exports = { remove };

import chalk from "chalk";

// MENU
export const MENU = {
  appHeader: chalk.bgBlue(`*************************************************
*************** ${ chalk.yellowBright('Git-Manager-Cli') } *****************
*************************************************\n`),
  manageHeader: chalk.bgBlue(`*************************************************
************* ${ chalk.yellowBright('Manage-Repositories') } ***************
*************************************************\n`),
  mainChoices: [chalk.magentaBright('View all Repositories'), chalk.yellowBright('Manage Repositories'),
    chalk.greenBright('Add repository'), chalk.redBright('Remove repository'), chalk.blueBright('Exit')],
  manageChoices: [chalk.magentaBright('Check status'), chalk.yellowBright('Create branches'),
    chalk.greenBright('Change branches'), chalk.redBright('Delete branches') , chalk.blueBright('Exit')],
}
// STORAGE
export const STORAGE = {
  path: './repos.json',
}

// MESSAGES
export const MESSAGES = {
  noRepositories: chalk.redBright('\n  NO REPOSITORIES FOUND!!') + chalk.greenBright(' select option 3 to ADD\n'),
  branchName: 'Branch name:',
  selectOption: 'Select an option',
  areYouSure: chalk.redBright('Are you sure?'),
}

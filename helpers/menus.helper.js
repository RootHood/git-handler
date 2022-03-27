import inquirer from 'inquirer'
import {MENU} from "../constants/git-manger.constants.js";

/**
 * App main menu
 * @returns {Promise<*>}
 */
export const menuMain = async () => {
  console.clear();
  console.log(MENU.appHeader);
  const choices = getChoices(MENU.mainChoices);
  const menu = createMenu(
    {
    type: 'list', name: 'option', message: 'Select an option', choices}
  )
  const { option } = await inquirer.prompt(menu);
  return option;
}

/**
 * Menu to show repository management options
 * @returns {Promise<*>}
 */
export const menuManageRepositories = async () => {
  console.clear();
  console.log(MENU.appHeader);
  const choices = getChoices(MENU.manageChoices);
  const menu = createMenu(
    {
      type: 'list', name: 'option', message: 'Select an option', choices}
  );
  const { option } = await inquirer.prompt(menu);
  return option;
}

/**
 * Menu to remove repository
 * @param repositories repository list to remove
 * @returns {Promise<*>}
 */
export const menuRemoveRepository = async (repositories) => {
  console.clear();
  console.log(MENU.appHeader);
  const choices = getRepositoriesChoices(repositories);
  const menu = createMenu(
    {
      type: 'list', name: 'repository', message: `Select repository`, choices
    }
  );
  const { repository } = await inquirer.prompt(menu);
  return repository;
}

/**
 * Menu to select various repositories with checkboxes
 * @param repositories list of repos
 * @param message message to show in menu
 * @returns {Promise<*>}
 */
export const menuCheckboxRepositories = async (repositories, message) => {
  console.clear();
  console.log(MENU.appHeader);
  const choices = getRepositoriesChoices(repositories);
  const menu = createMenu(
    {
      type: 'checkbox', name: 'repositoryList', message: message, choices
    }
  );
  const { repositoryList } = await inquirer.prompt(menu);
  return repositoryList;
}

/**
 * Show confirm dialog
 * @param message message to show in dialog
 * @returns {Promise<*>}
 */
export const confirmDialog = async (message) => {
  const menu = createMenu(
    {
      type: 'confirm', name: 'ok', message
    }
  )
  const { ok } = await inquirer.prompt(menu);
  return ok;
}

/**
 * Read data from input
 * @param message Message to show in dialog
 * @returns {Promise<*>}
 */
export const readInput = async (message) => {
  const menu = createMenu(
    {
      type: 'input', name: 'value', message
    }
  );
  const { value } = await inquirer.prompt(menu);
  return value;
}

/**
 * Pause code execution
 * @param message Message to show
 * @returns {Promise<*>}
 */
export const pause = async  (message = 'Press enter to continue') => {
  const menu = { type: 'input', name: 'ok', message }
  const { ok } = await inquirer.prompt(menu);
  return ok;
}

/**
 * To get length of main menu choices
 * @returns {number}
 */
export const getMainMenuChoicesLength = () => {
  return MENU.mainChoices.length;
}

export const getManageMenuChoicesLength = () => {
  return MENU.manageChoices.length;
}

/**
 * Convert string array to valid inquirer choices
 * @param questions list of questions (menu options)
 * @returns {*}
 */
const getChoices = (questions) => {
  return questions.map((question, index) => {
    return {
      value: index,
      name: `${ index + 1 }. ${ question }`
    }
  });
}

/**
 * Convert Repository array to valid inquirer choices
 * @param repositories
 * @returns {*}
 */
const getRepositoriesChoices = (repositories) => {
  const choices = repositories.map((repo, index) => {
    return {
      value: repo,
      name: `${ index + 1 }. ${ repo.name }`
    }
  });
  choices.push(
    {
      value: null,
      name: `${ repositories.length + 1 }. Exit`
    }
  );
  return choices;
}

/**
 * General method to create menus
 * @param type menu type (list, checkbox, ...)
 * @param name returned value name
 * @param message message to show
 * @param choices menu options
 * @returns {string|[{name, type, message, choices: null, validate(*): (string|boolean)}]|boolean}
 */
const createMenu = ({ type, name, message, choices = null }) => {
  return [
    {
      type: type,
      name: name,
      message: message,
      choices,
      validate(value) {
        if (value.length === 0) {
          return 'Please insert value';
        }
        return true;
      }
    }
  ];
}

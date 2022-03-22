import inquirer from 'inquirer'

const mainMenuChoices = ['View all Repositories', 'Manage Repositories',  'Add repository', 'Remove repository', 'Exit'];
const manageMenuChoices = ['Check status', 'Create branch', 'Change branch', 'Delete branch' , 'Exit']
const mainMenuHeader =
  `*************************************************
***************** ${ 'Git-Handler' } *******************
*************************************************`

export const menuMain = async () => {
  console.clear();
  console.log(mainMenuHeader);
  const choices = getChoices(mainMenuChoices);
  const menu = getMenuQuestions(
    {
    type: 'list', name: 'option', message: 'Select an option', choices}
  )
  const { option } = await inquirer.prompt(menu);
  return option;
}

export const menuRemoveRepository = async (repositories) => {
  console.clear();
  const choices = repositories.map((repo, index) => {
    return {
      value: repo.id,
      name: `${ index + 1 }. ${ repo.name }`
    }
  });
  choices.push(
    {
      value: null,
      name: `${ repositories.length + 1 }. Exit`
    }
  )
  const menu = getMenuQuestions(
    {
      type: 'list', name: 'id', message: `Select repository`, choices
    }
  );
  const { id } = await inquirer.prompt(menu);
  return id;
}

export const menuManageRepositories = async () => {
  console.clear();
  const choices = getChoices(manageMenuChoices);
  const menu = getMenuQuestions(
    {
      type: 'list', name: 'option', message: 'Select an option', choices}
  );
  const { opt } = await inquirer.prompt(menu);
  return opt;
}

export const confirmDialog = async (message) => {
  const menu = getMenuQuestions(
    {
      type: 'confirm', name: 'ok', message
    }
  )
  const { ok } = await inquirer.prompt(menu);
  return ok;
}

export const readInput = async (message) => {
  const menu = getMenuQuestions(
    {
      type: 'input', name: 'value', message
    }
  );
  const { value } = await inquirer.prompt(menu);
  return value;
}

export const pause = async  (message = 'Press enter to continue') => {
  const menu = { type: 'input', name: 'ok', message }
  const { ok } = await inquirer.prompt(menu);
  return ok;
}

export const getMainMenuChoicesLength = () => {
  return mainMenuChoices.length
}

const getChoices = (questions) => {
  return questions.map((question, index) => {
    return {
      value: index,
      name: `${ index + 1 }. ${ question }`
    }
  });
}

const getMenuQuestions = ({ type, name, message, choices = null }) => {
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

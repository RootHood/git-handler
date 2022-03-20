import inquirer from 'inquirer'

const mainMenuChoices = ['View all repos', 'Change Branch name',  'Add repository', 'Remove repository', 'Exit'];
const mainMenuHeader =
  `*************************************************
***************** ${ 'Git-Handler' } *******************
*************************************************`

export const mainMenu = async () => {
  console.clear();
  console.log(mainMenuHeader);
  const choices = getChoices(mainMenuChoices);
  const menu = getMenuQuestions(
    {
    type: 'list', name: 'option', message: 'Select an option', choices: choices}
  )
  const { option } = await inquirer.prompt(menu);
  return option;
}

export const removeRepoMenu = async (repositories) => {
  console.clear();
  const choices = getChoices(repositories.map(repo => repo.name));
  choices.push(
    {
      value: repositories.length + 1,
      name: `${ repositories.length + 1 }. Exit`
    }
  )
  const menu = getMenuQuestions(
    {
      type: 'list', name: 'option', message: `Select repository`, choices
    }
  );
  const { option } = await inquirer.prompt(menu);
  return option;
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

export const pause = async  () => {
  const menu = { type: 'input', name: 'ok', message: 'Pres ENTER to continue' }
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

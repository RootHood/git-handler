import inquirer from 'inquirer'

const mainMenuQuestions = ['Change Branch name', 'View all repos', 'Add repository', 'Remove repository', 'Exit'];

export const mainMenu = async () => {
  console.clear();
  const choices = mainMenuQuestions.map((question, index) => {
    return {
      value: index + 1,
      name: question
    }
  });
  const menu = [
    {
      type: 'list',
      name: 'option',
      message: 'Select an option',
      choices
    }
  ];
  const { option } = await inquirer.prompt(menu);
  return option;
}

export const confirmDialog = async (message) => {
  const menu = [
    {
      type: 'confirm',
      name: 'ok',
      message: message,
    }
  ];
  const { ok } = await inquirer.prompt(menu);
  return ok;
}

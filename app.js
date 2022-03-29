#!/usr/bin/env node
import {
  getMainMenuChoicesLength,
  menuMain,
  pause,
  menuManageRepositories, getManageMenuChoicesLength, confirmDialog,
} from "./helpers/menus.helper.js";
import {RepositoryManager} from "./services/repository-managment.sevice.js";
import {MESSAGES} from "./constants/git-manger.constants.js";
import chalk from "chalk";

const repositoryManager = new RepositoryManager();

const main = async() => {
  let optionSelected;
  do {
    optionSelected = await menuMain();
    switch (optionSelected) {
      case 0:
        if (await repositoryManager.existsRepositories()) {
          repositoryManager.printRepositories();
          await pause();
        }
      break;
      case 1:
        if (await repositoryManager.existsRepositories()) {
          await handlerMenuManageRepositories();
        }
      break;
      case 2:
        const ok = await confirmDialog(MESSAGES.areYouSure);
        if (ok) {
          await repositoryManager.addRepository();
        }
      break;
      case 3:
        if (await repositoryManager.existsRepositories()) {
          await repositoryManager.removeRepository();
        }
      break;
    }
  } while (optionSelected !== getMainMenuChoicesLength() - 1)
}

const handlerMenuManageRepositories = async () => {
  let opt;
  do {
    opt = await menuManageRepositories();
    switch (opt) {
      case 0:
        await repositoryManager.checkStatus();
        break;
      case 1:
        await repositoryManager.createBranch();
        break;
      case 2:
        await repositoryManager.changeBranchName();
        break;
      case 3:
        await repositoryManager.deleteBranch();
        break;
    }
  } while (opt !== getManageMenuChoicesLength() - 1);
}

main().then(() => {
  console.clear();
  console.log(chalk.greenBright('\n  Good Bye, thanks for using Git-Manager-Cli!!\n'));
  setTimeout(() => {
    console.clear();
  }, 5000)
});

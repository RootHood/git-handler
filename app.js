#!/usr/bin/env node
import {
  getMainMenuChoicesLength,
  menuMain,
  pause,
  menuManageRepositories,
} from "./helpers/menus.helper.js";
import {RepositoryManager} from "./services/repository-managment.sevice.js";

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
          const opt = await menuManageRepositories();
          await handlerMenuManageRepositories(opt);
        }
      break;
      case 2:
        await repositoryManager.addRepository();
      break;
      case 3:
        if (await repositoryManager.existsRepositories()) {
          await repositoryManager.removeRepository();
        }
      break;
    }
  } while (optionSelected !== getMainMenuChoicesLength() - 1)
}

const handlerMenuManageRepositories = async (option) => {
  switch (option) {
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
}

main().then(() => console.log('Good Bye'));

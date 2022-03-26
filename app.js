#!/usr/bin/env node
import {
  confirmDialog,
  getMainMenuChoicesLength,
  menuMain,
  pause,
  menuRemoveRepository,
  menuManageRepositories
} from "./helpers/menus.util.js";
import {RepositoryManager} from "./services/repository-managment.sevice.js";

const repositoryManager = new RepositoryManager();

const main = async() => {
  let optionSelected;
  do {
    optionSelected = await menuMain();
    switch (optionSelected) {
      case 0:
        repositoryManager.printRepositories();
        await pause();
      break;
      case 1:
        const opt = await menuManageRepositories();
        await handlerMenuManageRepositories(opt);
      break;
      case 2:
        await repositoryManager.addRepository();
      break;
      case 3:
        await repositoryManager.handlerRemoveRepo();
      break;
    }
  } while (optionSelected !== getMainMenuChoicesLength() - 1)
}

const handlerMenuManageRepositories = async (option) => {
  switch (option) {
    case 0:
      await repositoryManager.checkStatus();
      break;
  }
}

main().then(() => console.log('Good Bye'));

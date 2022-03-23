#!/usr/bin/env node
import {
  confirmDialog,
  getMainMenuChoicesLength,
  menuMain,
  pause,
  menuRemoveRepository,
  menuManageRepositories
} from "./utils/menus.util.js";
import {RepositoryHandler} from "./models/repository-handler.model.js";

const repositoryHandler = new RepositoryHandler();

const main = async() => {
  let optionSelected;
  do {
    optionSelected = await menuMain();
    switch (optionSelected) {
      case 0:
        repositoryHandler.printRepositories();
        await pause();
      break;
      case 1:
        await menuManageRepositories();
        await pause();
      break;
      case 2:
        await repositoryHandler.addRepository();
      break;
      case 3:
        await handlerRemoveRepo();
      break;
    }
  } while (optionSelected !== getMainMenuChoicesLength() - 1)
}

const handlerRemoveRepo = async () => {
  let id;
  let ok = false;
  do {
    id = await menuRemoveRepository(repositoryHandler.repositories);
    if (id)
      ok = await confirmDialog('Are you sure?');
    if (ok) {
      repositoryHandler.removeRepository(id);
    };
  } while (id && ok)
}

main().then(() => console.log('Good Bye'));

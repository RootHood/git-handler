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
  let option;
  let ok = false;
  do {
    option = await menuRemoveRepository(repositoryHandler.repositories);
    ok = await confirmDialog('Are you sure?');
    if (ok) {
      repositoryHandler.removeRepository(option);
      option = repositoryHandler.repositories.length;
    };
  } while (!ok || option !== repositoryHandler.repositories.length)
}

main().then(() => console.log('Good Bye'));

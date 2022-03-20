import {mainMenu} from "./utils/menus.util.js";
import {RepositoryHandler} from "./models/repository-handler.model.js";


const main = async() => {
  const repositoryHandler = new RepositoryHandler();
  let optionSelected;
  do {
    optionSelected = await mainMenu();
    switch (optionSelected) {
      case 1:
        // TODO: Change Branch name
      break;
      case 2:
        // TODO: View all Repositories
      break;
      case 3:
        await repositoryHandler.addRepository();
      break;
      case 4:
        // TODO: Remove repository
      break;
    }
  } while (optionSelected !== 5)
}

main().then(() => console.log('Good Bye'));

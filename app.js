import {confirmDialog, mainMenu} from "./utils/menus.js";


const main = async() => {
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
        // TODO: Add repository
      break;
      case 4:
        // TODO: Remove repository
      break;
    }
  } while (optionSelected !== 5)
}

main().then(() => console.log('Good Bye'));

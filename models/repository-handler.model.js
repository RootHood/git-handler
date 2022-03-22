import {Repository} from "./repository.model.js";
import {getData, persistData} from "../utils/storage-handler.util.js";
import {pause, readInput} from "../utils/menus.util.js";
import { existsSync } from 'fs';

export class RepositoryHandler {
  #newRepoMessages = ['Repository name: ', 'Repository path: '];
  repositories = [];

  constructor() {
    this.repositories = getData();
  }

  addRepository = async () => {
    const values = [];
    let value;
    let hasErrors = false;
    let index = 0;
    for (const message in this.#newRepoMessages) {
      do {
        value = await readInput(this.#newRepoMessages[message]);
        if (index === 1 && !existsSync(value)) {
          await pause('INVALID URL, press enter to re-enter value');
          hasErrors = true;
        } else {
          hasErrors = false;
        }
      } while (hasErrors);
      values.push(value);
      index ++;
    }
    const repository = new Repository(values[0], values[1]);
    this.repositories.push(repository);
    persistData(this.repositories);
  }

  removeRepository = (index) => {
    this.repositories.splice(index, 1);
    persistData(this.repositories);
  }

  printRepositories = () => {
    if (this.repositories.length === 0) {
      console.log('No repositories found, press option 3 to add.');
      return;
    }
    this.repositories.forEach((repo, index) => {
      const i = index + 1;
      console.log(`  Name: ${ repo.name }, Path: ${ repo.path }`);
    });
  }
}

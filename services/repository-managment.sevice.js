import {Repository} from "../models/repository.model.js";
import {getData, persistData} from "../helpers/storage-manager.util.js";
import {confirmDialog, menuRemoveRepository, pause, readInput} from "../helpers/menus.util.js";
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {executeCommand} from "../helpers/terminal-manager.util.js";
import {NO_COMMITS, PULL} from "../constants/git-manger.constants.js";

export class RepositoryManager {
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
    const repository = new Repository(uuidv4(), values[0], values[1]);
    this.repositories.push(repository);
    persistData(this.repositories);
  }

  handlerRemoveRepo = async () => {
    let id;
    let ok = false;
    do {
      id = await menuRemoveRepository(this.repositories);
      if (id)
        ok = await confirmDialog('Are you sure?');
      if (ok) {
        await this.removeRepository(id);
      };
    } while (id && ok)
  }

  removeRepository = (id) => {
    const index = this.repositories.findIndex(repo => repo.id === id);
    if (index === -1) return;
    this.repositories.splice(index, 1);
    persistData(this.repositories);
  }

  printRepositories = () => {
    if (this.repositories.length === 0) {
      console.log('No repositories found, press option 3 to add.');
      return;
    }
    this.repositories.forEach((repo) => {
      console.log(`  Name: ${ repo.name }, Path: ${ repo.path }`);
    });
  }

  checkStatus = async () => {
    console.clear();
    let index = 1;
    for (const repo of this.repositories) {
      await executeCommand(`cd ${ repo.path } && git status`).then(result => {
        this.printStatusResult(repo, result);
      }).catch(error => {
        console.error(error);
      });
      if (index < this.repositories.length) await pause(); // TODO: Pause in each repo?
      index++;
    }
    await pause();
  }

  changeBranchName = async (reposList) => {
    console.clear();
    for (const repo of reposList) {
      await executeCommand(`cd ${ repo.path } && git fetch && git status`).then(result => {
        console.log(`\n\nRepository: ${ repo.name }`);
        console.log(result);
      }).catch(error => {
        console.error(error);
      });
    }
    await pause();
  }

  printStatusResult(repo, result) {
    console.clear();
    console.log('*********************************\n');
    console.log(`Repository: ${ repo.name }`);
    console.table(`${ result }`);
    console.log('*********************************\n');
    result.indexOf(NO_COMMITS || PULL) !== -1 ?
      console.log('NO PENDENT ACTIONS IN THIS REPO\n') :
      console.log('ATTENTION!!! ACTIONS PENDENTS IN THIS REPO\n');
  }
}

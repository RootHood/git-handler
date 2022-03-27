import {Repository} from "../models/repository.model.js";
import {getData, persistData} from "../helpers/storage-manager.helper.js";
import {
  confirmDialog, menuCheckboxRepositories, menuRemoveRepository, pause, readInput} from "../helpers/menus.helper.js";
import { existsSync } from 'fs';
import { v4 as uuidV4 } from 'uuid';
import {executeCommand} from "../helpers/terminal-manager.helper.js";
import {MESSAGES} from "../constants/git-manger.constants.js";

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
    const repository = new Repository(uuidV4(), values[0], values[1]);
    this.repositories.push(repository);
    persistData(this.repositories);
  }

  removeRepository = async () => {
    let repository;
    let ok = false;
    do {
      repository = await menuRemoveRepository(this.repositories);
      if (repository)
        ok = await confirmDialog('Are you sure?');
      if (ok) {
        await this.#remove(repository);
      }
    } while (repository && ok)
  }

  printRepositories = () => {
    if (this.repositories.length === 0) {
      console.log(MESSAGES.noRepositories);
      return;
    }
    this.repositories.forEach((repo) => {
      console.log(`  Name: ${ repo.name }, Path: ${ repo.path }`);
    });
  }

  checkStatus = async () => {
    console.clear();
    const command = 'git status';
    await this.#executeGitCommands(this.repositories, command);
  }

  changeBranchName = async () => {
    const result = await this.#handlerSelectRepositories(
      'Select repositories to change branch',
      'Can you change branch in?: '
    );
    if (result && !result.success || !result) return;
    const branchName = await readInput('Enter branch name');
    const command = `git checkout ${ branchName }`;
    await this.#executeGitCommands(result.data, command, branchName);
  }

  createBranch = async () => {
    const result = await this.#handlerSelectRepositories(
      'Select repositories',
      'Can you add new branch in?: '
    );
    if (result && !result.success || !result) return;
    const branchName = await readInput('Enter branch name');
    const command = `git checkout -b ${ branchName }`;
    await this.#executeGitCommands(result.data, command, branchName);
  }

  deleteBranch = async () => {
    const result = await this.#handlerSelectRepositories(
      'Select repositories',
      'Can you delete branch in?: '
    );
    if (result && !result.success || !result) return;
    const branchName = await readInput('Enter branch name');
    const command = `git branch -d ${ branchName }`;
    await this.#executeGitCommands(result.data, command, branchName);
  }

  existsRepositories = async () => {
    if (this.repositories.length === 0) {
      console.log(MESSAGES.noRepositories);
      await pause();
      return false;
    }
    return true;
  }

  // PRIVATE FUNCTIONS

  #handlerSelectRepositories = async (menuMessage, confirmMessage) => {
    const repositories = await menuCheckboxRepositories(this.repositories, menuMessage);
    const repositoriesFiltered = repositories.filter(id => id);
    if (repositoriesFiltered.length) {
      let message = confirmMessage;
      repositoriesFiltered.forEach((repo, index) => {
        message += `${repo.name}${index < repositoriesFiltered.length - 1 ? ', ' : ''}`
      });
      message += '.'
      const ok = await confirmDialog(message);
      return { success: ok, data: repositoriesFiltered };
    }
  }

  #remove = (repository) => {
    const index = this.repositories.findIndex(repo => repo === repository);
    if (index === -1) return;
    this.repositories.splice(index, 1);
    persistData(this.repositories);
  }

  #executeGitCommands = async (repositories, command, branchName) => {
    console.clear();
    let index = 1;
    for (const repo of repositories) {
      await executeCommand(`cd ${ repo.path } && ${ command }`).then(result => {
        RepositoryManager.#printStatusResult(repo, result);
      }).catch(() => {
        console.log(`  \nERROR: Changes has not applied, branch ${ branchName } not exists\n`);
      });
      if (index < repositories.length) await pause(); // TODO: Pause in each repo?
      index++;
    }
    await pause();
  }

  static #printStatusResult(repo, result) {
    console.clear();
    console.log('*********************************\n');
    console.log(`  Repository: ${ repo.name }`);
    console.table(`  ${ result }`);
    console.log('*********************************\n');
  }
}

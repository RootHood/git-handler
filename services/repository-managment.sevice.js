import {Repository} from "../models/repository.model.js";
import {getData, persistData} from "../helpers/storage-manager.helper.js";
import {
  confirmDialog, menuCheckboxRepositories, menuRemoveRepository, pause, readInput} from "../helpers/menus.helper.js";
import { existsSync } from 'fs';
import { v4 as uuidV4 } from 'uuid';
import {executeCommand} from "../helpers/terminal-manager.helper.js";
import {MESSAGES} from "../constants/git-manger.constants.js";
import chalk from "chalk";

// noinspection JSMethodCanBeStatic
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
        ok = await confirmDialog(MESSAGES.areYouSure);
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
    console.log();
    this.repositories.forEach((repo) => {
      console.log(`  ${chalk.blueBright('Name:')} ${ repo.name }, ${ chalk.yellowBright('Path:') } ${ repo.path }\n`);
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
    const branchName = await readInput(MESSAGES.branchName);
    const command = `git checkout ${ branchName }`;
    await this.#executeGitCommands(result.data, command);
  }

  createBranch = async () => {
    const result = await this.#handlerSelectRepositories(
      'Select repositories',
      chalk.greenBright('Can you add new branch in?: ')
    );
    if (result && !result.success || !result) return;
    const branchName = await readInput(MESSAGES.branchName);
    const command = `git checkout -b ${ branchName }`;
    await this.#executeGitCommands(result.data, command);
  }

  deleteBranch = async () => {
    const result = await this.#handlerSelectRepositories(
      'Select repositories',
      'Can you delete branch in?: '
    );
    const ok = await confirmDialog(MESSAGES.areYouSure);
    if (!ok) return;
    if (result && !result.success || !result) return;
    const branchName = await readInput(MESSAGES.branchName);
    const command = `git branch -d ${ branchName }`;
    await this.#executeGitCommands(result.data, command);
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
        message += `${ chalk.yellowBright(repo.name) }${index < repositoriesFiltered.length - 1 ? ', ' : ''}`
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

  #executeGitCommands = async (repositories, command) => {
    console.clear();
    let index = 1;
    let canContinue = true;
    for (const repo of repositories) {
      if (!canContinue) {
        return;
      }
      await executeCommand(`cd ${ repo.path } && ${ command }`).then(result => {
        this.#printStatusResult(repo, result);
      }).catch((error) => {
        console.log(
          chalk.redBright(`\n  ERROR: ${ chalk.yellowBright(error) }\n`)
        );
        canContinue = false;
      });
      if (index < repositories.length) await pause(); // TODO: Pause in each repo?
      index++;
    }
    await pause();
  }

  #printStatusResult = (repo, result) => {
    console.clear();
    console.log('*********************************\n');
    console.log(`  ${ chalk.blueBright('Repository:') } ${ chalk.yellowBright(repo.name) }`);
    console.table(`  ${ chalk.yellow(result) }`);
    console.log('*********************************\n');
  }
}

import {Repository} from "./repository.model.js";
import {getData, persistData} from "../utils/storage-handler.util.js";
import {readInput} from "../utils/menus.util.js";

export class RepositoryHandler {
  #newRepoMessages = ['Repository name: ', 'Repository path: '];
  repositories = [];

  constructor() {
    this.repositories = getData() ?? [];
  }

  addRepository = async () => {
    const values = [];
    for (const message in this.#newRepoMessages) {
      const value = await readInput(this.#newRepoMessages[message]);
      values.push(value);
    }
    const repository = new Repository(values[0], values[1]);
    this.repositories.push(repository);
    persistData(this.repositories);
  }

  removeRepository = (repository) => {
    const index = this.repositories.findIndex(repository);
    if (index !== -1) this.repositories.splice(index, 1);
  }
}

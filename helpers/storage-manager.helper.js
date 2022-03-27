import { writeFileSync, existsSync, readFileSync } from 'fs'
import {STORAGE} from "../constants/git-manger.constants.js";

export const persistData = (data) => {
  const dataJSON = JSON.stringify(data);
  writeFileSync(STORAGE.path, dataJSON);
}

export const getData = () => {
  if (!existsSync(STORAGE.path)) return [];
  const data = readFileSync(STORAGE.path, { encoding: 'utf-8' });
  return JSON.parse(data);
}

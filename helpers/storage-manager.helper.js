import { writeFileSync, existsSync, readFileSync } from 'fs'
import {STORAGE_PATH} from "../constants/git-manger.constants.js";

export const persistData = (data) => {
  const dataJSON = JSON.stringify(data);
  writeFileSync(STORAGE_PATH, dataJSON);
}

export const getData = () => {
  if (!existsSync(STORAGE_PATH)) return [];
  const data = readFileSync(STORAGE_PATH, { encoding: 'utf-8' });
  return JSON.parse(data);
}

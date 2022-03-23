import { writeFileSync, existsSync, readFileSync } from 'fs'

const path = './repos.json';

export const persistData = (data) => {
  const dataJSON = JSON.stringify(data);
  writeFileSync(path, dataJSON);
}

export const getData = () => {
  if (!existsSync(path)) return [];
  const data = readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(data);
}

import * as fs from 'fs'

const path = './storage/repos.json';

export const persistData = (data) => {
  const dataJSON = JSON.stringify(data);
  fs.writeFileSync(path, dataJSON);
}

export const getData = () => {
  if (!fs.existsSync(path)) return;
  const data = fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(data);
}

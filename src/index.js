import { readFileSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';

const selectParseFn = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
};
const process = (pointer, fileType) => {
  const parseFn = selectParseFn[fileType];
  return parseFn(pointer);
};
const compare = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 });
  return _.reduce(keys, (acc, key) => {
    if (obj1[key] === obj2[key]) {
      return [...acc, `${key}: ${obj1[key]}`];
    }
    if (obj1[key] && !obj2[key]) {
      return [...acc, `- ${key}: ${obj1[key]}`];
    }
    if (obj2[key] && !obj1[key]) {
      return [...acc, `+ ${key}: ${obj2[key]}`];
    }
    if ((obj2[key] && obj1[key]) && (!(obj1[key] === obj2[key]))) {
      return [...acc, `- ${key}: ${obj1[key]}`, `+ ${key}: ${obj2[key]}`];
    }
    return acc;
  }, []);
};
export default (pathToFile1, pathToFile2) => {
  const pointerFile1 = readFileSync(pathToFile1);
  const pointerFile2 = readFileSync(pathToFile2);
  const obj1 = process(pointerFile1, path.extname(pathToFile1));
  const obj2 = process(pointerFile2, path.extname(pathToFile2));
  return `{\n ${compare(obj1, obj2).join('\n')}\n}`;
};

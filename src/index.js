import { readFileSync } from 'fs';
import _ from 'lodash';

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
  const obj1 = JSON.parse(readFileSync(pathToFile1));
  const obj2 = JSON.parse(readFileSync(pathToFile2));
  return compare(obj1, obj2).join('\n');
};

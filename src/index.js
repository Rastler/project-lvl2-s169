import { readFileSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const selectParseFn = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.decode,
};
const process = (pointer, fileType) => {
  const parseFn = selectParseFn[fileType];
  return parseFn(pointer);
};
const compare = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 });
  const reduceObj = obj => _.reduce(obj, (acc, value, name) => [...acc, { name, value }], []);
  return keys.reduce((acc, key) => {
    const inObj1 = key in obj1;
    const inObj2 = key in obj2;
    const isObj1 = _.isObject(obj1[key]);
    const isObj2 = _.isObject(obj2[key]);
    // console.log(key, isObj1, isObj2);
    if ((inObj1 && inObj2) && isObj1 && isObj2) {
      return [...acc, { name: key, value: compare(obj1[key], obj2[key]) }];
    }
    if ((inObj1 && !inObj2) && (isObj1 || isObj2)) {
      return [...acc, { name: key, changes: 'remove', value: reduceObj(obj1[key]) }];
    }
    if ((!inObj1 && inObj2) && (isObj1 || isObj2)) {
      return [...acc, { name: key, changes: 'add', value: reduceObj(obj2[key]) }];
    }
    if ((inObj1 && inObj2) && (obj1[key] === obj2[key])) {
      return [...acc, { name: key, value: obj1[key] }];
    }
    if ((inObj1 && inObj2) && (obj1[key] !== obj2[key])) {
      return [...acc, { name: key, changes: 'add', value: obj2[key] }, { name: key, changes: 'remove', value: obj1[key] }];
    }
    if ((!inObj1 && inObj2) && (obj1[key] !== obj2[key])) {
      return [...acc, { name: key, changes: 'add', value: obj2[key] }];
    }
    if ((inObj1 && !inObj2) && (obj1[key] !== obj2[key])) {
      return [...acc, { name: key, changes: 'remove', value: obj1[key] }];
    }
    return acc;
  }, []);
};


const render = (ast, spaces = 4) => {
  const tab = space => ' '.repeat(space);
  const sign = (change) => {
    switch (change) {
      case 'add':
        return '+';
      case 'remove':
        return '-';
      default:
        return ' ';
    }
  };
  const rendered = ast.reduce((acc, key) => {
    if (_.isObject(key.value)) {
      acc += `${tab(spaces)}${sign(key.changes)} ${key.name}: ${render(key.value, spaces * 2)}\n`;
    } else {
      acc += `${tab(spaces)}${sign(key.changes)} ${key.name}: ${key.value}\n`;
    }
    return acc;
  }, '');
  return `{\n${rendered}${tab(spaces)}}`;
};

export default (pathToFile1, pathToFile2) => {
  const pointerFile1 = readFileSync(pathToFile1, 'utf-8');
  const pointerFile2 = readFileSync(pathToFile2, 'utf-8');
  const obj1 = process(pointerFile1, path.extname(pathToFile1));
  const obj2 = process(pointerFile2, path.extname(pathToFile2));
  return render(compare(obj1, obj2));
};

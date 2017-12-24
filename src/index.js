import { readFileSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';
import getRender from './renders';

const selectParseFn = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.decode,
};
const process = (pointer, fileType) => {
  const parseFn = selectParseFn[fileType];
  return parseFn(pointer);
};

const types = [
  {
    type: 'unchenged',
    testing: (befor, after, key) => (_.has(befor, key)
     && _.has(after, key) && (befor[key] === after[key])),
    handle: (befor, after) => ({ befor, after }),
  },
  {
    type: 'removed',
    testing: (befor, after, key) => _.has(befor, key) && !_.has(after, key),
    handle: (befor, after) => ({ befor, after }),
  },
  {
    type: 'changed',
    testing: (befor, after, key) =>
      _.has(befor, key) && _.has(after, key) && (befor[key] !== after[key]) &&
      !_.isObject(befor[key]) && !_.isObject(after[key]),
    handle: (befor, after) => ({ befor, after }),
  },
  {
    type: 'added',
    testing: (befor, after, key) => !_.has(befor, key) && _.has(after, key),
    handle: (befor, after) => ({ befor, after }),
  },
  {
    type: 'nested',
    testing: ((befor, after, key) => _.has(befor, key) && _.has(after, key) &&
    _.isObject(befor[key]) && _.isObject(after[key])),
    handle: (befor, after, fn) => ({ value: fn(befor, after) }),
  },
];

const genAst = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 });
  return keys.map((key) => {
    const { type, handle } = _.find(types, item => item.testing(obj1, obj2, key));
    const { befor, after, value } = handle(obj1[key], obj2[key], genAst);
    return {
      name: key, type, befor, after, value,
    };
  });
};

export default (pathToFile1, pathToFile2, format = 'visual') => {
  const pointerFile1 = readFileSync(pathToFile1, 'utf-8');
  const pointerFile2 = readFileSync(pathToFile2, 'utf-8');
  const obj1 = process(pointerFile1, path.extname(pathToFile1));
  const obj2 = process(pointerFile2, path.extname(pathToFile2));
  const ast = genAst(obj1, obj2);
  const render = getRender('plain');
  return render(ast);
};

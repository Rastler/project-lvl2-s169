import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const answer = fs.readFileSync(path.join(__dirname, '__fixtures__/answer.plain.txt'), 'utf-8');

test('Testing plain output with JSON', () => {
  const testFile1 = path.join(__dirname, '__fixtures__/befor.plain.json');
  const testFile2 = path.join(__dirname, '__fixtures__/after.plain.json');
  expect(genDiff(testFile1, testFile2)).toEqual(answer);
});
// test('Testing genDiff with JSON', () => {
//   const testFile1 = path.join(__dirname, '__fixtures__/befor.json');
//   const testFile2 = path.join(__dirname, '__fixtures__/after.json');
//   expect(genDiff(testFile1, testFile2)).toEqual(answer);
// });
// test('Testing genDiff with YML', () => {
//   const testFile1 = path.join(__dirname, '__fixtures__/befor.yml');
//   const testFile2 = path.join(__dirname, '__fixtures__/after.yml');
//   expect(genDiff(testFile1, testFile2)).toEqual(answer);
// });
// test('Testing genDiff with JSON and YML', () => {
//   const testFile1 = path.join(__dirname, '__fixtures__/befor.json');
//   const testFile2 = path.join(__dirname, '__fixtures__/after.yml');
//   expect(genDiff(testFile1, testFile2)).toEqual(answer);
// });
// test('Testing genDiff with INI', () => {
//   const testFile1 = path.join(__dirname, '__fixtures__/befor.ini');
//   const testFile2 = path.join(__dirname, '__fixtures__/after.ini');
//   expect(genDiff(testFile1, testFile2)).toEqual(answer);
// });

import path from 'path';
import genDiff from '../src';

test('Testing genDiff with fixtures', () => {
  const testFile1 = path.join(__dirname, '__fixtures__/befor.json');
  const testFile2 = path.join(__dirname, '__fixtures__/after.json');
  const array = 'host: hexlet.io\n- timeout: 50\n+ timeout: 20\n- proxy: 123.234.53.22\n+ verbose: true';
  expect(genDiff(testFile1, testFile2)).toEqual(array);
});

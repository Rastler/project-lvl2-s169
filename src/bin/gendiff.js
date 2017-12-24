#!/usr/bin/env node

import program from 'commander';
import gendiff from '../';
import version from '../../package.json';


program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format', 'type')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, type) => {
    console.log(gendiff(firstConfig, secondConfig, type));
  })
  .parse(process.argv);

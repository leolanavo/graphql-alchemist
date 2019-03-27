#!/usr/bin/env node

import { version } from '../package.json';
import help from './help';
import Resolver from './resolver';

const args: string[] = process.argv.slice(2);

function isHelp(str: string): boolean {
  return str === '-h' || str === '--help';
}

if (args[0] === '-v' || args[0] === '--version') {
  console.log(version);
}

if (isHelp(args[0])) {
  console.log(help.global);
}

if (args[0] === 'resolver') {
  const resolver: Resolver = new Resolver(args);
  resolver.print();
}

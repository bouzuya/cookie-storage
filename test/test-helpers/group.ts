import { Test } from 'beater';
import { test } from './test';

const group = (name: string, tests: Test[]): Test[] =>
  tests.map((t) => test(name + t.name, t));

export { group };

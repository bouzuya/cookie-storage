import { Test, run } from 'beater';
import { fixture as fixtureOriginal } from 'beater-helpers/fixture';
import { named as test } from 'beater-helpers/name';

const fixture = (
  {
    before,
    after
  }: {
    before: () => void;
    after: () => void;
  },
  test: () => void
): Test => fixtureOriginal(before, after, (_) => test());

const group = (name: string, tests: Test[]): Test[] =>
  tests.map((t) => test(name + t.name, t));

export { Test, fixture, group, run, test };

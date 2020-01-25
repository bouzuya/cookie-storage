import { Test } from 'beater';

const test = (name: string, t: Test): Test => {
  Object.defineProperty(t, 'name', { value: name });
  return t;
};

export { test };

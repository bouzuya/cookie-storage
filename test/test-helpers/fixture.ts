const fixture = (
  options: {
    before: () => void;
    after: () => void;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test: () => void
): (() => Promise<void>) => {
  return (): Promise<void> => {
    return Promise.resolve()
      .then(() => options.before())
      .then(() => test)
      .then(
        (v) => {
          options.after();
          return Promise.resolve(v);
        },
        (e) => {
          options.after();
          return Promise.reject(e);
        }
      )
      .then((_) => void 0); // FIXME
  };
};

export { fixture };

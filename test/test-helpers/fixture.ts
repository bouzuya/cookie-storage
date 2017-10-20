const fixture = (options: {
  before: () => void;
  after: () => void;
}, test: Function): Function => {
  return () => {
    return Promise.resolve()
      .then(() => options.before())
      .then(() => test)
      .then((v) => {
        options.after()
        return Promise.resolve(v);
      }, (e) => {
        options.after();
        return Promise.reject(e);
      });
  };
};

export { fixture };

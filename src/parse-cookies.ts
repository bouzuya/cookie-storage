const parseCookies = (s: string): { [key: string]: string } => {
  if (s.length === 0) return {};
  const parsed: { [key: string]: string } = {};
  const pairs = s.split(';')

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const index = pair.indexOf('=')

    // skip things that don't look like key=value
    if (index < 0) {
      continue;
    }

    const key = pair.substring(0, index).trim()

    // only assign once
    if (undefined == parsed[key]) {
      let val = pair.substring(index + 1, pair.length).trim()

      // quoted values
      if (val[0] === '"') {
        val = val.slice(1, -1)
      }

      // catch error: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent#catching_errors
      try {
        const _key = decodeURIComponent(key);
        const _val = decodeURIComponent(val);
        parsed[_key] = decodeURIComponent(_val);  
      } catch (error) {
        parsed[key] = val
      }
    }
  }

  return parsed;
};

export { parseCookies };

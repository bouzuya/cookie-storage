const parseCookies = (s: string): { [key: string]: string } => {
  if (s.length === 0) return {};
  const parsed: { [key: string]: string } = {};
  const pattern = new RegExp("\\s*;\\s*");
  s.split(pattern).forEach((i) => {
    const [encodedKey, ...encodedValueList] = i.split("=");
    const key = decodeURIComponent(encodedKey);
    const value = decodeURIComponent(encodedValueList.join("="));
    parsed[key] = value;
  });
  return parsed;
};

export { parseCookies };

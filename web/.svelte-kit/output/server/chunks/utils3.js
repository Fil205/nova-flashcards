function parseId(param) {
  const n = parseInt(param ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}
export {
  parseId as p
};

module.exports.isValidValue = (val) => {
  return !val ? false : true;
};

module.exports.isEqualString = (strToCompare, strComparator) => {
  return strToCompare == strComparator ? true : false;
};

module.exports.isObjectOrArrayEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

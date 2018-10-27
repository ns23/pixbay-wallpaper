const os = require('os');
const path = require('path');

const stringType = arg => typeof arg === 'string';
const numberType = arg => typeof arg === 'number';
const boolType = arg => typeof arg === 'boolean';
const boolOrNumber = arg => boolType(arg) || numberType(arg);

const resolveDir = (dir) => {
  if (dir.startsWith('.') && dir.length > 1) {
    return path.join(process.cwd(), dir);
  }

  if (dir.startsWith('~')) {
    return path.join(os.homedir(), dir.substr(1));
  }
  return dir;
};

const options = {
  random: {
    alias: 'r',
    bool: true,
    triggerDownload: true,
    desc: ['Get a random image', '--random'],
  },
  width: {
    alias: 'w',
    test: boolOrNumber,
    param: 'Number',
    error: 'must be a number (ex: 1920)',
    desc: ['Set the width of desired image.', ' --width 2880 --save-config'],
  },
  height: {
    alias: 'h',
    test: boolOrNumber,
    param: 'Number',
    error: 'must be a number (ex: 1200)',
    desc: [
      'Set the height of desired image.',
      ' --width 2880 --height 1800 --save-config',
    ],
  },
  dir: {
    alias: 'd',
    test: stringType,
    param: 'String',
    error: 'must be a valid directory path',
    transform: resolveDir,
    desc: [
      'Download the image to a specific directory.',
      '"." uses the current working directory.',
      '"./" stores the current working directory even when it changes.',
      ' --dir "/Users/Shared',
      ' --dir "C:UsersPublic',
      ' -d .',
    ],
  },
};

const objToArray = obj => Reflect.ownKeys(obj).map(k => [k, obj[k]]);
const optionArray = objToArray(options);
const aliases = optionArray
  .map(([, obj]) => obj.alias);
const boolOptions = optionArray
  .filter(([, obj]) => obj.bool)
  .map(([key]) => key);
const minimistAliases = optionArray.reduce((acc, [key, obj]) => {
  if (obj.alias) {
    acc[obj.alias] = key;
  }
  return acc;
}, {});

const triggerDownload = objToArray
  .filter(([, obj]) => obj.triggerDownload)
  .map(([key]) => key);


module.exports = {
  resolveDir,
  options,
  optionArray,
  aliases,
  boolOptions,
  minimistAliases,
  triggerDownload,
};

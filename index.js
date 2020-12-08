const { join, normalize, dirname, relative } = require('path');
const { sync: readPkgUp } = require('read-pkg-up');

const pkgNameExp = /(^@[^/]+\/[^/]+|[^./][^/]*)(.*)/;

const { packageJson: pkg, path: pkgPath } = readPkgUp({ normalize: false });
const root = dirname(pkgPath);

function getSourcePath(source, state, isRequire) {
  const { resolveTo = isRequire ? pkg.main : pkg.exports['.'] || pkg.module } = state.opts;
  const match = pkgNameExp.exec(source);
  if (match && match[1] !== null && match[1] === pkg.name) {
    return normalize(join(relative(dirname(state.filename), root), resolveTo, match[2]));
  } else {
    return source;
  }
}

module.exports = function () {
  return {
    name: 'babel-plugin-transform-self-import',
    visitor: {
      CallExpression(path, state) {
        const { callee } = path.node;
        // good enough for now
        if (callee.name === 'require') {
          path.node.arguments[0].value = getSourcePath(path.node.arguments[0].value, state, true);
        }
      },
      'Import|ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(path, state) {
        const { source } = path.node;
        if (source) {
          source.value = getSourcePath(source.value, state, false);
        }
      },
    },
  };
};

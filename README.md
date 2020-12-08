## babel-plugin-transform-package-self-reference

Transforms package self-references in commonjs and es modules by changing the self-reference to a path relative to the importing file. Reads the closest `package.json` to get the package name and the path in the package to resolve the self reference to. If it is a transforming a `require` will resolve to the file specified in `main`. When transforming an import it will resolve to the file specified in `exports['.']`, or `module` if that is not found.

If you wish to short circuit the above logic and resolve to a custom path, specify a `resolveTo` path in the plugin's options object.

### Examples
```js
// package.json
{
  name: 'my-package',
  main: 'index.cjs',
  exports: {
    ".": 'index.mjs'
  },
}
```

```js
// folder/file.js
import { foo } from "my-package";
const foo = require("my-package");

// ↓ ↓ ↓

import { foo } from "../index.mjs";
const foo = require("../index.cjs");
```
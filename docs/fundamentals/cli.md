---
sidebar_position: 100
---

# Cli

start a local dev server

```
summer serve --env [ENV_NAME]
```

run test cases

```
summer test --env [ENV_NAME] -- [JEST_OPTIONS]
```

build

```
summer build --env [ENV_NAME]

# By default Summer only generate project source map, this keep source map small and can be use efficiently, to include all sourcemap in node_modules add --fullSourceMap.
summer build --env [ENV_NAME] --fullSourceMap

# Some npm packages may not working after bundling, this happen when package read external resource, to bundle without specific node modules, add --external. However to link these packages to you bundle, you need recreate node_modules in /build folder，install all external packages and their dependencies.
summer build --env [ENV_NAME] --external [NODE_MODULE_1],[NODE_MODULE_2],...
```


```js title="package.json"
  "scripts": {
    "serve": "summer serve --env local",
    "test": "summer test --env test",
    "build": "summer build --env prod",
    "start": "node --enable-source-maps ./build/index.js"
  }
```
 
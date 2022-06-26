---
sidebar_position: 100
---

# 命令行

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
summer build --env [ENV_NAME] -- [ESBUILD_OPTIONS]
```


```js title="package.json"
  "scripts": {
    "serve": "summer serve --env local",
    "test": "summer test --env test",
    "build": "summer build --env prod",
    "start": "node --enable-source-maps ./build/index.js"
  }
```
 
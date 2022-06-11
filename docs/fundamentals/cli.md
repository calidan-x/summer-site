---
sidebar_position: 100
---

# Cli

start a local dev server -s serve

```
summer -s --env [ENV_NAME]
```

build -b build

```
summer -b --env [ENV_NAME]
```

test -t test

```
summer -t --env [ENV_NAME]
```


```js title="package.json"
  "scripts": {
    "dev": "summer -s --env local",
    "test": "summer -t --env test",
    "build": "summer -b --env prod",
    "start": "node --enable-source-maps ./build/index.js"
  }
```
 
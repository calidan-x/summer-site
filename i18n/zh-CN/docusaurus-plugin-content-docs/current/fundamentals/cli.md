---
sidebar_position: 100
---

# 命令行

本地启动服务

```
summer serve --env [ENV_NAME]
```

跑测试

```
summer test --env [ENV_NAME] -- [JEST_OPTIONS]
```

编译打包

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
 
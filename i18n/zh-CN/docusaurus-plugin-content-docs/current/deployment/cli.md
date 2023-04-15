---
sidebar_position: 100
---

# 命令行

本地启动服务

```
summer serve --env [ENV_NAME]
```

运行测试

```
summer test --env [ENV_NAME] -- [JEST_OPTIONS]
```

编译打包

```
summer build --env [ENV_NAME]

# Summer在默认情况下只会生成本项目的 SourceMap，这保证了SourceMap的体积小且高效运作，如果你想打包所有的，包括 node_modules 下的所有 SourceMap，添加 --fullSourceMap
summer build --env [ENV_NAME] --fullSourceMap

# 一些 npm 包并不适合打包部署，这发生在这些包的内容可能会读取外部资源文件，添加 --external 可以将这些包排除在包内，这么做的同时你需要在 build 目录下重建 node_modules 目录，将这些外部包的内容和他们的依赖一起重新安装进来。
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
 
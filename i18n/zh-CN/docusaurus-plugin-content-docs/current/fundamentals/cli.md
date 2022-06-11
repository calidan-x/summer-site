---
sidebar_position: 100
---

# 命令行

本地启动调试命令 -s serve

```
summer -s --env [环境名]
```

打包命令 -b build

```
summer -b --env [环境名]
```

测试命令 -t test

```
summer -t --env [环境名]
```


```js title="在package.json中配置"
  "scripts": {
    "dev": "summer -s --env local",
    "test": "summer -t --env test",
    "build": "summer -b --env prod",
    "start": "node --enable-source-maps ./build/index.js"
  }
```
 
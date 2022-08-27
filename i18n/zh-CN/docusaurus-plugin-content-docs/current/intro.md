---
sidebar_position: 1
---

中文正在调整整理中...

# 介绍

Summer 的目标是提供一个安全高效易于学习使用的高质量企业级框架。

## 主要特点

- **愉快的编程体验**<br/>
  Summer 关心程序员的代码编写体验，将学习难度和编码难度降低，让你轻松完成开发工作。

- **运行时 TypeScript 请求验证**<br/>
  TypeScript在编译后会消去类型变成 JavaScript 代码，API数据请求的类型判断在其他 NodeJS 后端框架通常需要在请求的DTO上做额外标注，Summer在编译时可以读取并自动标注请求结构类型，省去了类型的重复标注。

- **简单 DTO 转换**<br/>
  后端开发会有大量的代码在做 DTO 转换，类似Java这样的开发语言碰到大对象常常要做大量的赋值，Summer提供了简单DTO转换方法。

- **自定义 Decorator**<br/>
  除内置的 Decorator 外，Summer还提供了简易的 Decorator 创建方法，让你轻松写出 @RequireLogin 之类的功能，让你的代码更优雅。

- **一次编译部署多种类型服务器**<br/>
  Summer 使用 ESBuild 打包，一次性打包成一个可执行文件，让部署变得更简单。这个兼容的可执行文件不仅可以使用 node 命令启动运行在Linux服务器或 K8S 集群，还可以直接部署到 Serverless 平台(AWS Lambda/阿里云FC)，不需要修改任何配置。



## 创建项目

```bash
npm create summer@latest
```

## 启动

```bash
cd [ProjectName]
npm install
npm run serve
```

:::note
Summer 需要 Nodejs 16+
:::
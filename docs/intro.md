---
sidebar_position: 1
---

# 介绍

Summer 的目标是提供一个简单敏捷的适用于微服务与无服务（Serverless）的高质量企业级框架

## 主要特点

- 运行时 TypeScript 请求验证
  TypeScript在编译后会退去类型变成JavaScript代码，API数据请求的类型判断在其他NodeJS后端框架通常需要在请求的DTO上做额外标注照成大量代码冗余，Summer在编译时可以读取并自动标注请求结构类型，省去了类型的重复标注。

- 简单 DTO 转换
  后端开发会有大量的代码都是在做DTO转换，类似Java这样的开发语言碰到大对象常常要做大量的赋值，Summer提供了简单DTO转换方法。

- 自定义 Decorator
  除内置的 Decorator 外，Summer还提供了简易的 Decorator 创建方法，让你轻松写出 @RequireLogin 之类的功能，让你的代码更优雅。

- 一次编译部署多种类型服务器
  Summer使用ESBuild打包，一次性打包成一个可执行文件，让部署变得更简单。这个可执行文件不仅可以使用node命令启动还是可以直接放到Serverless平台(AWS Lambda/阿里云FC)，不需要修改任何配置。

## 创建项目

```bash
npm create summer@latest
```

## 启动

```bash
cd [ProjectName]
npm install
npm run dev
```

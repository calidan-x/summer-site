---
sidebar_position: 1
---

# Introduction
Summer aims to provide a high-quality, easy fast enterprise backend framework

## Main Features

- **Pleasure of Programming**<br/>
  Summer cares about coding experience, always easy to learn and easy to do.

- **Strict Runtime TypeScript Validation**<br/>
  TypeScript can be used for runtime request validation, this makes your backend more secure.

- **Simply DTO Conversion**<br/>
  Backend programming always deals with lots of DTO conversion, Summer provides 2 easy and safe functions for conversion.

- **Custom Decorator**<br/>
  Custom decorator in Summer can extract request params, do auth, method interception, modify request results and lots of powerful jobs.

- **One Complied Code, Deploy Everywhere**<br/>
  Summer use esbuild to pack code into ONE runnable js file. This compiled code is compatible to deploy in Kubernetes cluster or Serverless without changing any configuration.

- **Best Swagger Integration**<br/>
  Summer Swagger plugin utilizes runtime typescript to generate API documents ( OpenAPI 3.0.x ), this helps to simplify your code, a single line of code can generate a full document. The Swagger plugin works together with Summer core decorators that can read @Max() @Optional() or even database column comments in TypeORM.

## Create a New Project

```bash
npm create summer@latest
```

## Start Dev Server

```bash
cd [ProjectName]
npm install
npm run serve
```

:::note
Summer require Nodejs 16+
:::
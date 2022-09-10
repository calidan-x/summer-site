---
sidebar_position: 60
---

# 环境配置

Summer支持多环境配置

### 配置环境变量
在config目录下创建配置文件 **[环境名].config.ts**

**default.config.ts** 是所有环境都会读取的配置

最终配置是通过 **default.config.ts** 与 **[环境名].config.ts** 叠加混合得到的结果

例如在 default.config.ts 加入

```ts
export const MY_CONFIG = {
  var1: 'VAR1',
  var2: ['A1', 'B2']
}
```

在 local.config.ts 加入
```ts
export const MY_CONFIG = {
  var2: ['A1', 'C2'],
  var3: 3
}
```

那么local环境最终获取的结果就是
```ts
{
  var1: 'VAR1',
  var2: ['A1', 'C2'],
  var3: 3
}
```


### 获取环境变量

通过 @Config(key:string) 获取

```ts
import { Config, Controller, Get } from '@summer-js/summer'

@Controller
export class ConfigController {
  @Config('MY_CONFIG')
  myConfig

  @Get('/config')
  add() {
    console.log(this.myConfig)
  }
}
```

### 程序启动环境指定

```
summer serve --env [环境名]
```

:::note
指定环境名是一个可选参数，如果不指定则只读取 default.config.ts
:::

常见的环境名

| 环境名  | 说明  |  配置文件命名 |
|---|---|---|
| local | 本地配置（设置git忽略） | config/local.config.ts |
| dev | 线上开发配置 | config/dev.config.ts |
| test | 测试配置 | config/test.config.ts |
| pp/pre | 线上预发布配置 | config/pre.config.ts |
| prod/p | 线上生产配置 | config/prod.config.ts |


 

### 在程序中获取当前配置环境
```
process.env.SUMMER_ENV
```

### 调用方法获取配置

并不是所有程序执行的位置都适用于注入写法，框架还提供了调用函数获取的方式

```ts
import { getConfig } from '@summer-js/summer'

console.log(getConfig())
console.log(getConfig("SERVER_CONFIG"))
```
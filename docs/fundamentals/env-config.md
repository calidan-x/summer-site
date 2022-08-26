---
sidebar_position: 60
---

# Env Config
Summer support multi-environment configs

### Config variable in different env
create a file named **[ENV_NAME].config.ts** in **src/config** folder

**default.config.ts** is a basic config that will be read in every Env

The final config is merged by **default.config.ts** and **[ENV_NAME].config.ts**

For example in default.config.ts writes

```ts
export const MY_CONFIG = {
  var1: 'VAR1',
  var2: ['A1', 'B2']
}
```

in local.config.ts writes
```ts
export const MY_CONFIG = {
  var2: ['A1', 'C2'],
  var3: 3
}
```

the final **local** config would be
```ts
{
  var1: 'VAR1',
  var2: ['A1', 'C2'],
  var3: 3
}
```


### Get Env Variable

User @Config([KEY]) 

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

### Specify an Env

``` title="package.json"
summer serve --env [ENV_NAME]
```

:::note
The --env is an optional param, **default.config.ts** always read
:::

Common ENV_NAME

| ENV_NAME  | Description  |  File Name |
|---|---|---|
| local | localhost config（should **.ignore** by git） | config/local.config.ts |
| dev | online dev | config/dev.config.ts |
| test | testing | config/test.config.ts |
| pp/pre | online pre-production | config/pre.config.ts |
| prod/p | production | config/prod.config.ts |


 

### Get Current ENV_NAME
```
process.env.SUMMER_ENV
```

### Get Current env Config API 

Not all code run in class, fetch env var cannot always inject by @Config(), call getConfig() works in function code.

```ts
import { getConfig } from '@summer-js/summer'

console.log(getConfig("SERVER_CONFIG"))
```
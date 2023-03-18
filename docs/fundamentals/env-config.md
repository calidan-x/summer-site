---
sidebar_position: 60
---

# Multi-Env Config
Summer support multi-environment configs

### Setup a new env

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

User **EnvConfig<'KEY', Type = any>)** inject to Controller property or call **getEnvConfig(key?:string)**

```ts
import { Config, Controller, Get, getEnvConfig } from '@summer-js/summer'

@Controller
export class ConfigController {

  myConfig: EnvConfig<'MY_CONFIG'>

  @Get('/config')
  add() {
    console.log(this.myConfig)
    console.log(getEnvConfig("MY_CONFIG"))
  }
}
```

### Specify an Env

``` title="package.json"
summer serve --env [ENV_NAME]
```


Common ENV_NAME

| ENV_NAME  | Description  |  File Name |
|---|---|---|
| local | localhost config | config/local.config.ts |
| dev |  dev | config/dev.config.ts |
| test | testing | config/test.config.ts |
| pp/pre | pre-production | config/pre.config.ts |
| prod/p | production | config/prod.config.ts |


### Get Current ENV_NAME
```
process.env.SUMMER_ENV
```



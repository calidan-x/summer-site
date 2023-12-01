---
sidebar_position: 90
---

# IORedis

### Install

```shell
npm install ioredis
npm install @summer-js/redis
```

### Config

```ts title="default.config.ts"
import { RedisConfig } from '@summer-js/redis'

export const REDIS_CONFIG: RedisConfig = {
  port: 6379,
  host: '127.0.0.1'
}
```


### Implement
```ts 
import { Controller, Get } from '@summer-js/summer'
import { RedisClient } from '@summer-js/redis'

@Controller('/redis')
export class RedisController {
  // auto-injection
  redisClient: RedisClient

  @Get('/redis-set')
  async setKey() {
    this.redisClient.set('key', 'value')
  }
}
```
  
### Multi Clients
```ts 
import { Controller, Get } from '@summer-js/summer'
import { RedisClient } from '@summer-js/redis'

@Controller('/redis')
export class RedisController {
 
  redisClient: RedisClient
  redisClient2: RedisClient<'Client2'>

  @Get('/redis-set')
  async setKey() {
    this.redisClient2.set('key', 'value')
  }
}
```
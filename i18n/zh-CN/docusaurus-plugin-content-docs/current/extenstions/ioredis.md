---
sidebar_position: 90
---

# IORedis

### 安装

```shell
npm install ioredis
npm install @summer-js/redis
```

### 配置

```ts title="default.config.ts"
import { RedisConfig } from '@summer-js/redis'

export const REDIS_CONFIG: RedisConfig = {
  port: 6379,
  host: '127.0.0.1'
}
```


### 使用
```ts 
import { Controller, Get } from '@summer-js/summer'
import { RedisClient } from '@summer-js/redis'

@Controller('/redis')
export class RedisController {
  // 自动注入
  redisClient: RedisClient

  @Get('/redis-set')
  async setKey() {
    this.redisClient.set('key', 'value')
  }
}
```
  
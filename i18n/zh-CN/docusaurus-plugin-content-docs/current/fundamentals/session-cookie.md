---
sidebar_position: 72
---

#  Cookie & Session

###  使用 `Cookie` 设置或读取 Cookie


|  Method     |
|  ----       |
|  Cookie.set(key: string, value: string, options: CookieSerializeOptions) |
|  Cookie.get(key: string) |
|  Cookie.clear(key: string) |
|  Cookie.getAll() |

```ts title="例子"
import { Cookie } from '@summer-js/summer'

// set cookie
Cookie.set('key','value',{ httpOnly: true })

// clear cookie
Cookie.clear('key')
```


### 配置 Session

```ts
import { SessionConfig } from '@summer-js/summer'

export const SESSION_CONFIG: SessionConfig = {
  // highlight-next-line
  // set expire time to 60 seconds
  // highlight-next-line
  expireIn: 60

  // mode?: 'Cookie' | 'Header'
  // sessionName?: string
  // cookieOptions?: CookieSerializeOptions
}

```

### 使用 `Session` 设置 session 值

|  Method     |
|  ----       |
|  Session.set(key: string, value: string) |
|  Session.get(key: string) |
|  Session.clear() |
|  Session.getAll() |
|  Session.setStorage({ storage: { <br/> &nbsp; &nbsp;save: (sessionId: string, key: string, value: any) => void <br/> &nbsp; &nbsp;load: (sessionId: string) => any <br/> &nbsp; &nbsp;clear: (sessionId: string) => any <br/> &nbsp; &nbsp;expire: (sessionId: string, expireIn: number) => void <br/> }}) |


```ts title="例子"
import { Session } from '@summer-js/summer'

@Post('/set-session')
setSession() {
  Session.set('key','value')
}

```

:::note
Session 在不断接收到请求的时候会自动延长时间，所以用户一直使用会永不过期
:::

### 自定义Session存储

默认情况下，session 不支持分布式多台服务器部署。可以修改 session 的存储方法支持。 

以下给出了使用 Redis 存储 session 数据的例子
```ts
import { Controller, Get, PostConstruct, Session } from '@summer-js/summer'
import { RedisClient } from '@summer-js/redis'

@Controller('/redis-session')
export class RedisSessionController {
  redisClient: RedisClient

  @PostConstruct
  init() {
    // highlight-start
    Session.setStorage({
      save: async (sessionId, key, value) => {
        const sessionData = JSON.parse((await this.redisClient.get(sessionId)) || '{}')
        sessionData[key] = value
        await this.redisClient.set(sessionId, JSON.stringify(sessionData))
      },
      load: async (sessionId) => {
        const sessionData = await this.redisClient.get(sessionId)
        if (sessionData) {
          return JSON.parse(sessionData)
        }
        return {}
      },
      clear: async (sessionId) => {
        await this.redisClient.del(sessionId)
      },
      expire: async (sessionId, expireIn) => {
        await this.redisClient.expire(sessionId, expireIn)
      }
    })
    // highlight-end
  }

  @Get('/set-session')
  async setSession() {
    await Session.set('id', 1)
  }

  @Get('/get-session')
  async getSession() {
    return await Session.get('id')
  }
}
```


### SessionId 与客户端通信

默认的情况下，Summer 使用 Cookie 存储 session-id，Cookie 是一种简单的配置方法，但是存在跨域问题。让 Cookie 支持跨域，你需要打开在 **SERVER_CONFIG** 中打开 **cors**, 在 **SESSION_CONFIG** 中设置 **cookieOptions** 为 { httpOnly: true, sameSite: 'none', secure: true }

或者你可以选择 **Header** 模式, 在 **SESSION_CONFIG** 设置 **mode** 为 **Header**，在 **SERVER_CONFIG** 中打开 **cors**, 客户度在请求头部接收到 header(SUMMER_SESSION) 时需要存储下来，在之后的请求头部将 SessionId 带上.
 
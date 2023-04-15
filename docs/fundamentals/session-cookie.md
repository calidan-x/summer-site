---
sidebar_position: 72
---

#  Cookie & Session

###  Use `Cookie` to get and set cookie


|  Method     |
|  ----       |
|  Cookie.set(key: string, value: string, options: CookieSerializeOptions) |
|  Cookie.get(key: string) |
|  Cookie.clear(key: string) |
|  Cookie.getAll() |

```ts title="Example"
import { Cookie } from '@summer-js/summer'

// set cookie
Cookie.set('key','value',{ httpOnly: true })

// clear cookie
Cookie.clear('key')
```


### Config Session

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

### Use `Session` to get and set session object


|  Method     |
|  ----       |
|  Session.set(key: string, value: string) |
|  Session.get(key: string) |
|  Session.clear() |
|  Session.getAll() |
|  Session.setStorage({ storage: { <br/> &nbsp; &nbsp;save: (sessionId: string, key: string, value: any) => void <br/> &nbsp; &nbsp;load: (sessionId: string) => any <br/> &nbsp; &nbsp;clear: (sessionId: string) => any <br/> &nbsp; &nbsp;expire: (sessionId: string, expireIn: number) => void <br/> }}) |


```ts title="Example"
import { Session } from '@summer-js/summer'

@Post('/set-session')
setSession() {
  Session.set('key','value')
}

```

:::note
Each sessions will extend expiration time when encounter a new request.
:::

### Custom session storage

By default session not supported by multi-server deployment. However, you can change session storage method to support it.

The following example show how to store session value in redis
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


### SessionId communication with client

 
By default Summer set Cookie to store session-id for client like a browser, Cookie can make session setup easily. However the cookie method meets Cors problem, to correct the problem, you should turn on **cors** in **SERVER_CONFIG**, set **cookieOptions** to { httpOnly: true, sameSite: 'none', secure: true } in **SESSION_CONFIG**

Or, you can switch to **Header** mode, set **mode** to **Header** in **SESSION_CONFIG** and turn on **cors** in **SERVER_CONFIG**, the client should store session-id from header(SUMMER_SESSION) and send it back in later requests.
 
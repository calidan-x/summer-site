---
sidebar_position: 72
---

# Session & Cookie

用 `@Cookie` 获取 Cookie

设置cookie或清除cookie

```ts
import { setCookie, clearCookie } from '@summer-js/summer'

// 设值cookie
setCookie({ name: 'my-cookie', value: 'val', httpOnly: true })

// 清除cookie
clearCookie('my-cookie')
```


在default.config.ts 配置Session，expireIn 单位为秒

```ts
import { SessionConfig } from '@summer-js/summer'

export const SESSION_CONFIG: SessionConfig = {
  // 设值10分钟的session过期时间
  expireIn: 60 * 10,
  // 可选，修改session的cookie key值，默认为 SUMMER_SESSION
  cookieName:"APP_SESSION"
}

```

使用 `@Session` 获取session对象，然后给session设值，session对每个用户是独立的存储

```ts

@Post('/session')
addSession(@Session session: any) {
  session.key = "value";
}

```

:::note
Session配置中的过期时间是session一直不访问的时间，不是首次访问的时间，也就是说每次访问都会续期，直到长时间访问才会过期
:::

:::caution
当前的Session还不支持分布式服务器！
:::
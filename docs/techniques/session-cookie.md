---
sidebar_position: 4
---

# Session & Cookie

用过 `@Cookie` 获取 Cookie

设置cookie或清除cookie

```ts
import { setCookie, clearCookie } from '@summer-js/summer'


setCookie({ name: 'my-cookie', value: 'val', httpOnly: true })
clearCookie('my-cookie')
```


在default.config.ts 配置Session

```ts
import { SessionConfig } from '@summer-js/summer'

export const SESSION_CONFIG: SessionConfig = {
  expireIn: 5
}

```

使用 `@Session` 获取session对象

Session 内容修改
```ts
session.key = value;
```

:::note
Session配置中的过期时间是session一直不访问的时间，不是首次访问的时间，也就是说每次访问都会续期，直到长时间访问才会过期
:::
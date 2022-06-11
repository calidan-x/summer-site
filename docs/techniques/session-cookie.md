---
sidebar_position: 40
---

# Session & Cookie

Use `@Cookie` to get Cookie in controller methods.


set cookie value and clear cookie

```ts
import { setCookie, clearCookie } from '@summer-js/summer'

// set cookie
setCookie({ name: 'my-cookie', value: 'val', httpOnly: true })

// clear cookie
clearCookie('my-cookie')
```


config session

```ts
import { SessionConfig } from '@summer-js/summer'

export const SESSION_CONFIG: SessionConfig = {
  // highlight-next-line
  // set expire time to 10 mins
  // highlight-next-line
  expireIn: 60 * 10
}

```

Use `@Session` to get session object

```ts

@Post('/session')
addSession(@Session session: any) {
  session.key = "value";
}

```

:::note
Session will extend expiration time with each request.
:::

:::caution
Session not supported by multi-server deploy.
:::
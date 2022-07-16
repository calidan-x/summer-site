---
sidebar_position: 70
---

# Middleware

Middleware is used to intercept every request before and after controllers.

![](/img/middleware.svg)

```ts title="catch all exception and return error message Server Error"
import { Middleware, Context } from '@summer-js/summer';

@Middleware({ order: 0 })
export class AuthMiddleware {
  async process(ctx: Context, next: any) {
    try {
      await next();
    } catch (err) {
      console.log(err);
      ctx.response.statusCode = 500;
      ctx.response.body = 'Server Error';
    }
  }
}
```


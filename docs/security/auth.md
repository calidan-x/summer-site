---
sidebar_position: 1
---

# Auth

Auth can be done in the following 2 ways.


### By Custom Decorator

```ts title="Develop a @RequireLogin decorator"
import { Controller, createClassAndMethodDecorator, Get, Put } from '@summer-js/summer'
import jwt from 'jsonwebtoken'

export const RequireLogin = createClassAndMethodDecorator(async (ctx, invokeMethod?) => {
  const token = ctx.request.headers['authentication']
  try {
    jwt.verify(token, 'xxxxxxxx')
    return await invokeMethod(ctx.invocation.params)
  } catch (e) {
    ctx.response.statusCode = 401
    ctx.response.body = 'Unauthorized'
  }
})

@Controller
// highlight-next-line
@RequireLogin
export class LoginController {
  @Get('/me')
  info() {}

  @Put('/me')
  update() {}
}

@Controller
export class LoginController2 {
  @Get('/users/:id')
  userInfo() {}

  // highlight-next-line
  @RequireLogin
  @Put('/userinfo')
  update() {}
}
```


### By Middleware

```ts
import { Middleware, Context } from '@summer-js/summer';
import jwt from 'jsonwebtoken';

@Middleware({ order: 0 })
export class AuthMiddleware {
  async process(ctx: Context, next: any) {
  const token = ctx.request.headers['authentication'];
  try {
    jwt.verify(token, 'xxxxxxxx');
    await next();
  } catch (e) {}
    throw new Error('Not Login');
  }
}
```




 
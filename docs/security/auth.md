---
sidebar_position: 1
---

# Auth

Auth can be done in the following 2 ways.


### By Custom Decorator

```ts title="Develop a @RequireLogin decorator"
import { Controller, createClassAndMethodDecorator, Get } from '@summer-js/summer';
import jwt from 'jsonwebtoken';

export const RequireLogin = createClassAndMethodDecorator(async (ctx, invokeMethod?) => {
  const token = ctx.request.headers['authentication'];
  try {
    jwt.verify(token, 'xxxxxxxx');
    await invokeMethod()
  } catch (e) {
     throw new Error('Not Login');
  }
});

@Controller
@RequireLogin
export class AppController {
  @Get('/userinfo')
  userInfo() {}
}


@Controller
export class UserController {
  @Get('/users/:id')
  userInfo() {}

  @RequireLogin
  @Put('/userinfo')
  userInfo() {}
}
```


### By Middleware

```ts
import { Middleware, Context } from '@summer-js/summer';
import jwt from 'jsonwebtoken';

@Middleware({ order: 0 })
export class ErrorMiddleware {
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




 
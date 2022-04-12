---
sidebar_position: 70
---

# 中间件

中间件常用于错误拦截，路径区分

```ts title="对所有程序执行发生的异常统一拦截，返回Server Error"
import { Middleware, Context } from '@summer-js/summer';

@Middleware({ order: 0 })
export class ErrorMiddleware {
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


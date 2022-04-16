---
sidebar_position: 70
---

# 中间件

中间件是拦截所有请求重要手段，Summer的中间件使用的是洋葱圈模型，即在最前端拦截请求，亦可以获取并修改Controller处理的结果

![](/img/middleware.jpg)

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


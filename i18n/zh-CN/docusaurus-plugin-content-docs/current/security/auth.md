---
sidebar_position: 1
---

# Auth

请求认证可以通过以下2种方式实现

### 使用中间件拦截

```ts
import { Middleware, Context } from '@summer-js/summer';

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


### 使用自定义Decorator处理

详细参考

[创建classmethod-decorator](/docs/fundamentals/custom-decorator#创建classmethod-decorator)

[创建方法参数-decorator](/docs/fundamentals/custom-decorator#创建方法参数-decorator)
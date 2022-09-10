---
sidebar_position: 54
---

# 请求上下文
 
Summer 会在每次请求创建一个 Context 对象记录请求信息，Context 对象存储了 请求信息，返回信息，cookie，会话，方法调用信息。你可以在任何代码中获取并利用其内容。

Context 中的 **context.response** 能直接被修改以此改变请求返回的头部信息。

Context 可以很容易的被获取到，Summer定义的一些接口方法会以传参的形式传入ctx，你也可以使用 **getContext()** Api 来获取当前的请求上下文.
 

### 获取 Context

```ts
import { Context, Controller, Ctx, Get } from '@summer-js/summer'

@Controller
export class ContextController {
  @Get('/context')
  context(@Ctx context: Context) {
    // 或者使用 const context = getContext()
    console.log(context)
  }
}
```


```ts title="Output log"
{
  request: {
    method: 'GET',
    path: '/context',
    queries: {},
    headers: {
      host: '127.0.0.1:8801',
      connection: 'keep-alive',
      'cache-control': 'max-age=0',
      'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'sec-fetch-site': 'none',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      cookie: 'locale=en-us'
    },
    body: '',
    pathParams: undefined
  },
  response: { statusCode: 0, headers: {}, body: undefined },
  cookies: { locale: 'en-us' },
  session: {},
  data: {},
  invocation: { class: 'ContentController', method: 'context', params: undefined }
}
```

### Alter Response 

```ts title="src/controller/ContentController.ts"
import { AutoInject, Controller, Get, getContext } from '@summer-js/summer'

@Controller
export class ContextController {
  @Get('/context')
  context() {
    const context = getContext()
    // highlight-next-line
    context.response.headers['content-type'] = 'text/plain'

    // 尽管controller 方法返回了 'hello winter',
    // 设置context的内容能有更高的优先级，所以这里会返回 'hi Summer'
    // 这可以让你再装饰器或某段代码中通过修改context.response达到最终修改目的，而不受controller的返回值影响
    // highlight-next-line
    context.response.body = 'hi Summer'
    return 'hello winter'
  }
}

```

```ts title="GET http://127.0.0.1:8801/local-service/context"
hi Summer
```

:::note 
Set context.response.headers, prop key will be converted to letter uppercase format automatically. 'context-type' => 'Content-Type'
:::

### Passing Custom Data

The content object has a **data** property that allows you to store and carry data during a whole request period. 

```ts
import { Middleware, Context, ValidationError, NotFoundError, ResponseError, Logger } from '@summer-js/summer'

@Middleware({ order: 0 })
export class DataMiddleware {
  async process(ctx: Context, next: any) {
    // highlight-next-line
    ctx.data.customData = 'abc'
    await next()
  }
}

// then you can access ctx.data.customData in custom decorators / controllers
```
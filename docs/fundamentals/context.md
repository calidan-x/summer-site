---
sidebar_position: 54
---

# Context

Summer creates a **Context** object at the beginning of each request, context store request/response/cookie/session/invocation information that can be utilized in your code.

**context.response** can be modify to alter response headers / content-type...

Context can be received easily from pass-in param or call **getContext()** Api.
 

### Receive Context

```ts
import { Context, Controller, Ctx, Get } from '@summer-js/summer'

@Controller
export class ContextController {
  @Get('/context')
  context(@Ctx context: Context) {
    // or const context = getContext()
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
@AutoInject
export class ContextController {
  @Get('/context')
  context() {
    const context = getContext()
    // highlight-next-line
    context.response.headers['content-type'] = 'text/plain'

    // although the controller return 'hello winter',
    // set context response content has a higher priority,
    // this take advantage of setting response content in custom decorator or middleware.
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
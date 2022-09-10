---
sidebar_position: 32
---

# 方法拦截

### 请求拦截

检查头部的 access-key

```ts
import { Controller, Get, createClassAndMethodDecorator, ResponseError } from '@summer-js/summer'

const AuthAccessKey = createClassAndMethodDecorator(async (ctx, invokeMethod) => {
  if (ctx.request.headers['access-key'] === 'xxxxxx') {
    return await invokeMethod(ctx.invocation.params)
  }
  throw new ResponseError(403, 'Forbidden')
})

@Controller
export class AppController {

  @AuthAccessKey
  @Get('/access')
  info() {
    return "it's works"
  }
}
```


### 通常方法拦截

打印调用日志

```ts
import { AutoInject, Controller, createClassAndMethodDecorator, Get, Logger, Query, Service } from '@summer-js/summer'

const AccessLog = createClassAndMethodDecorator(async (ctx, invokeMethod) => {
  Logger.debug('call ' + ctx.invocation.className + '.' + ctx.invocation.methodName + '() with', ctx.invocation.params)
  return await invokeMethod(ctx.invocation.params)
})

@Service
@AccessLog
class InvokeService {
  getInfo(info: string) {
    return 'info: ' + info
  }
}

@Controller
@AccessLog
export class ContextController {
  invokeService: InvokeService

  @Get('/invoke')
  info(@Query q: string) {
    return q
  }

  @Get('/invoke2')
  info2() {
    return this.invokeService.getInfo('summer works')
  }
}
```

```shell title="GET http://127.0.0.1:8801/local-service/invoke2"
[2022-08-25 20:51:21] [DEBUG] call ContextController.info2() with [] 
[2022-08-25 20:51:21] [DEBUG] call InvokeService.getInfo() with [ 'summer works' ] 
```
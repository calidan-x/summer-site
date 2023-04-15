---
sidebar_position: 34
---

# 错误处理

### 创建异常返回

实例化一个 **ResponseError** 并将其抛出。

```ts
import { Controller, Get, ResponseError } from '@summer-js/summer'

@Controller
export class AppController {
  @Get('/error')
  info() {
    // highlight-next-line
    throw new ResponseError(400, { message: 'error' })
    return "it's works"
  }
}
```

推荐开发过程中能直接做出了一个错误列表存储在一个文件中。

```ts title="src/errors.ts"
import { ResponseError } from '@summer-js/summer'

export const AppError = {
  LOGIN_FAIL: new ResponseError(400, { message: 'login failed' }),
  REGISTER_FAIL: new ResponseError(400, { message: 'register failed' }),
  RESET_PASSWORD_FAIL: new ResponseError(400, { message: 'reset password failed' })
}
```

```ts title="src/controller/AppController.ts"
import { Controller, Get } from '@summer-js/summer'
import { AppError } from '../error'

@Controller
export class AppController {
  @Get('/login')
  login() {
    // highlight-next-line
    throw AppError.LOGIN_FAIL
    return 'done'
  }
}
```


## 自定义异常返回格式

你可以通过以下2种方式调整错误返回格式

### 使用 ErrorHandler 处理

```ts title="src/error/ErrorHandler.ts"
import { OtherErrors, E, ErrorHandler, Logger, NotFoundError, ValidationError } from '@summer-js/summer'

@ErrorHandler
export class HandleError {
  // highlight-next-line
  @E(NotFoundError)
  notFound() {
    return { statusCode: 404, body: 'Page Not Found ~' }
  }

  // highlight-next-line  
  @E(ValidationError)
  validateFail(err: ValidationError) {
    return { statusCode: 404, body: err.body.errors }
  }

  // highlight-next-line
  @E(OtherErrors)
  default(err) {
    Logger.error(err)
    return { statusCode: 500, body: 'Some Error Happen' }
  }
}
```


### 使用 Middleware 处理

```ts title="src/error/ErrorMiddleware.ts"
import { Middleware, Context, ValidationError, NotFoundError, ResponseError, Logger } from '@summer-js/summer'

@Middleware({ order: 0 })
export class ErrorMiddleware {
  async process(ctx: Context, next: any) {
    try {
      await next()
    } catch (err) {
      // highlight-next-line
      if (err instanceof ValidationError) {
        throw new ResponseError(400, { msg: err.body.message, err: err.body.errors })
      // highlight-next-line
      } else if (err instanceof NotFoundError) {
        throw new ResponseError(400, { msg: 'Page Not Found!' })
      // highlight-next-line
      } else if (err instanceof ResponseError) {
        throw err
      } else {
        Logger.error(err)
        throw new ResponseError(500, { msg: 'Server Error' })
      }
    }
  }
}
```

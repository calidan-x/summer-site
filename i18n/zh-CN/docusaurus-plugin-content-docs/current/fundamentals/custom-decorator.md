---
sidebar_position: 40
---

# 自定义 Decorator

Summer 提供了轻松自建 Decorator 的能力

### 相关创建方法

|方法|说明|用途|
|----|----|----|
|createParamDecorator|创建标记在方法参数前的Decorator|获取请求数据|
|createMethodDecorator|创建标记在method层级的Decorator|拦截方法，修改结果|
|createClassDecorator|创建标记在class层级的Decorator|拦截Controller的所有方法，修改结果|
|createClassAndMethodDecorator|创建标记在class和method层级的Decorator|拦截Controller的所有方法或单个方法，修改结果|
|createPropertyDecorator|创建标记在类属性上的Decorator|注入配置|

 

### 创建方法参数 Decorator

```ts
export const [DecoratorName] = createParamDecorator((ctx?, paramName?, arg1?, arg2?,...) => { return [value] });
```

``DecoratorName`` 是定义的装饰器名字<br/>
``ctx`` 是请求的上下文，里面包含请求的所有信息<br/>
``paramName`` 是调用方法被标记的传参的变量名<br/>
``arg1, arg2...`` 为自定义参数，在之后调用时候使用 @DecoratorName(arg1,arg2,...)<br/>



```ts title="例子：获取头部 AppVersion 信息"
import { Controller, createParamDecorator, Get } from '@summer-js/summer'

export const AppVersion = createParamDecorator((ctx) => {
  return ctx.request.headers['AppVersion']
})

@Controller
export class AppVersionController {
  @Get('/app/version')
  async version(@AppVersion version) {
    return version
  }
}
```

```ts title="例子：解析获取JWT Token中的uid"
import { Controller, createParamDecorator, Get } from '@summer-js/summer'
import jwt from 'jsonwebtoken'

export const Uid = createParamDecorator((ctx) => {
  const token = ctx.request.headers['authentication']
  try {
    const decoded = jwt.verify(token, 'xxxxxxxx')
    return decoded.uid
  } catch (e) {}
  return null
})

@Controller
export class JWTController {
  @Get('/userinfo')
  userinfo(@Uid uid: number) {
    return uid
  }
}
```

### 创建class/method Decorator

```ts
// 仅在方法上使用
export const [DecoratorName] = createMethodDecorator((ctx?, invokeMethod? , arg1?, arg2?,...) => { return [value] });
// 仅在类上使用
export const [DecoratorName] = createClassDecorator((ctx?, invokeMethod? , arg1?, arg2?,...) => { return [value] });
// 在类和方法上都能使用
export const [DecoratorName] = createClassAndMethodDecorator((ctx?, invokeMethod? , arg1?, arg2?,...) => { return [value] });
```

``DecoratorName`` 是定义的装饰器名字<br/>
``ctx`` 是请求的上下文，里面包含请求的所有信息<br/>
``invokeMethod`` 被调用的方法<br/>
``arg1, arg2...`` 为自定义参数，在之后调用时候使用 @DecoratorName(arg1,arg2,...)<br/>


:::info 
在class层级写Decorator是对class中的所有方法进行拦截
:::

```ts title="例子：开发 @RequireLogin 拦截未登录请求"
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


### 创建属性 Decorator
```ts
export const [DecoratorName] = createPropertyDecorator((config?, propertyName? , arg1?, arg2?,...) => { return [value] }); 
```

``DecoratorName`` 是定义的装饰器名字<br/>
``config`` 当前环境的配置<br/>
``propertyName`` 是定义的属性变量名字<br/>
``arg1, arg2...`` 为自定义参数，在之后调用时候使用 @DecoratorName(arg1,arg2,...)<br/>

```ts title="例子：从环境变量中读取MySQL的配置"
import { Controller, createPropertyDecorator, Get } from '@summer-js/summer'

export const MySQLConfig = createPropertyDecorator((config) => {
  return config['MySQL']
})

@Controller
export class ConfigInjectController {
  @MySQLConfig
  mysqlConfig

  @Get('/mysql-host')
  host() {
    return this.mysqlConfig.host
  }
}
```

```ts title="例子：获取城市列表"
import { Controller, createPropertyDecorator, Get } from '@summer-js/summer'

export const CityList = createPropertyDecorator(() => {
  return ['Shanghai', 'Tokyo', 'New York City']
})

@Controller
export class CityListController {
  @CityList
  cityList

  @Get('/cities')
  list() {
    return this.cityList
  }
}
```

## 更多例子

### 修改返回状态码
```ts
import { Controller, createMethodDecorator, Get } from '@summer-js/summer'

export const ResponseCode = createMethodDecorator(async (ctx, invokeMethod, code: number) => {
  ctx.response.statusCode = code
  return await invokeMethod(ctx.invocation.params)
})

@Controller
export class ResponseCodeController {
  @ResponseCode(404)
  @Get('/dog')
  userInfo() {
    return 'dog not exist'
  }
}
```

### 返回值缓存
```ts
import { AutoInject, Controller, createMethodDecorator, Get, PathParam, Service } from '@summer-js/summer'
import md5 from 'md5'

const CACHE = {}
export const Cache = createMethodDecorator(async (ctx, invokeMethod) => {
  const callParamHash = md5(JSON.stringify(ctx.invocation))
  if (CACHE[callParamHash] === undefined) {
    CACHE[callParamHash] = await invokeMethod(ctx.invocation.params)
  }
  return CACHE[callParamHash]
})

@Service
export class CacheService {
  @Cache()
  async cache(id) {
    return id + ':' + Date.now()
  }
}

@Controller
@AutoInject
export class CacheController {
  cacheService: CacheService

  @Get('/cache/:id')
  @Cache()
  async api(@PathParam id) {
    return id + ':' + Date.now()
  }

  @Get('/cache2/:id')
  async api2(@PathParam id) {
    return this.cacheService.cache(id)
  }
}
```

### 下载文件
```ts
import { Controller, createMethodDecorator, Get } from '@summer-js/summer'

export const DownLoadFile = createMethodDecorator(async (ctx, invokeMethod, fileName: string) => {
  ctx.response.headers['Content-Type'] = 'application/octet-stream'
  ctx.response.headers['Content-Disposition'] = `attachment; filename="${fileName}"`
  return await invokeMethod(ctx.invocation.params)
})

@Controller
export class DownloadController {
  @DownLoadFile('hello.txt')
  @Get('/download')
  download() {
    return 'Hello Summer'
  }
}
```


 
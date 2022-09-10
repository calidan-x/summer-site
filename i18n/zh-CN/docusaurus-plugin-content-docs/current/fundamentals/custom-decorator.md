---
sidebar_position: 40
---

# 自定义装饰器
 

自定义装饰器在Summer中是一项强大的功能，你可用它来拦截请求，验证登录信息，提取请求信息，修改返回code...

### 创建装饰器接口

|创建方法|可标记在哪里|用途|
|----|----|----|
|createParamDecorator|使用在Controller接口方法里|提取请求数据|
|createMethodDecorator|使用在方法上|方法拦截|
|createClassDecorator|使用在类上|拦截类中所有方法|
|createClassAndMethodDecorator|使用在类或方法上|拦截类中所有方法或单一方法|
|createPropertyDecorator|使用在属性上|属性注入|

 

### 创建方法参数装饰器

```ts
export const [DecoratorName] = createParamDecorator(
  (ctx?, paramName?, arg1?, arg2?,...) => {
    return [Value]
  }
)
```


**DecoratorName** 装饰器名字<br/>
**ctx** 请求上下文<br/>
**paramName** 在方法中的参数名字<br/>
**arg1, arg2...** 自定义参数 @DecoratorName(arg1,arg2,...)<br/>



```ts title="获取前端APP发来的头部'app-version'信息"
import { Controller, createParamDecorator, Get } from '@summer-js/summer'

// highlight-next-line
export const AppVersion = createParamDecorator((ctx) => {
  return ctx.request.headers['app-version']
})

@Controller
export class AppVersionController {
  @Get('/app/version')
  // highlight-next-line
  async version(@AppVersion version) {
    return version
  }
}
```

```ts title="解析JWT Token"
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
  userinfo(@Uid uid?: number) {
    return uid
  }
}
```

### 创建类/方法装饰器

```ts
// 只可以用在方法上
export const [DecoratorName] = createMethodDecorator(
  async (ctx?, invokeMethod? , arg1?, arg2?,...) => { 
    return await invokeMethod(ctx.invocation.params)  
  }
);

// 只可以用在类上，标记会拦截所有方法
export const [DecoratorName] = createClassDecorator(
  async (ctx?, invokeMethod? , arg1?, arg2?,...) => { 
    return await invokeMethod(ctx.invocation.params)  
  }
);

// 既可以用在类上，也可以在单一方法上，标记会拦截所有方法
export const [DecoratorName] = createClassAndMethodDecorator(
  async (ctx?, invokeMethod? , arg1?, arg2?,...) => { 
    return await invokeMethod(ctx.invocation.params)  
  }
);
```

**DecoratorName** 装饰器名字<br/>
**ctx** 请求上下文<br/>
**invokeMethod** 被执行的方法<br/>
**arg1, arg2...** 自定义参数 @DecoratorName(arg1,arg2,...)<br/>



```ts title="开发一个 @RequireLogin 装饰器"
import { Controller, createClassAndMethodDecorator, Get, Put } from '@summer-js/summer'
import jwt from 'jsonwebtoken'

// highlight-next-line
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


### 创建属性装饰器
```ts
export const [DecoratorName] = createPropertyDecorator(
  (config?, propertyName? , arg1?, arg2?,...) => {
    return [Value]
  }
); 
```

**DecoratorName** 装饰器名字<br/>
**config** 当前的配置<br/>
**propertyName** 属性的名字<br/>
**arg1, arg2...** 自定义参数 @DecoratorName(arg1,arg2,...)<br/>

```ts title="注入MySQL配置"
import { Controller, createPropertyDecorator, Get } from '@summer-js/summer'

// highlight-next-line
export const MySQLConfig = createPropertyDecorator((config) => {
  return config['MySQL_CONFIG']
})

@Controller
export class ConfigInjectController {
  // highlight-next-line
  @MySQLConfig
  mysqlConfig

  @Get('/mysql-host')
  host() {
    return this.mysqlConfig.host
  }
}
```

```ts title="注入城市列表"
import { Controller, createPropertyDecorator, Get } from '@summer-js/summer'

// highlight-next-line
export const CityList = createPropertyDecorator(() => {
  return ['Shanghai', 'Tokyo', 'New York City']
})

@Controller
export class CityListController {
  // highlight-next-line
  @CityList
  cityList

  @Get('/cities')
  list() {
    return this.cityList
  }
}
```

## 更多例子

### 改变HTTP请求返回码
```ts
import { Controller, createMethodDecorator, Get } from '@summer-js/summer'

// highlight-next-line
export const ResponseCode = createMethodDecorator(
  async (ctx, invokeMethod, code: number) => {
    ctx.response.statusCode = code
    return await invokeMethod(ctx.invocation.params)
  }
)

@Controller
export class ResponseCodeController {
  // highlight-next-line
  @ResponseCode(404)
  @Get('/dog')
  userInfo() {
    return '404 小狗走丢了'
  }
}
```

### 缓存返回值
```ts
import { AutoInject, Controller, createMethodDecorator, Get, Logger, PathParam, Service } from '@summer-js/summer'
import md5 from 'md5'

const CACHE = {}
// highlight-next-line
export const Cache = createMethodDecorator(async (ctx, invokeMethod, cacheTime: number) => {
  const callParamHash = md5(JSON.stringify(ctx.invocation))
  if (CACHE[callParamHash] === undefined) {
    CACHE[callParamHash] = await invokeMethod(ctx.invocation.params)
    Logger.info('Cache ' + CACHE[callParamHash] + ' in ' + cacheTime + 's')
    if (cacheTime) {
      setTimeout(() => {
        CACHE[callParamHash] = undefined
        Logger.info('Clear Cache')
      }, cacheTime)
    }
  }
  return CACHE[callParamHash]
})

@Service
export class CacheService {
  // highlight-next-line
  @Cache
  async cache(id) {
    return id + ':' + Date.now()
  }
}

@Controller
export class CacheController {
  cacheService: CacheService

  @Get('/cache/:id')
  // highlight-next-line
  @Cache(1000)
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

// highlight-next-line
export const DownLoadFile = createMethodDecorator(
  async (ctx, invokeMethod, fileName: string) => {
    ctx.response.headers['Content-Type'] = 'application/octet-stream'
    ctx.response.headers['Content-Disposition'] = `attachment; filename="${fileName}"`
    return await invokeMethod(ctx.invocation.params)
  }
)

@Controller
export class DownloadController {
  // highlight-next-line
  @DownLoadFile('hello.txt')
  @Get('/download')
  download() {
    return 'Hello Summer'
  }
}
```


 
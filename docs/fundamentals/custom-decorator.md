---
sidebar_position: 40
---

# Custom Decorator

Custom Decorator is a powerful function in Summer that can let you extract request params, do auth, method interception, modify request results, and more...

### Create APIs

|Create Method|Description|Usage|
|----|----|----|
|createParamDecorator|used in controller method param|extract request data|
|createMethodDecorator|used in method|method interception|
|createClassDecorator|used in  class|class methods interception|
|createClassAndMethodDecorator|used in class/method|class methods interception|
|createPropertyDecorator|used in property|inject config, init property data|

 

### Create Param Decorator

```ts
export const [DecoratorName] = createParamDecorator(
  (ctx?, paramName?, arg1?, arg2?,...) => {
    return [Value]
  }
)
```


**DecoratorName** decorator name<br/>
**ctx** request context<br/>
**paramName** param name defined in method<br/>
**arg1, arg2...** custom params used in decorator like @DecoratorName(arg1,arg2,...)<br/>



```ts title="Get the AppVersion value in request header"
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

```ts title="parse uid in JWT token"
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

### Create Class/Method Decorator

```ts
// only works in METHOD
export const [DecoratorName] = createMethodDecorator(
  async (ctx?, invokeMethod? , arg1?, arg2?,...) => { 
    return await invokeMethod(ctx.invocation.params)  
  }
);

// only works in CLASS
export const [DecoratorName] = createClassDecorator(
  async (ctx?, invokeMethod? , arg1?, arg2?,...) => { 
    return await invokeMethod(ctx.invocation.params)  
  }
);

// works in CLASS / METHOD
export const [DecoratorName] = createClassAndMethodDecorator(
  async (ctx?, invokeMethod? , arg1?, arg2?,...) => { 
    return await invokeMethod(ctx.invocation.params)  
  }
);
```

**DecoratorName** decorator name<br/>
**ctx** request context<br/>
**invokeMethod** method for invoking<br/>
**arg1, arg2...** custom param used in this decorator like @DecoratorName(arg1,arg2,...)<br/>


:::info 
Write a class decorator means intercept all it's methods
:::

```ts title="Develop a @RequireLogin decorator"
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


### Create Property Decorator
```ts
export const [DecoratorName] = createPropertyDecorator(
  (config?, propertyName? , arg1?, arg2?,...) => {
    return [Value]
  }
); 
```

**DecoratorName** decorator name<br/>
**config** current evn config<br/>
**propertyName** property name<br/>
**arg1, arg2...** custom param used in this decorator like @DecoratorName(arg1,arg2,...)<br/>

```ts title="read mysql config"
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

```ts title="read city list"
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

## More Example

### Alter Response Http Code
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
    return 'dog not exist'
  }
}
```

### Cache Return Value
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
@AutoInject
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

### Download File
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


 
---
sidebar_position: 40
---

# Custom Decorators

Custom Decorators is a powerful function in Summer that can let you extract request params, do auth, method interception, modify request results, and more...

### Create APIs

|Create Method|Description|Usage|
|----|----|----|
|createParamDecorator|create a decorator used in controller method param|extract request data|
|createMethodDecorator|create a decorator used in method|method interception|
|createClassDecorator|create a decorator used in  class|class methods interception|
|createClassAndMethodDecorator|create a decorator used in class/method|class methods interception|
|createPropertyDecorator|create a decorator used in property|inject config, init property data|

 

### Create Param Decorator

```ts
export const [DecoratorName] = createParamDecorator((ctx?, paramName?, arg1?, arg2?,...) => { return [value] });
```

**DecoratorName** decorator name<br/>
**ctx** request context<br/>
**paramName** param name defined in method<br/>
**arg1, arg2...**custom param used in this decorator like @DecoratorName(arg1,arg2,...)<br/>



```ts title="Get the AppVersion value in request header"
import { Controller, createParamDecorator, Get } from '@summer-js/summer';

export const AppVersion = createParamDecorator((ctx) => ctx.request.headers['AppVersion']);

@Controller
export class AppController {
  @Get('/version')
  version(@AppVersion version: string) {
    console.log(version);
  }
}
```

```ts title="parse uid in JWT token"
import { Controller, createParamDecorator, Get } from '@summer-js/summer';
import jwt from 'jsonwebtoken';

export const Uid = createParamDecorator((ctx) => {
  const token = ctx.request.headers['authentication'];
  try {
    const decoded = jwt.verify(token, 'xxxxxxxx');
    return decoded.uid;
  } catch (e) {}
  return null;
});

@Controller
export class AppController {
  @Get('/userinfo')
  userinfo(@Uid uid: number) {
    console.log(uid);
  }
}
```

### Create Class/Method Decorator

```ts
// only works in METHOD
export const [DecoratorName] = createMethodDecorator((ctx?, invokeMethod? , arg1?, arg2?,...) => { return [value] });
// only works in CLASS
export const [DecoratorName] = createClassDecorator((ctx?, invokeMethod? , arg1?, arg2?,...) => { return [value] });
// works in CLASS / METHOD
export const [DecoratorName] = createClassAndMethodDecorator((ctx?, invokeMethod? , arg1?, arg2?,...) => { return [value] });
```

**DecoratorName** decorator name<br/>
**ctx** request context<br/>
**invokeMethod** method for invoking<br/>
**arg1, arg2...** custom param used in this decorator like @DecoratorName(arg1,arg2,...)<br/>


:::info 
Write a class decorator means intercept all methods
:::

```ts title="Develop a @RequireLogin decorator"
import { Controller, createClassAndMethodDecorator, Get } from '@summer-js/summer';
import jwt from 'jsonwebtoken';

export const RequireLogin = createClassAndMethodDecorator(async (ctx, invokeMethod?) => {
  const token = ctx.request.headers['authentication'];
  try {
    jwt.verify(token, 'xxxxxxxx');
    await invokeMethod()
  } catch (e) {
     throw new Error('Not Login');
  }
});

@Controller
@RequireLogin
export class AppController {
  @Get('/userinfo')
  userInfo() {}
}


@Controller
export class UserController {
  @Get('/users/:id')
  userInfo() {}

  @RequireLogin
  @Put('/userinfo')
  userInfo() {}
}
```


### Create Property Decorator
```ts
export const [DecoratorName] = createPropertyDecorator((config?, propertyName? , arg1?, arg2?,...) => { return [value] }); 
```

**DecoratorName** decorator name<br/>
**config** current evn config<br/>
**propertyName** property name<br/>
**arg1, arg2...** custom param used in this decorator like @DecoratorName(arg1,arg2,...)<br/>

```ts title="ead mysql config"
import { Controller, createPropertyDecorator, Get } from '@summer-js/summer';

export const MySQLConfig = createPropertyDecorator((config) => {
  return config['MySQL'];
});

@Controller
export class AppController {
  @MySQLConfig
  mysqlConfig;

  @Get('/user')
  userInfo() {
    console.log(this.mysqlConfig);
  }
}
```

```ts title="read city list"
import { Controller, createPropertyDecorator, Get } from '@summer-js/summer';

export const CityList = createPropertyDecorator(() => {
  return ["Shanghai", "Tokyo", "New York"];
});

@Controller
export class CityController {
  @CityList
  cityList;

  @Get('/cities')
  list() {
    console.log(this.cityList);
  }
}
```

## More Example

### Alter Response Http Code
```ts
export const ResponseCode = createMethodDecorator(async (ctx, invokeMethod, code: number) => {
  await invokeMethod();
  ctx.response.statusCode = code;
});

@Controller
export class AppController {
 
  @ResponseCode(400)
  @Get('/user')
  userInfo() {
      return ""
  }
}
```

### Cache Return Value
```ts
import { Controller, createMethodDecorator, Get } from '@summer-js/summer';

const CACHE = {};
export const Cache = createMethodDecorator(async (ctx, invokeMethod, key: string) => {
  if (CACHE[key] === undefined) {
    CACHE[key] = await invokeMethod();
  }
  return CACHE[key];
});

@Controller
export class TodoController {
  @Cache('TodoList')
  @Get('/todos')
  userInfo() {
    return ['Task 1', 'Task 2', 'Task '+ Math.ceil(Math.random()*10)];
  }
}
```

### Download File
```ts
import { Controller, createMethodDecorator, Get } from '@summer-js/summer';

export const DownLoadFile = createMethodDecorator(async (ctx, invokeMethod, fileName: string) => {
  await invokeMethod();
  ctx.response.headers['Content-Type'] = 'application/octet-stream';
  ctx.response.headers['Content-Type'] = `attachment; filename="${fileName}"`;
});

@Controller
export class AppController {
  @DownLoadFile('hello.txt')
  @Get('/download')
  download() {
    return 'Hello Summer';
  }
}
```


 
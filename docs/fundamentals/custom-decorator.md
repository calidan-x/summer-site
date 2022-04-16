---
sidebar_position: 40
---

# 自定义 Decorator

Summer 提供了轻松自建 Decorator 的能力

### 相关创建方法

|方法|说明|
|----|----|
|createParamDecorator|创建标记在方法参数前的Decorator|
|createMethodDecorator|创建标记在method层级的Decorator|
|createClassDecorator|创建标记在class层级的Decorator|
|createClassAndMethodDecorator|创建标记在class和method层级的Decorator|
|createPropertyDecorator|创建标记在类属性上的Decorator|

 

### 创建方法参数 Decorator

```ts
export const [DecoratorName] = createParamDecorator((ctx?, paramName?, arg1?, arg2?,...) => { return [value] });
```

``DecoratorName`` 是定义的装饰器名字<br/>
``ctx`` 是请求的上下文，里面包含请求的所有信息<br/>
``paramName`` 是调用方法被标记的传参的变量名<br/>
``arg1, arg2...`` 为自定义参数，在之后调用时候使用 @DecoratorName(arg1,arg2,...)<br/>



```ts title="例子：获取头部 AppVersion 信息"
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

```ts title="例子：解析获取JWT Token中的uid"
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
  version(@Uid uid: number) {
    console.log(uid);
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
import { Controller, createClassAndMethodDecorator, Get } from '@summer-js/summer';
import jwt from 'jsonwebtoken';

export const RequireLogin = createClassAndMethodDecorator(async (ctx, invokeMethod?) => {
  const token = ctx.request.headers['authentication'];
  try {
    jwt.verify(token, 'xxxxxxxx');
    // 调用原来的方法
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


### 创建属性 Decorator
```ts
export const [DecoratorName] = createPropertyDecorator((config?, propertyName? , arg1?, arg2?,...) => { return [value] }); 
```

``DecoratorName`` 是定义的装饰器名字<br/>
``ctx`` 是请求的上下文，里面包含请求的所有信息<br/>
``propertyName`` 是定义的属性变量名字
``arg1, arg2...`` 为自定义参数，在之后调用时候使用 @DecoratorName(arg1,arg2,...)<br/>

```ts title="例子：从环境变量中读取MySQL的配置"
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

```ts title="例子：获取城市列表"
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

## 更多例子

### 修改返回状态码
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

### 返回值缓存
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

### 下载文件
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


 
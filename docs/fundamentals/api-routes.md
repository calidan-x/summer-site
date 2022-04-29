---
sidebar_position: 10
---

# 控制器与API路由

```ts title="一个简单的API路由例子"
import { Controller, Get, Post } from '@summer-js/summer';

@Controller
export class TodoController {
  @Get('/todos')
  list() {
    return ['Learn Summer', 'Watch TV', 'Play Switch Game'];
  }

  @Post('/todos')
  add() {
    return 'add a todo';
  }
}
```

:::info Summer Decorator 的写法
大部分NodeJS的后端框架都需要在Decorator后加上()，Summer支持不写括号的方式，不写括号等同于写空括号。
:::

### 控制器与路由相关 Decorator

|  Decorator   | 作用  |
|  ----  | ----  |
| @Controller | API入口 |
| @Get | Get请求 |
| @Post | Post请求 |
| @Put | Put请求 |
| @Patch | Patch请求 |
| @Delete | Delete请求 |
| @Request | 所有类型的请求<br/>(如果有相同路径的其他精确请求方法，<br/>会优先匹配精确请求方法) |


### 接收请求数据

```ts
import { Controller, Get, PathParam } from '@summer-js/summer';

@Controller
export class TodoController {
  @Get('/todos/:id')
  detail(@PathParam id: number) {
    const todoList = ['Lean Summer', 'Watch TV', 'Play NS Game'];
    return todoList[id];
  }
}
```


### 请求数据相关 Decorator

|  Decorator   | 作用  |
|  ----  | ----  |
| @PathParam  | 获取路径参数值 |
| @Query  | 获取查询参数 |
| @Queries  | 获取所有参数对象 |
| @Body  | 获取请求Body |
| @Header  | 获取请求头信息 |
| @Ctx  | 获取请求上下文 |
| @RequestPath  | 获取请求路径 |
| @Cookie  | 获取Cookie值 |
| @Session  | 获取当前Session对象 |


### 请求参数类型转换

:::info 自动类型转换
Summer会根据Controller方法定义的参数类型自动转换数据类型，上述例子从请求路径获取的id如果改为string型，那么变量id即是string型
:::

```ts
import { Controller, Get, PathParam } from '@summer-js/summer';

@Controller
export class TodoController {
  @Get('/todos/:id')
  detail(@PathParam id: string) {
    // will output string
    console.log(typeof id);
  }
}
```


### 请求参数命名转换
如果请求的参数格式与接收变量命名不一致，可以使用传参方式转换

```ts
import { Controller, Get, Query } from '@summer-js/summer';

@Controller
export class TodoController {
  @Get('/todos')
  detail(@Query('todo_id') id: string) {
    const todoList = ['Lean Summer', 'Watch TV', 'Play NS Game'];
    return todoList[id];
  }
}
```





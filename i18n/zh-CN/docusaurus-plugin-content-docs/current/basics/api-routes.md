---
sidebar_position: 10
---

# API路由

:::info 在Summer中使用装饰器
大多数的NodeJS后端框架都小在装饰器后加上括号"()"，Summer支持不写括号的，不写括号等同于写空括号。
:::

### Restful API 路由相关装饰器

|  装饰器   | 使用说明  |
|  ----  | ----  |
| @Controller(prefixPath?: string) | API 入口 |
| @Get(path?: string) | GET 请求入口 |
| @Post(path?: string) | POST 请求入口 |
| @Put(path?: string) | PUT 请求入口 |
| @Patch(path?: string) | PATCH 请求入口 |
| @Delete(path?: string) | DELETE 请求入口 |
| @Request(path?: string) | 所有类型请求入口 |



### 请求信息提取装饰器

|  装饰器   | 使用说明  |
|  ----  | ----  |
| @PathParam(key?: string)  | 获取路径参数 |
| @Query(key?: string)  | 获取请求查询参数 |
| @Queries  | 获取所有查询参数 |
| @Body  | 获取请求 Body |
| @Header(key?: string)  | 获取 Header 参数 |
| @Context  | 获取请求上下文 |
| @RequestPath  | 获取请求路径 |
| @Cookie(key?: sting)  | 获取 Cookie |
| @Session  | 获取 Session 对象 |


### 一个简单的API路由例子

```ts title="src/controller/TodoController.ts"
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

```json title="GET http://127.0.0.1:8801/todos"
[
  "Learn Summer",
  "Watch TV",
  "Play Switch Game"
]
```



### API 路径前缀

API 路径前缀可以定义在 @Controller 第一个参数上, 若Controller方法的路径想忽略@Controller定义的前缀，可以在路径前加上 "**^**".

```ts title="src/controller/TodoController.ts"
import { Body, Controller, Delete, Get, PathParam, Post } from '@summer-js/summer'
import { Todo } from '../dto/request/Todo'

// highlight-next-line
@Controller('/v1')
export class TodoController {
  @Get('/todos')
  list() {}

  // highlight-next-line
  @Get('^/v2/todos')
  listV2() {
    console.log('Todo list V2')
  }

  @Get('/todos/:id')
  todo(@PathParam id: int) {}

  @Post('/todos')
  addTodo(@Body todo: Todo) {}

  @Delete('/todos/:id')
  deleteTodo(@PathParam id: int) {}
}
```



### 提取请求内容

```ts title="src/controller/TodoController.ts"
import { Controller, Get, PathParam } from '@summer-js/summer';

@Controller
export class TodoController {
  @Get('/todos/:id')
  // highlight-next-line
  todo(@PathParam id: number) {
    const todoList = ['Lean Summer', 'Watch TV', 'Play NS Game'];
    return todoList[id];
  }
}
```

### 自定义信息提取装饰器

```ts title="src/decorators.ts"
import { createParamDecorator } from '@summer-js/summer'

export const UserAgent = createParamDecorator((ctx) => ctx.request.headers['user-agent'])
export const RequestMethod = createParamDecorator((ctx) => ctx.request.method)
// same as @Query
export const MyQuery = createParamDecorator((ctx, paramName, key) => ctx.request.queries[key || paramName])
```

```ts title="src/controller/AppController.ts"
import { Controller, Get } from '@summer-js/summer'
import { UserAgent, RequestMethod, MyQuery } from '../decorators'

@Controller
export class AppController {
  @Get('/user-agent')
  // highlight-next-line
  userAgent(@UserAgent userAgent: string) {
    console.log(userAgent)
  }

  @Get('/request-method')
  // highlight-next-line
  method(@RequestMethod method: string) {
    console.log(method)
  }

  @Get('/query')
  // highlight-next-line
  info(@MyQuery('key') key2: string) {
    // ?key=123
    console.log(key2)
  }

  @Get('/query2')
  // highlight-next-line
  info2(@MyQuery key2: string) {
    // ?key2=123
    console.log(key2)
  }
}
```


### 请求数据类类型转换

:::info 自动类型转换
数据类型会根据你在方法中定义的参数进行转换
:::


```ts title="src/dto/request/todo.ts"
export class Todo {
  content: string
  isDone: boolean
}
```

```ts title="src/controller/TodoController.ts"
import { Body, Controller, Get, PathParam, Post } from '@summer-js/summer'
import { Todo } from '../dto/request/todo'

@Controller
export class TodoController {
  @Get('/todos/:id')
  todo(@PathParam id: string) {
    console.log(typeof id)
  }

  @Get('/tasks/:id')
  task(@PathParam id: number) {
    console.log(typeof id)
  }

  @Post('/todos')
  addTodo(@Body todo: Todo) {
    console.log(todo)
  }
}
```

```json title="GET http://127.0.0.1/todos/10"
string
```

```json title="GET http://127.0.0.1/tasks/10"
number
```


```json title="POST http://127.0.0.1/todos"
Post Data:
{
  "content": "Read Book",
  "isDone": false
}

控制台输出:
Todo { content: 'Read Book', isDone: false }
```

### 键值映射
下面的例子展示讲请求内容键值为 'todo_index' 转到变量 index 中。

```ts title="src/controller/TodoController.ts"
import { Controller, Get, Query } from '@summer-js/summer';

@Controller
export class TodoController {

  @Get('/todos')
  // highlight-next-line
  todo(@Query('todo_index') index: number) {
    const todoList = ['Lean Summer', 'Watch TV', 'Play NS Game'];
    return todoList[index];
  }
}

```

```json title="GET http://127.0.0.1:8801/todos?todo_index=1"
Watch TV
```


获取浏览器发来的头部信息 'user-agent'，因为其命名不是驼峰，所以可以使用映射的方式转换到userAgent变量上。
```ts title="src/controller/AppController.ts"
import { Controller, Get, Header } from '@summer-js/summer';

@Controller
export class AppController {
  @Get('/user-agent')
  // highlight-next-line
  detail(@Header('user-agent') userAgent: string) {
    return userAgent;
  }
}

```


```json title="GET http://127.0.0.1:8801/user-agent (by Chrome)"
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36
```


---
sidebar_position: 10
---

# API Route

### A Simple Routing Example

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

:::info Writing Summer Decorator
Most of NodeJS backend frameworks require to write parentheses "()" at the end of decorators even if there's no param pass in, ignore writing parentheses works in Summer.
:::

### Restful API Route Decorators

|  Decorator   | Usage  |
|  ----  | ----  |
| @Controller(prefixPath?: string) | API entry |
| @Get(path?: string) | Get request entry |
| @Post(path?: string) | Post request entry |
| @Put(path?: string) | Put request entry |
| @Patch(path?: string) | Patch request entry |
| @Delete(path?: string) | Delete request entry |
| @Request(path?: string) | All kind of request entry |



### API Prefix Path

API prefix path can be defined in @Controller, to ignore prefix path, add "**^**" at the beginning.

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



### Extract Request Data

```ts title="src/controller/TodoController.ts"
import { Controller, Get, PathParam } from '@summer-js/summer';

@Controller
export class TodoController {
  @Get('/todos/:id')
  // highlight-next-line
  detail(@PathParam id: number) {
    const todoList = ['Lean Summer', 'Watch TV', 'Play NS Game'];
    return todoList[id];
  }
}
```


### Extract Data Decorators

|  Decorator   | Usage  |
|  ----  | ----  |
| @PathParam  | get param in request path |
| @Query  | get query param |
| @Queries  | get all query params|
| @Body  | get request body |
| @Header  | get header |
| @Ctx  | get request context |
| @RequestPath  | get request path |
| @Cookie  | get request cookie |
| @Session  | get session object |



### Request Data Conversion

:::info Auto Type Conversion
Data will be converted into type as you defined in method params.
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

Console Output:
Todo { content: 'Read Book', isDone: false }
```

### Key Mapping
The following example shows how to map a query key from 'todo_index' to 'index'

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


Get user agent info from browser request
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


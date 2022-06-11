---
sidebar_position: 10
---

# API Route

```ts title="A simple route example"
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

:::info Writing Summer Decorator
Most of NodeJS backend frameworks require parentheses "()" at the end of decorators even if there's no param pass in, Summer can ignore writing parentheses if there's no param pass in.
:::

### Controller and API Route Decorators

|  Decorator   | Usage  |
|  ----  | ----  |
| @Controller | API entry |
| @Get | Get request entry |
| @Post | Post request entry |
| @Put | Put request entry |
| @Patch | Patch request entry |
| @Delete | Delete request entry |
| @Request | All kind of request entry |


### Extract Request Data

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


### Extract Request Data Decorators

|  Decorator   | Usage  |
|  ----  | ----  |
| @PathParam  | get param in request path |
| @Query  | get query param |
| @Queries  | get all query param|
| @Body  | get request body |
| @Header  | get header |
| @Ctx  | get request context |
| @RequestPath  | get request path |
| @Cookie  | get request cookie |
| @Session  | get session object |
| @File  | get uploaded file |


### Request Param Type Conversion

:::info Auto Type Conversion
Summer can auto convert data into type as you defined in method params.
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

  @Get('/my-todos/:id')
  myDetail(@PathParam id: number) {
    // will output number
    console.log(typeof id);
  }
}
```


### Request Params Key Conversion
The following example shows how to convert a query key from 'todo_id' to 'id'

```ts
import { Controller, Get, Query } from '@summer-js/summer';

@Controller
export class TodoController {
  @Get('/todos')
  detail(@Query('todo_id') id: number) {
    const todoList = ['Lean Summer', 'Watch TV', 'Play NS Game'];
    return todoList[id];
  }
}

// Get /todos?todo_id=1
// output "Watch TV"
```





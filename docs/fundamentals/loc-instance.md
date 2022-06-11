---
sidebar_position: 30
---

# Instance Injection


Class mark with **@Injectable** or **@Service** will be instanced and stored in a shared container.<br/>
**@Inject** can help inject the instance into property

```ts
import { Service } from '@summer-js/summer';

@Service
export class TodoService {
  async getTodos() {
    return ['Task 1', 'Task 2', 'Task 3'];
  }
}
```

```ts
import { Controller, Get, Inject } from '@summer-js/summer';
import { TodoService } from './../service/TodoService';

@Controller
export class TodoController {
  @Inject
  todoService: TodoService;

  @Get('/todos')
  list() {
    return this.todoService.getTodos();
  }
}
```

### Injection Decorators


|  Decorators  | Usage  |
|  ----  | ----  |
| @Service / @Injectable | Injectable class |
| @Inject | Inject to property |
| @AutoInject | Auto Injection |


### Auto Injection

:::tip
Instead of write each **@Inject**s one by one, Summer provide an **@AutoInject** decorator, which can let the class understand and inject all instances.
:::

```ts
import { Controller, Get, AutoInject } from '@summer-js/summer';
import { TodoService } from './../service/TodoService';

@AutoInject
@Controller
export class TodoController {

  // you don't need to write @Inject here
  todoService: TodoService;
  // and here ...
  service1: Service1;
  service2: Service2;
  service3: Service3;
  service4: Service4;

  @Get('/todos')
  list() {
    return this.todoService.getTodos();
  }
}
```

### Get Injectable Instance by Code

Not all code run in class method, if a simple function wish to get the injectable instance can call the following api.

```ts
import { getInjectable } from "@summer-js/summer"

const todoService = getInjectable(TodoService)
```
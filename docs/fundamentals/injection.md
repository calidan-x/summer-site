---
sidebar_position: 30
---

# Injection

Classes marked with **@Injectable** or **@Service** will be auto-collected by Summer.<br/>
**@Inject** can help inject the instance into the property.

:::note 
All injectable class instances are singletons
:::

### Injection Decorators / API


|  Decorators/API  | Usage  |
|  ----  | ----  |
| @Service / @Injectable | Injectable class |
| @Inject | Inject instance to property |
| @AutoInject | Auto injection |
| @Config | Inject config |
| @PostConstruct | Init method after construction |
| createPropertyDecorator | create a property injection decorator|


### Service Injection

```ts title="src/service/TodoService.ts"
import { Service } from '@summer-js/summer'

// highlight-next-line
@Service
export class TodoService {
  async getTodos() {
    return ['Task 1', 'Task 2', 'Task 3']
  }
}
```

```ts title="src/controller/TodoController.ts"
import { Controller, Get, Inject } from '@summer-js/summer'
import { TodoService } from './../service/TodoService'

@Controller
export class TodoController {
  // highlight-next-line
  @Inject
  todoService: TodoService

  @Get('/todos')
  list() {
    return this.todoService.getTodos()
  }
}
```



### Auto Injection

:::tip
Instead of writing each **@Inject**s one by one, use **@AutoInject** decorator for auto injection.
:::

```ts title="src/controller/TodoController.ts"
import { Controller, Get, AutoInject } from '@summer-js/summer'
import { TodoService } from './../service/TodoService'

// highlight-next-line
@AutoInject
@Controller
export class TodoController {

  // you don't need to write @Inject here
  todoService: TodoService
  // and here ...
  service1: Service1
  service2: Service2
  service3: Service3
  service4: Service4

  @Get('/todos')
  list() {
    return this.todoService.getTodos()
  }
}
```

### Get Injectable Instance API

Not all code run in class, if a simple function wishes to get the injectable instance, you can call **getInjectable()** api.

```ts
import { getInjectable } from "@summer-js/summer"

const todoService = getInjectable(TodoService)
```

### Configuration Injection

```ts title="src/controller/TodoController.ts"
import { Controller, Config, PostConstruct } from '@summer-js/summer'

@Controller
export class TodoController {
  @Config('SERVER_CONFIG')
  serverConfig

  // injection happen after constructor() method, use **@PostConstruct** to do init works
  // highlight-next-line
  @PostConstruct
  init() {
    console.log(this.serverConfig)
  }
}
```

For a more convenient way to access configuration, you can call **getConfig()** api in constructor method.

```ts title="src/controller/TodoController.ts"
import { Controller, getConfig } from '@summer-js/summer'

@Controller
export class TodoController {
  constructor() {
    // highlight-next-line
    const serverConfig = getConfig('SERVER_CONFIG')
    console.log(serverConfig)
  }
}
```


### Property Value Injection

```ts title="src/data/city.ts"
import { createPropertyDecorator } from '@summer-js/summer'

export const CityList = createPropertyDecorator((config) => {
  return ['Shanghai', 'New York City', 'London']
})
```

```ts title="src/controller/AppController.ts"
import { Controller, PostConstruct } from '@summer-js/summer'
import { CityList } from '../data/city'

@Controller
export class AppController {
  // highlight-next-line
  @CityList
  cityList: string[]

  @PostConstruct
  init() {
    console.log(this.cityList)
  }
}
```
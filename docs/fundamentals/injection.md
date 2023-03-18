---
sidebar_position: 30
---

# Injection

Classes marked with **@Injectable** or **@Service** will be auto-collected by Summer.<br/>

:::info
Summer injects Injectable/Service instances automatically (without writing any decorator).<br/>
All injectable class instances are singletons.
:::

### Injection Decorators / API


|  Decorators/API  | Usage  |
|  ----  | ----  |
| @Service / @Injectable | Injectable class |
| EnvConfig<'KEY', Type = any> | Inject config |
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
  todoService: TodoService

  @Get('/todos')
  list() {
    return this.todoService.getTodos()
  }
}
```


### Generic Service Injection
Summer supports generic class injection, generic params will pass to **constructor** for instance initialization.

```ts
import { Controller, Get, Service } from '@summer-js/summer'

class Dog {
  name: string
}

class Cat {
  name: string
}

@Service
export class AnimalService<AnimalType extends Dog | Cat> {
  animal: AnimalType

  constructor(AnimalType: any) {
      this.animal = new AnimalType()
  }
}
 
@Controller
export class GenericInjectController {
  // highlight-next-line
  dogService: AnimalService<Dog>
  // highlight-next-line
  catService: AnimalService<Cat>

  // code...
}
```


### Get Injectable Instance API

Not all code run in class, if a simple function wishes to get the injectable instance, you can call **getInjectable()** api.

```ts
import { getInjectable } from "@summer-js/summer"
import { TodoService } from "src/service/TodoService"
import { AnimalService } from "src/service/AnimalService"

// highlight-next-line
const todoService = getInjectable(TodoService)

// for generic class
// highlight-next-line
const dogService = getInjectable(AnimalService,[ Dog ])
// highlight-next-line
const catService = getInjectable(AnimalService,[ Cat ])

```


### Configuration Injection

```ts title="src/controller/TodoController.ts"
import { Controller, Config, PostConstruct } from '@summer-js/summer'

@Controller
export class TodoController { 
  serverConfig: EnvConfig<'SERVER_CONFIG'>

  // injection happen after constructor() method, use @PostConstruct to do init works
  // highlight-next-line
  @PostConstruct
  init() {
    console.log(this.serverConfig)
  }
}
```

For a more convenient way to access configuration, you can call **getEnvConfig()** api in constructor method.

```ts title="src/controller/TodoController.ts"
import { Controller, getEnvConfig } from '@summer-js/summer'

@Controller
export class TodoController {
  constructor() {
    // highlight-next-line
    const serverConfig = getEnvConfig('SERVER_CONFIG')
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

 
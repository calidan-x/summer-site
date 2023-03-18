---
sidebar_position: 30
---

# 依赖注入

标记了 **@Injectable** 或 **@Service** 会视为可被注入对象被 Summer 收集管理。<br/>

:::info
Summer 框架的所有可注入对象都会自动注入到类属性中，代码中不需要写任何类似 @Inject 的装饰器。<br/>
所有的依赖注入对象都是单例。
:::

### 注入相关装饰器与接口方法


|  装饰器/方法  | 用途  |
|  ----  | ----  |
| @Service / @Injectable | Injectable class |
| EnvConfig<'KEY', Type = any> | Inject config |
| @PostConstruct | Init method after construction |
| createPropertyDecorator | create a property injection decorator|


### 服务类实例注入

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


### 泛型服务类注入
Summer支持泛型单例注入，泛型单例定义的类型会以传参的形式传给类的构造函数 **constructor**。

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


### 获取可注入对象实例

考虑多不是所有的代码都运行在class里，如果一个简单function或者在测试代码中想要获取到可注入实例，可以调用 **getInjectable()** 接口。

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


### 配置信息注入

```ts title="src/controller/TodoController.ts"
import { Controller, Config, PostConstruct } from '@summer-js/summer'

@Controller
export class TodoController {
  
  serverConfig: EnvConfig<'SERVER_CONFIG'>

  // 字段实例的注入发生在构造函数 constructor() 运行之后, 使用 @PostConstruct 做初始化工作。
  // highlight-next-line
  @PostConstruct
  init() {
    console.log(this.serverConfig)
  }
}
```

 
还有一个更简单的获取配置信息的手段，就是直接调用 getEnvConfig() 接口获取配置信息，这样一些初始化工作就可以直接写到 constructor() 方法中了。

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


### 属性字段注入

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

 
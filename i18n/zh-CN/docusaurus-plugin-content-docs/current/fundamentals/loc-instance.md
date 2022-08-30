---
sidebar_position: 30
---

# 服务与实例注入


Summer 框架会将标注 `@Injectable` 或 `@Service` 的对象实例储存到一个公共容器中，再使用 `@Inject` 注入到对象属性上

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

### 相关 Decorator


|  Decorator   | 作用  |
|  ----  | ----  |
| @Service | 标记为可注入服务，等同于Injectable |
| @Injectable | 标记为可注入组件 |
| @PostConstruct | 在构造函数完成后调用的初始化方法 |




### 代码获取可注入实例

```ts
const todoService = getInjectable(TodoService)
```
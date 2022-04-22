---
sidebar_position: 1
---

# 数据库

安装 TypeORM 插件

```
npm install @summer-js/typeorm
npm install mysql
```

### MySQL

在 default.config.ts 配置（亦可以在不同环境配置）

```ts title="config/default.config.ts"
import { TypeORMConfig } from '@summer-js/typeorm'

export const TYPEORM_CONFIG: TypeORMConfig = {
  DATA_SOURCE: {
    type: 'mysql',
    host: 'localhost',
    database: 'dbname',
    username: 'root',
    password: 'root'
    // 不需要添加 entities summer会自动收集
  }
}
```
配置好之后服务器启动会自动链接上数据库

定义Entity
```ts title="entity/Todo.ts"
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @Column()
  isDone: boolean
}
```

定义repository获取方式
```ts title="DataSource.ts"
import { EntityTarget } from 'typeorm'
import { getDataSource } from '@summer-js/typeorm'

export const getRepository = <T>(entity: EntityTarget<T>) => {
  return getDataSource('DATA_SOURCE').getRepository(entity)
}
```

在Service中获取Repository并实现增删改查
```ts title="service/TodoService.ts"
import { Service } from '@summer-js/summer'
import { getRepository } from './DataSource.ts'

import { Todo } from '../entity/Todo'

@Service
export class TodoService {
  todoRepository = getRepository(Todo)

  async getTodos() {
    return await this.todoRepository.find()
  }

  async addTodo() {
    const todo = new Todo()
    return await this.todoRepository.save(todo)
  }
}
```


TypeORM更多使用方法请参考 [TypeORM官方文档](https://typeorm.io/)
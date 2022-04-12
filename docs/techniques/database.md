---
sidebar_position: 1
---

# 数据库

安装 TypeORM 插件

```
npm install @summer-js/typeorm
```

### MySQL

在 default.config.ts 配置（亦可以在不同环境配置）

```ts title="config/default.config.ts"
import { ServerConfig } from '@summer-js/summer';

// MYSQL_CONFIG 是固定命名不能修改
export const MYSQL_CONFIG: MySQLConfig = {
  host: 'localhost',
  database: 'dbname',
  username: 'root',
  password: 'root'
  // 不需要定义 entities, summer 会自动收集 @Entity 
};
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

在Service中获取Repository并实现增删改查
```ts title="service/TodoController.ts"
import { Service } from '@summer-js/summer'
import { getRepository } from 'typeorm'

import { Todo } from '../entity/todo'

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
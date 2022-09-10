---
sidebar_position: 1
---

# MySQL

### 安装 TypeORM 插件

```
npm install @summer-js/typeorm
npm install mysql2
```

### 添加数据源 

```ts title="src/config/default.config.ts"
import { TypeORMConfig } from '@summer-js/typeorm'

export const TYPEORM_CONFIG: TypeORMConfig = {
  DATA_SOURCE: {
    type: 'mysql',
    host: 'localhost',
    database: 'dbname',
    username: 'root',
    password: 'root'
    // 你不需要添加 entities/migrations, Summer会自动收集他们
  }
}
```

:::tip
Summer TypeORM plugin 或自动收集 entities/migrations 
:::

### 创建Entity
```ts title="src/entity/Todo.ts"
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


### 使用 Repository 做增删改查

:::tip
Repository&lt;T, DataSourceName?: string = FirstDataSource&gt; 是一个泛型可注入对象，会被Summer自动注入.<br/>
Repository对象会默认链接第一个数据源，如果你想要连接不同的数据源，你需要加上第二个参数。
:::

```ts title="src/service/TodoService.ts"
import { Service } from '@summer-js/summer'
import { Repository } from '@summer-js/typeorm'

import { Todo } from '../entity/Todo'

@Service
export class TodoService {
  // auto inject
  //highlight-next-line
  todoRepository: Repository<Todo>

  async getTodos() {
    return await this.todoRepository.find()
  }

  async addTodo() {
    const todo = new Todo()
    return await this.todoRepository.save(todo)
  }
}
```



### 从数据源获取Repository

你也可以通过调用 **getDataSource("DATA_SOURCE_NAME").getRepository(entity)** 去获取Repository实例。<br/>
注入的写法当然更优雅，但是仅可是在class中使用 **getRepository()** api可以在任何地方使用。

```ts title="src/DataSource.ts"
import { EntityTarget } from 'typeorm'
import { getDataSource } from '@summer-js/typeorm'

export const getRepository = <T>(entity: EntityTarget<T>) => {
  return getDataSource('DATA_SOURCE').getRepository(entity)
}
```

```ts title="src/service/TodoService.ts"
import { Service } from '@summer-js/summer'
import { getRepository } from '../DataSource.ts'

import { Todo } from '../entity/Todo'

@Service
export class TodoService {
  //highlight-next-line
  todoRepository = getRepository(Todo)

}
```


### 数据库版本迁移

安装 ts-node
```
npm install ts-node --save-dev
```

创建本地配置文件 ormconfig.ts

```ts title="ormconfig.ts"
import { DataSource } from 'typeorm'
import { DBNamingStrategy } from '@summer-js/typeorm'

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  database: 'summer-db',
  username: 'root',
  password: 'root',
  namingStrategy: new DBNamingStrategy(),
  entities: ['./src/entity/**/*.ts']
})
```


在 package.json 加入生成 migration 的指令
```json title="package.json"
{
	....
	"scripts": {
    // highlight-next-line
		"generate-migration": "typeorm-ts-node-commonjs migration:generate src/migrations/migration -d ormconfig.ts -p"
	},
	....
}
```

运行指令，它会在 **src/migrations/** 生成对应的数据库版本
```
npm run generate-migration
```

在启动项目前执行版本，同步数据库

```ts title="src/index.ts"
import { getDataSource } from '@summer-js/typeorm'
import { summerStart, handler, Logger } from '@summer-js/summer'
import './auto-imports'
export { handler }

// highlight-start
const runMigrations = async () => {
  const output = await getDataSource('DATA_SOURCE').runMigrations()
  output.forEach((m) => {
    Logger.info('Run migration: ' + m.name)
  })
}
// highlight-end

summerStart({
  async before(config) {
    // highlight-next-line
    await runMigrations()
  },
  after(config) {}
})
```



更多TypeORM的使用方法请参考 [TypeORM 官方文档](https://typeorm.io/)
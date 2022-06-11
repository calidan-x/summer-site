---
sidebar_position: 1
---

# MySQL数据库

### 安装 TypeORM 插件

```
npm install @summer-js/typeorm
npm install mysql
```

### 添加配置信息
在 default.config.ts 配置（亦可以在不同环境配置）

```ts title="src/config/default.config.ts"
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

:::tip
Summer 的 TypeORM 插件可以自动收集 entity 与 migration
:::

### 定义Entity
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

### 定义repository获取方式
```ts title="src/DataSource.ts"
import { EntityTarget } from 'typeorm'
import { getDataSource } from '@summer-js/typeorm'

export const getRepository = <T>(entity: EntityTarget<T>) => {
  return getDataSource('DATA_SOURCE').getRepository(entity)
}
```

### 在Service中获取Repository并实现增删改查
```ts title="src/service/TodoService.ts"
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

### 数据库迁移

随着迭代开发，服务升级，数据库结构会改变，需要使用数据库迁移（DB Migration）技术完成

安装ts-node
```
npm install ts-node --save-dev
```

在创建cli数据库链接配置

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


在package.json添加版本生成代码
```json title="package.json"
{
	....
	"scripts": {
		"generate-migration": "typeorm-ts-node-commonjs migration:generate src/migrations/migration -d ormconfig.ts -p"
	},
	....
}
```

执行生成数据库版本，将会在src/migrations/migration生成数据库迁移版本执行文件
```
npm run generate-migration
```

在服务器启动前执行数据库版本
```ts title="src/index.ts"
import { getDataSource } from '@summer-js/typeorm'
import { summerStart, handler, Logger } from '@summer-js/summer'
import './auto-imports'
export { handler }

const runMigrations = async () => {
  const output = await getDataSource('DATA_SOURCE').runMigrations()
  output.forEach((m) => {
    Logger.info('Run migration: ' + m.name)
  })
}

summerStart({
  async before(config) {
    await runMigrations()
  },
  after(config) {}
})
```

启动服务器执行数据库更变脚本


TypeORM更多使用方法请参考 [TypeORM官方文档](https://typeorm.io/)
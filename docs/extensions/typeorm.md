---
sidebar_position: 1
---

# TypeORM

### Install TypeORM Plugin

```
npm install @summer-js/typeorm
npm install mysql2
```

### Add DataSource Config
in default.config.ts

```ts title="src/config/default.config.ts"
import { TypeORMConfig } from '@summer-js/typeorm'

export const TYPEORM_CONFIG: TypeORMConfig = {
  DATA_SOURCE: {
    type: 'mysql',
    host: 'localhost',
    database: 'dbname',
    username: 'root',
    password: 'root'
    // you don't need to add entities/migrations, summer will auto collect them
  }
}
```

:::tip
Summer TypeORM plugin can auto collect entities and migrations
:::

### Create an Entity
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


### Do CRUD by Repository

:::tip
Repository&lt;T, DataSourceName?: string = FirstDataSource&gt; is a generic injectable class.<br/>
The Repository instance connect to the first DataSource by default, however, you can set the second param to specify another DataSource.
:::

```ts title="src/service/TodoService.ts"
import { Service } from '@summer-js/summer'
//highlight-next-line
import { Repository } from '@summer-js/typeorm'

import { Todo } from '../entity/Todo'

@Service
export class TodoService {
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



### Get Repository From DataSouse

You can also get repository by calling **getDataSource("DATA_SOURCE_NAME").getRepository(entity)**.<br/>
The inject instance way mentions before looks more elegant, but only works in class. **getRepository()** can be called everywhere.

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

### Transaction

Summer provide Transaction decorator for DB transaction, the following code will not save todo data because there is an Error in Transaction scope.

```ts title="src/service/TodoService.ts"
import { Service } from '@summer-js/summer'
//highlight-next-line
import { Repository, Transaction, transaction} from '@summer-js/typeorm'

import { Todo } from '../entity/Todo'

@Service
export class TodoService {
  todoRepository: Repository<Todo>

  // using decorator
  //highlight-next-line
  @Transaction
  async addTodo1() {
    let todo = new Todo()
    todo.id = 1
    todo.content = 'coding'
    todo.isDone = false
    await this.todoRepository.save(todo)
    throw new Error('error')
  }

  // you can also use transaction function
  async addTodo2() {
    //highlight-next-line
    await transaction(async ()=>{
      let todo = new Todo()
      todo.id = 1
      todo.content = 'coding'
      todo.isDone = false
      await this.todoRepository.save(todo)
      throw new Error('error')
    //highlight-next-line
    })
  }

}
```


### DB Migration


install ts-node
```
npm install ts-node --save-dev
```

Create a file named ormconfig.ts

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


Add migration generation script in package.json
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

Run the script, this will help to generate a new migration version in **src/migrations/**
```
npm run generate-migration
```

Run migration before the server start.
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



For more usage please check [TypeORM official DOC](https://typeorm.io/)
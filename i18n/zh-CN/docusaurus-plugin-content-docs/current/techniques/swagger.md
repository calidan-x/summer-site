---
sidebar_position: 5
---

# Swagger 文档


### Summer Swagger 插件特点

<img src="/img/swagger_logo.svg"  style={{position:"absolute",right:"280px",top:"260px"}} width="200"/>

* 只有3个装饰器
* 推断所有类型自动生成文档
* 支持 OpenAPI 3.0.x
* 密码保护
* 可读取Summer核心的 (@Max @Email optional(?)...) 等装饰器信息
* 可读取TypeORM的数据库字段Comment
* 可以使用 ResponseError 来设置返回错误



### 安装 Swagger 插件

```
npm install @summer-js/swagger
```

### 配置 Swagger 插件

在 config/default.config.ts 加入
```ts
import { SwaggerConfig } from '@summer-js/swagger';

export const SWAGGER_CONFIG: SwaggerConfig = {
  docPath: '/swagger',
  password: 'abc123',
  info: { title: 'Summer', version:"0.0.1" }
}
```


### Swagger 装饰器

|  装饰器   | 说明  |
|  ----  | ----  |
| @ApiDocGroup  | 标记控制器，设置接口组 |
| @ApiDoc  | 标记控制器方法，设置接口功能 |
| @PropDoc  | 设置字段说明，字段默认值 |



### 最简单的写法

```ts title="只需要写一行代码"
import { Body, Controller, Get, Query, PathParam, Post } from '@summer-js/summer'
import { ApiDoc, ApiDocGroup } from '@summer-js/swagger'

class AddMovieRequest {
  name: string
  year: string
}

class Movie {
  id: number
  name: string
  year: string
}

@Controller
// highlight-next-line
@ApiDocGroup('Movie APIs')
export class MovieController { 
  @Get('/movies')
  list(@Query search: string) {
    const movies: Movie[] = [
      { id: 1, name: 'Titanic', year: '1997' },
      { id: 2, name: 'CODA', year: '2021' }
    ]
    return movies
  }
 
  @Get('/movies/:id')
  detail(@PathParam id: string) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }
 
  @Post('/movies')
  add(@Body body: AddMovieRequest) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }
}
```

### 完整写法

```ts
import { Body, Controller, Get, Query, PathParam, Header, Post } from '@summer-js/summer'
import { ApiDoc, ApiDocGroup, PropDoc } from '@summer-js/swagger'

class AddMovieRequest {
  // highlight-next-line
  @PropDoc("Movie Name", "Titanic")
  name: string

  // highlight-next-line
  @PropDoc("Movie Release Year", 1997)
  year: string
}

class Movie {
  id: number
  name: string
  year: string
}

@Controller
// highlight-next-line
@ApiDocGroup('Movie API', { category: 'Client API' })
export class MovieController {
  // highlight-start
  @ApiDoc('Fetch movie list', {
    description: 'This api return a full list of movies',
  })
  // highlight-end
  @Get('/movies')
  list(@Query search: string) {
    const movies: Movie[] = [
      { id: 1, name: 'Titanic', year: '1997' },
      { id: 2, name: 'CODA', year: '2021' }
    ]
    return movies
  }

  // highlight-start
  @ApiDoc('Get a specific movie detail by id', {
    errors: [
      { 
        statusCode: 404,
        description: 'Not Found',
        example: '404 Not Found',
      }
    ]
  })
  // highlight-end
  @Get('/movies/:id')
  detail(@PathParam id: string) {
    const movie: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movie
  }

  // highlight-start
  @ApiDoc('Add a new movie', {
    description: ''
  })
  // highlight-end
  @Post('/movies')
  add(@Body body: AddMovieRequest) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }
}
```

:::caution 返回结构
Summer 可以读取运行时TypeScript类型推断出返回类型，哪怕你在控制器都没有声明返回类型。
返回类型必须是Class型才被支持。
:::

:::tip API分页
在@ApiDocGroup的第二个参数设置 **category** 可以讲API分配到不同的页面中。 例如 @ApiDocGroup('',{category:'APP前端相关接口'})
:::

:::tip 修改API顺序
例如：@ApiDocGroup('',{order:1})
:::
 


### 复用 ResponseError
ResponseError 错误可以被直接设置成接口异常定义

```ts
// 定义错误
// highlight-next-line
const MovieNotFoundError = new ResponseError(404,"Movie not found")

@ApiDoc('Get a specific movie detail by id', {
  // highlight-next-line
  errors: [ MovieNotFoundError ]
})
@Get('/movies/:id')
detail(@PathParam id: string) {
  const movie: Movie = { id: 1, name: 'Titanic', year: '1997' }
  if(!movie){
    // highlight-next-line
    throw MovieNotFoundError
  }
  return movie
}
```

### 读取 TypeORM comment

TypeORM entity 的字段 comment 可以被读取作为文档注解。
要使用这项功能，在 SWAGGER_CONFIG 设置 readTypeORMComment 为 true。

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number

  // highlight-next-line
  @Column({ comment: 'To do content' })
  content: string

  // highlight-next-line
  @Column({ comment: 'Is already done' })
  isDone: boolean
}
```

```ts
export const SWAGGER_CONFIG: SwaggerConfig = {
  docPath: '/swagger',
  // highlight-next-line
  readTypeORMComment: true,
  info: {
    title: 'Summer',
    description: 'Last build at: ' + new Date(Number(process.env.SUMMER_BUILD_TIME)),
    version: '1.0.0'
  }
}
```



### 添加请求认证

```ts
export const SWAGGER_CONFIG: SwaggerConfig = {
  docPath: '/swagger',
  info: { title: 'Summer', version: '1.0.0' },
  // highlight-start
  securitySchemes: {
    Auth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization'
    }
  }
  // highlight-end
}
```

```ts
// highlight-next-line
@Get('/movies/:id',{ security: [{ Auth: [] }] })
detail(@PathParam id: string) {
  const movie: Movie = { id: 1, name: 'Titanic', year: '1997' }
  return movie
}
```

### 打印发布时间

```ts
export const SWAGGER_CONFIG: SwaggerConfig = {
  docPath: '/swagger',
  info: {
    title: 'Summer',
    // highlight-next-line
    description: 'Last build at: ' + new Date(Number(process.env.SUMMER_BUILD_TIME)),
    version: '1.0.0'
  }
}
```
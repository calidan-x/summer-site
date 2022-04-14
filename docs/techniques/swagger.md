---
sidebar_position: 2
---

# Swagger API文档


### 安装 Swagger 插件

```
npm install @summer-js/swagger
```

### 配置 Swagger

在 config/default.config.ts 或其他配置环境加入
```ts
import { SwaggerConfig } from '@summer-js/swagger';

export const SWAGGER_CONFIG: SwaggerConfig = {
  swaggerDocPath: '/swagger',
  info: { title: 'Summer' }
}
```

`swaggerDocPath` 是配置的swagger访问路径

:::tip
使用 @ApiDocGroup 标记Controller<br/>
使用 @ApiDoc 标记接口方法<br/>
:::


### 最简写法

```ts
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
@ApiDocGroup('电影相关接口')
export class MovieController {
  @ApiDoc('获取电影列表')
  @Get('/movies')
  list(@Query search: string) {
    const movies: Movie[] = [
      { id: 1, name: 'Titanic', year: '1997' },
      { id: 2, name: 'CODA', year: '2021' }
    ]
    return movies
  }

  @ApiDoc('获取电影详情')
  @Get('/movies/:id')
  detail(@PathParam id: string) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }

  @ApiDoc('新增电影')
  @Post('/movies')
  add(@Body body: AddMovieRequest) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }
}
```

### 最全写法

```ts
import { Body, Controller, Get, Query, PathParam, Header, Post } from '@summer-js/summer'
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
@ApiDocGroup('电影相关接口', { category: '电影' })
export class MovieController {
  @ApiDoc('获取电影列表', {
    description: '获取电影描述',
    example: {
      response: [
        { id: 1, name: 'Titanic', year: '1997' },
        { id: 2, name: 'CODA', year: '2021' }
      ]
    }
  })
  @Get('/movies')
  list(@Query search: string) {
    const movies: Movie[] = [
      { id: 1, name: 'Titanic', year: '1997' },
      { id: 2, name: 'CODA', year: '2021' }
    ]
    return movies
  }

  @ApiDoc('获取电影', {
    description: '获取电影描述2',
    example: {
      response: { id: 1, name: 'Titanic', year: '1997' }
    },
    errors: { 404: 'Not Found' }
  })
  @Get('/movies/:id')
  detail(@PathParam id: string) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }

  @ApiDoc('测试文档', {
    description: '描述描述描述描述描述',
    example: {
      request: { name: 'Titanic', year: '1997' },
      response: { id: 1, name: 'Titanic', year: '1997' }
    }
  })
  @Post('/movies')
  add(@Body body: AddMovieRequest) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }
}
```

:::tip 给API类别分页
@ApiDocGroup  第二个参数有一个 category 的配置项，可以实现API类别分页
:::

:::tip 给API排序
@ApiDocGroup 与 @ApiDoc 第二个参数都有一个 order 的配置项，可以传入顺序数值实现排序
:::
 
:::tip 返回类型的自动推断文档化
Summer在不定义返回类型的时候可以自动推断返回类型，前提是返回的类型必须定义成class型或者是class型数组或基础类型<br/>
如果返回的类型无法推断，可以在example字段中给出具体返回例子
:::

 

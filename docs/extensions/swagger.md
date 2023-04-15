---
sidebar_position: 5
---

# Swagger Docs


### Features

<img src="/img/swagger_logo.svg"  style={{position:"absolute",right:"280px",top:"260px"}} width="200"/>

* Only THREE simple decorators
* Infer ALL types and generate examples
* Full support of OpenAPI 3.0.x
* Password protection
* Working with Summer core validation decorator (@Max @Email optional(?)...)
* Can read TypeORM comment
* Reuse Summer ResponseError





### Install Swagger Plugin

```
npm install @summer-js/swagger
```

### Config Swagger

in config/default.config.ts or other [env].config.ts
```ts
import { SwaggerConfig } from '@summer-js/swagger';

export const SWAGGER_CONFIG: SwaggerConfig = {
  docPath: '/swagger',
  password: 'abc123',
  info: { title: 'Summer', version:"0.0.1" }
}
```


### Swagger Decorators

|  Decorator   | Usage  |
|  ----  | ----  |
| @ApiDocGroup  | mark controller |
| @ApiDoc  | mark controller method |
| @PropDoc  | mark DTO property|



### Most Simple Usage 

```ts title="A single line of code can generate a full swagger document"
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

### Full Usage

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

:::caution Return type and Example
Summer can infer class return type and generate examples automatically, return type must be a Class.
:::

:::tip Categorize APIs to different pages
config **category** in @ApiDocGroup('',{category:'App APIs'})
:::

:::tip Ordering APIs
config **order** in @ApiDocGroup('',{order:1})
:::
 

### Add Access Password

```ts
export const SWAGGER_CONFIG: SwaggerConfig = {
  docPath: '/swagger',
  // highlight-next-line
  password: 'xxxxxxxxxx',
  .....
}
```

### Reuse ResponseError
ResponseError instance can be set to errors example

```ts
// define error
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


### Read TypeORM comment

TypeORM entity comment can be read to swagger DTO property description.
To enable this feature, set readTypeORMComment to true in SWAGGER_CONFIG

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



### Add API Auth 

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

### Show Build Time

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
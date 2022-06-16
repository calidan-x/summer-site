---
sidebar_position: 5
---

# Swagger Docs


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
  info: { title: 'Summer', version:"0.0.1" }
}
```

**docPath** the swagger access path


:::tip How to mark
Use @ApiDocGroup to mark controller<br/>
Use @ApiDoc to mark controller method<br/>
Use @PropDoc to mark DTO property<br/>
:::


### Simple Usage

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
@ApiDocGroup('Movie APIs')
export class MovieController {
  @ApiDoc('Fetch movies list')
  @Get('/movies')
  list(@Query search: string) {
    const movies: Movie[] = [
      { id: 1, name: 'Titanic', year: '1997' },
      { id: 2, name: 'CODA', year: '2021' }
    ]
    return movies
  }

  @ApiDoc('Get a specific movie detail by id')
  @Get('/movies/:id')
  detail(@PathParam id: string) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }

  @ApiDoc('Add a new movie')
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
  @PropDoc("Movie Name", "Titanic")
  name: string

  @PropDoc("Movie Release Year", 1997)
  year: string
}

class Movie {
  id: number
  name: string
  year: string
}

@Controller
@ApiDocGroup('Movie API', { category: 'Client API' })
export class MovieController {
  @ApiDoc('Fetch movie list', {
    description: 'This api return a full list of movies',
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

  @ApiDoc('Get a specific movie detail by id', {
    example: {
      response: { id: 1, name: 'Titanic', year: '1997' }
    },
    errors: [
      { 
        statusCode: 404,
        description: 'Not Found',
        example: '404 Not Found',
      }
    ]
  })
  @Get('/movies/:id')
  detail(@PathParam id: string) {
    const movies: Movie = { id: 1, name: 'Titanic', year: '1997' }
    return movies
  }

  @ApiDoc('Add a new movie', {
    description: '',
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

:::tip Categorize APIs to different pages
config **category** in @ApiDocGroup('',{category:'App APIs'})
:::

:::tip Ordering APIs
config **order** in @ApiDocGroup('',{order:1})
:::
 
:::tip Return type Inference
Summer can infer class return type, the return type do not need to define in class methods.
:::

:::tip Request and Response example
Although Summer can infer class type to generate example object,<br/>
To provide a better document with meaningful example value can be done by 2 ways:
1. add a full object example in @ApiDoc
2. set @PropDoc(desc, example value) example value
:::
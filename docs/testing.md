---
sidebar_position: 5
---

# Testing

### Config Jest
```js title="jest.config.js"
module.exports = {
  preset: '@summer-js/test',
  testPathIgnorePatterns: ['<rootDir>/src/']
}
```


### Test Controller

```ts
import { request } from '@summer-js/test'

describe('Test Movie Controller', () => {

  test('should return movie list', async () => {
    const response = await request.get('/movies')
    expect(response.statusCode).toEqual(200)
    expect(response.body).toStrictEqual([])
  })
})
```

### Test Service
```ts
import { getInjectable } from '@summer-js/summer'

import { MovieService } from './../service/person-service'

describe('Test Movie Service', () => {
  let movieService: MovieService

  beforeAll(async () => {
    // highlight-next-line
    movieService = getInjectable(MovieService)
  })

  test('should return movie list', async () => {
    const movies = await movieService.getMovies()
    expect(movies.length).toBe(12)
  })
})
```


### Set Request Header

```ts
import { request } from '@summer-js/test'

describe('Test Movie Controller', () => {
  // init header
  // highlight-next-line
  request.setHeaders({ Authorization: 'Bearer xxxxxxxxxxxx' }) 

  test('should return movie list', async () => {
    const response = await request.get('/movies')
    expect(response.statusCode).toEqual(200)
  })
})
```
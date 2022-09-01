---
sidebar_position: 5
---

# Testing

### Test Controller

```ts
import { initTest, endTest, request } from '@summer-js/test'

describe('Test Movie Controller', () => {
  beforeAll(async () => {
    // highlight-next-line
    await initTest()
  })

  afterAll(async () => {
    // highlight-next-line
    await endTest()
  })

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
import { initTest, endTest } from '@summer-js/test'

import { MovieService } from './../service/person-service'

describe('Test Movie Service', () => {
  let movieService: MovieService

  beforeAll(async () => {
    await initTest()
    // highlight-next-line
    movieService = getInjectable(MovieService)
  })

  afterAll(async () => {
    await endTest()
  })

  test('should return movie list', async () => {
    const movies = await movieService.getMovies()
    expect(movies.length).toBe(12)
  })
})
```


### Set Request Header

```ts
import { initTest, endTest, Request } from '@summer-js/test'

describe('Test Movie Controller', () => {
  // init header
  // highlight-next-line
  const request = new Request({ headers: { Authorization: 'Bearer xxxxxxxxxxxx' } })

  beforeAll(async () => {
    await initTest()
  })

  afterAll(async () => {
    await endTest()
  })

  test('should return movie list', async () => {
    const response = await request.get('/movies')
    expect(response.statusCode).toEqual(200)

    // change header
    // highlight-next-line
    request.setHeaders({ Authorization: 'Bearer xxxxxxxxxxxx' })
  })
})
```
---
sidebar_position: 5
---

# 测试

### 测试Controller

```ts
import { initTest, endTest, request } from '@summer-js/test'

describe('Test Movie Controller', () => {
  beforeAll(async () => {
    await initTest()
  })

  afterAll(async () => {
    await endTest()
  })

  test('should return movie list', async () => {
    const response = await request.get('/movies')
    expect(response.statusCode).toEqual(200)
    expect(response.body).toStrictEqual([])
  })
})
```

### 测试Service
```ts
import { getInjectable } from '@summer-js/summer'
import { initTest, endTest } from '@summer-js/test'

import { MovieService } from './../service/person-service'

describe('Test Movie Service', () => {
  let movieService: MovieService

  beforeAll(async () => {
    await initTest()
    // 必须在 initTest() 中获取
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


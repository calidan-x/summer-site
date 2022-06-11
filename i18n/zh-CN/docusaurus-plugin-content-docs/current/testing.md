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
    expect(response.body).toContain('')
  })
})
```

### 测试Service
```ts
import { getInjectable } from '@summer-js/summer'
import { initTest, endTest } from '@summer-js/test'

import { PersonService } from './../service/person-service'

describe('Test Movie Service', () => {
  let personService: PersonService

  beforeAll(async () => {
    await initTest()
    // 必须在 initTest() 之后获取
    personService = getInjectable(PersonService)
  })

  afterAll(async () => {
    await endTest()
  })

  test('should return movie list', async () => {
    const persons = await personService.getPersons()
    expect(persons.length).toBe(0)
  })
})
```


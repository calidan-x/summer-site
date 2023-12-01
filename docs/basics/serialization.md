---
sidebar_position: 55
---

# Serialization

Summer serializes response data automatically.

A controller method returns an object will be serialized to JSON string with **application/json** in header context-type. String or other js primitive type will be converted to string with **text/html** in header context-type.

### Enum type in object will convert to Key string by default.

```ts
import { Controller, Get } from '@summer-js/summer'

enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3
}

class Resource { 
  info: string
  direction: Direction
}

@Controller
export class SerializationController {
  @Get('/serialize')
  async serialize() {
    const r = new Resource()
    r.direction = Direction.LEFT
    r.info = "Information"
    return r
  }
}
```

```json title="Output"
{
    "info": "Information",
    "direction": "LEFT"
}
```

### Use @Serialize() to serialize data

```ts
import { Controller, Get, Serialize } from '@summer-js/summer'

enum Gender {
  Male,
  Female
}

class User {
  name: string
  @Serialize((value: string) => value.replace(/.+/g, '*****'))
  password: string
  gender: Gender
}

@Controller
export class SerializationController {

  @Get('/user')
  async propSerialize() {
    const user = new User()
    user.name = 'John'
    user.password = 'my-password'
    user.gender = Gender.Male
    return user
  }

}
```

```json title="Output"
{
    "name": "John",
    "password": "*****",
    "gender": "Male"
}
```

### Use @Ignore to hide property

:::info Notice
Hide property can also be done by using @Serialize() and return undefined
:::

```ts
import { Controller, Get, Ignore } from '@summer-js/summer'

enum Gender {
  Male,
  Female
}

class User {
  name: string
  @Ignore
  password: string
  gender: Gender
}

@Controller
export class SerializationController {

  @Get('/user')
  async propSerialize() {
    const user = new User()
    user.name = 'John'
    user.password = 'my-password'
    user.gender = Gender.Male
    return user
  }

}
```

```json title="Output"
{
    "name": "John",
    "gender": "Male"
}
```


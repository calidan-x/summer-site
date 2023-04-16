---
sidebar_position: 55
---

# 序列化

Summer 自动序列化返回数据.

控制器方法如果返回的是一个对象体，Summer会将其序列化成JSON字符串，并且设置头部类型为**application/json**。字符串或其他 Javascript 基础类型会被序列号成字符串，返回的头部会设置成 **text/html** 类型。

枚举会转换成字符串 key 值。

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
    "info":"Information",
    "direction":"LEFT"
}
```

### 使用 @Serialize() 序列化数据

```ts
import { Controller, Get, Serialize } from '@summer-js/summer'

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
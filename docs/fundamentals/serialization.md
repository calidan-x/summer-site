---
sidebar_position: 55
---

# 序列化

Summer会自动序列化枚举，日期时间戳等类型

```ts
import { Controller, Get } from '@summer-js/summer'

enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3
}

class Resource {
  date: Date
  dateTime: DateTime
  timeStamp: TimeStamp

  direction: Direction
}

@Controller
export class SerializationController {
  @Get('/serialize')
  async serialize() {
    const r = new Resource()
    r.date = new Date()
    r.dateTime = new Date()
    r.timeStamp = new Date()
    r.direction = Direction.LEFT
    return r
  }
}
```

```json title="输出"
{
    "date":"2022-06-01",
    "dateTime":"2022-06-01 18:19:33",
    "timeStamp":1654078773784,
    "direction":"LEFT"
}
```


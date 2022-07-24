---
sidebar_position: 55
---

# 序列化

Summer会自动序列化枚举

```ts
import { Controller, Get } from '@summer-js/summer'

enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3
}

class Resource { 
  direction: Direction
}

@Controller
export class SerializationController {
  @Get('/serialize')
  async serialize() {
    const r = new Resource()
    r.direction = Direction.LEFT
    return r
  }
}
```

```json title="输出"
{
    "direction":"LEFT"
}
```


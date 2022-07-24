---
sidebar_position: 55
---

# Serialization

Summer can serialize enum automatically.

 

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

```json title="Output"
{
    "direction":"LEFT"
}
```


---
sidebar_position: 55
---

# Serialization

Summer serializes response data automatically.

A controller method returns an object will be serialized to JSON string with **application/json** in header context-type. String or other js primitive type will be converted to string with **text/html** in header context-type.

Enum type in object will convert to Key string.

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


---
sidebar_position: 73
---

# Life Cycle Hook
 
There are two hook functions that can be called.

```ts title="src/index.ts"
import { summerStart, handler } from '@summer-js/summer'
import './auto-imports'
export { handler }

summerStart({
  before(config) {
    // init code before startup
  },
  after(config) {
    // post job after startup
  }
})
```
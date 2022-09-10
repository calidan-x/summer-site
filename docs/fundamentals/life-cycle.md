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
  async before(config) {
    // init code before startup
  },
  async after(config) {
    // post job after startup
  }
})
```
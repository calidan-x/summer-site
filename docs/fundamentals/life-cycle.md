---
sidebar_position: 73
---

# 生命周期

在服务启动之前和之后通常都会做一些操作，可以通过summerStart的before和after回调执行

```ts title="src/index.ts"
import { summerStart, handler } from '@summer-js/summer'
import './auto-imports'
export { handler }

summerStart({
  before(config) {
    // 服务器启动前初始化代码
  },
  after(config) {
    // 服务器启动后执行化代码
  }
})
```
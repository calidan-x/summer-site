---
sidebar_position: 73
---

# 生命周期

在服务启动之前和之后有可能需要做一些初始化或延后操作，可以通过在 summerStart() 中配置 before 和 after 实现，这2个 hook 方法都会传入当前环境的配置信息，方便读取使用。

```ts title="src/index.ts"
import { summerStart, handler } from '@summer-js/summer'
import './auto-imports'
export { handler }

summerStart({
  async before(config) {
    // 服务器启动前初始化代码
  },
  async after(config) {
    // 服务器启动后执行化代码
  }
})
```
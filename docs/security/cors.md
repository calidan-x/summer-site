---
sidebar_position: 1
---

# Cors

Set to support cors

```ts title='config/default.config.ts'
import { SERVER_CONFIG } from '@summer-js/summer';

export const SERVER_CONFIG: ServerConfig = {
  port: 8801,
  // highlight-next-line
  cors: true
}
```




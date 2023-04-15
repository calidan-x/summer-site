---
sidebar_position: 1
---

# 跨域

开启(CORS)跨域资源共享

```ts
import { SERVER_CONFIG } from '@summer-js/summer';

export const SERVER_CONFIG: ServerConfig = {
  port: 8801,
  cors: true
}
```

浏览器的 OPTIONS 请求即可返回 200
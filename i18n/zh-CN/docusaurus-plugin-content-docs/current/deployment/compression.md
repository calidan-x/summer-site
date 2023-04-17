---
sidebar_position: 2
---

# API接口数据压缩

Summer 支持压缩API数据加强客户端请求。

```ts title="src/config/default.config.ts"
export const SERVER_CONFIG: ServerConfig = {
  ...
  compression: {
    enable: true
    // threshold: 1024 (默认为 860byte)
  }
}
```
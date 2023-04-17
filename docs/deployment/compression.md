---
sidebar_position: 2
---
# API Compression

Summer can compress big response data to speed up client request.

```ts title="src/config/default.config.ts"
export const SERVER_CONFIG: ServerConfig = {
  ...
  compression: {
    enable: true
    // threshold: 1024 (default is 860byte)
  }
}
```
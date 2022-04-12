---
sidebar_position: 3
---

# 静态服务器

### 配置 静态服务器

在 config/default.config.ts 或其他配置环境加入
```ts
import { SERVER_CONFIG } from '@summer-js/summer';

export const SERVER_CONFIG: ServerConfig = {
  port: 8801,
  static: [
    {
      requestPathRoot: '/static',
      destPathRoot: 'resource',
      indexFiles: ['index.html']
    }
  ]
}
```

`requestPathRoot` 为请求的根节点
`resource` 为对应文件系统的目录
`indexFiles` 索引文件列表

将 index.html 放入 src/resource/index.html 即可通过浏览器访问 http://127.0.0.1:8801/static/ 

:::note
src/resource 目录是Summer框架默认的资源目录，在部署环节会一同打包到build目录，配置目标目录的时候需要配置在这个文件目录或其次级目录
:::
---
sidebar_position: 20
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
      requestPath: '/static',
      destPath: 'resource',
      indexFiles: ['index.html']
    }
  ]
}
```

`requestPath` 为请求的根节点<br/>
`destPath` 为对应文件系统的目录<br/>
`indexFiles` 索引文件列表

编写一个简单的HTML代码
```html
<html>
  <body>
    Hello Summer
  </body>
</html>
```
将 index.html 放入 ./resource/index.html 即可通过浏览器访问 http://127.0.0.1:8801/static/ 

:::caution
./resource 目录是Summer框架默认的资源目录，配置目标目录的时候需要配置在这个文件目录或其次级目录
:::


### SPA 应用支持
Summer 支持 SPA (Single Page Application) 例如 React / Vue / Svelte 等应用。
使用这个功能，可以在配置文件中添加 **spa:ture** 。

```ts
import { ServerConfig } from '@summer-js/summer';

export const SERVER_CONFIG: ServerConfig = {
  port: 8801,
  
  static: [
    {
      requestPath: '/app',
      destPath: 'resource',
      indexFiles: ['index.html'],
      // highlight-next-line
      spa: true
    }
  ]
}
```

将编译打包好的应用放到 resource 目录即可
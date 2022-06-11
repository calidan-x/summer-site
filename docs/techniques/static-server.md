---
sidebar_position: 20
---

# Static Server

### Config

in config/default.config.ts or other env config
```ts
import { SERVER_CONFIG } from '@summer-js/summer';

export const SERVER_CONFIG: ServerConfig = {
  port: 8801,
  // highlight-start
  static: [
    {
      requestPathRoot: '/static',
      destPathRoot: 'resource',
      indexFiles: ['index.html']
    }
  ]
  // highlight-end
}
```

**requestPathRoot** static path access root<br/>
**destPathRoot** server-side access folder<br/>
**indexFiles** index files list

Write a simple html
```html
<html>
  <body>
    Hello Summer
  </body>
</html>
```
Put index.html to ./resource/index.html, access by browser http://127.0.0.1:8801/static/ 

:::caution
./resource is the default resource folder for summer framework destPathRoot should be set to this folder or subfolder
:::
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
      requestPath: '/static',
      destPath: 'resource',
      indexFiles: ['index.html']
    }
  ]
  // highlight-end
}
```

**requestPath** static path access root<br/>
**destPath** server-side access folder<br/>
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
./resource is the default resource folder for summer framework destPath should be set to this folder or subfolder
:::


### Serve SPA
Summer supports serving SPA (Single Page Application) like React / Vue / Svelte app.
To enable SPA redirecting feature simply add **spa:ture** to config.

```ts
import { SERVER_CONFIG } from '@summer-js/summer';

export const SERVER_CONFIG: ServerConfig = {
  port: 8801,
  
  static: [
    {
      requestPath: '/static',
      destPath: 'resource',
      indexFiles: ['index.html'],
      // highlight-next-line
      spa: true
    }
  ]
}
```
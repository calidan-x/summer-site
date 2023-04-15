---
sidebar_position: 73
---

# Logging

### Log Output

```ts
import { Controller, Get, Logger } from '@summer-js/summer';

@Controller
export class LoggerController {
  @Get('/log')
  add() {
    Logger.log('log');
    Logger.info('info');
    Logger.error('error');
    Logger.warn('warn');
    Logger.debug('debug');
  }
}
```

```
[2022-04-06 07:22:25][LOG] log
[2022-04-06 07:22:25][INFO] info
[2022-04-06 07:22:25][ERROR] error
[2022-04-06 07:22:25][WARN] warn
[2022-04-06 07:22:25][DEBUG] debug
```

 
---
sidebar_position: 72
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
    Logger.warning('warning');
    Logger.debug('debug');
  }
}
```

```
[2022-04-06 07:22:25][LOG] log
[2022-04-06 07:22:25][INFO] info
[2022-04-06 07:22:25][ERROR] error
[2022-04-06 07:22:25][WARNING] warning
[2022-04-06 07:22:25][DEBUG] debug
```


### Set Log Type

```ts
// only log Warning and Error
Logger.logType = ['Warning','Error']
````
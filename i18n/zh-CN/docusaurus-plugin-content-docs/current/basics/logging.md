---
sidebar_position: 73
---

# 日志

简单的日志记录格式化输出

```ts
import { Controller, Get, Logger } from '@summer-js/summer';

@Controller
export class LoggerController {
  @Get('/log')
  add() {
    Logger.log('日志');
    Logger.info('信息');
    Logger.error('错误');
    Logger.warn('警告');
    Logger.debug('调试');
  }
}
```

```
[2022-04-06 07:22:25][LOG] 日志
[2022-04-06 07:22:25][INFO] 信息
[2022-04-06 07:22:25][ERROR] 错误
[2022-04-06 07:22:25][WARN] 警告
[2022-04-06 07:22:25][DEBUG] 调试
```

 
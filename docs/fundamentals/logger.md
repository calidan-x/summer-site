---
sidebar_position: 72
---

# 日志

简单的日志记录格式化输出

```ts
import { Controller, Get, Logger } from '@summer-js/summer';

@Controller
export class LoggerController {
  @Get('/log')
  add() {
    Logger.log('警告');
    Logger.info('信息');
    Logger.error('错误');
    Logger.warning('警告');
  }
}
```

```
[2022-04-06 07:22:25][INFO] 信息
[2022-04-06 07:22:25][ERROR] 错误
[2022-04-06 07:22:25][WARNING] 警告
```
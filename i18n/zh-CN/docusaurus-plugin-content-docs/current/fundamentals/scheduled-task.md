---
sidebar_position: 72
---

# 定时任务
 

```ts title="使用 cron 触发定时任务"
import { Scheduled, Service } from '@summer-js/summer'

// highlight-next-line
@Service
export class TaskService {
  // highlight-next-line
  @Scheduled({ cron: '* * * * *', timeZone: 'UTC' })
  print() {
    console.log(new Date())
  }
}
```


```ts title="使用 fixedRate 触发定时任务"
import { Scheduled, Service } from '@summer-js/summer'

// highlight-next-line
@Service
export class TaskService {
  // highlight-next-line
  @Scheduled({ fixedRate: 1000 })
  print() {
    console.log(new Date())
  }
}
```
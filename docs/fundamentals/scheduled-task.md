---
sidebar_position: 72
---

# Scheduled Task
 

```ts title="cron trigger"
import { Scheduled, Service } from '@summer-js/summer'

// highlight-next-line
@Service
export class TaskService {
  // highlight-next-line
  @Scheduled({ cron: '* * * * *', timeZone:"UTC" })
  print() {
    console.log(new Date())
  }
}
```


```ts title="fixed rate trigger"
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
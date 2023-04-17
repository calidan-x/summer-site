---
sidebar_position: 73
---

# 路径别名
 
Summer 支持使用路径别名，Summer编译器对别名做了适配，会将别名路径转成相对路径以便编译好的代码可以在Node上直接运行。

路径别名可以用于处理深层相对路径引用的问题，例如：

```ts
import { TodoService } from '../../../service'
```

要使用路径别名，需要先在 tsconfig.json 中配置别名
```json title="tsconfig.json"
{
  "compilerOptions": {
    ......
    "paths": {
      // highlight-next-line
      "@/*": ["./src/*"]
    }
  }
}
```

这样在代码中你就可以使用@代指src目录了:
```ts
import { TodoService } from '@/service'
```
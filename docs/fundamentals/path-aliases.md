---
sidebar_position: 73
---

# Path Aliases
 
Summer supports path aliases, Summer compiler converts alias path to relative path so that output js file can be run in Node.

Path aliases can help avoid writing deep relative paths likes:
```ts
import { TodoService } from '../../../service'
```

To use path aliases, add paths config in tsconfig.json
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

Now you can import variable by:
```ts
import { TodoService } from '@/service'
```
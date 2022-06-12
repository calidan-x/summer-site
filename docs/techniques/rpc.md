---
sidebar_position: 8
---

# RPC

To avoid developing controllers and restful APIs, summer provides a RPC module let service methods can be called between micro-services.

### Server

```ts title="src/default.config.ts"
export const RPC_CONFIG: RpcConfig = {
  provider: {
    accessKey: 'xxxxx'
  }
}
```

```ts  
import { RpcProvider } from '@summer-js/summer'

@RpcProvider
export class UserRpcService {
  getUser(id: number) {
    return { id, name: 'John' }
  }
  getUsers() {
    return [
      { id: 1, name: 'John' },
      { id: 2, name: 'Tom' }
    ]
  }
}
```


### Client

```ts title="src/default.config.ts"
export const RPC_CONFIG: RpcConfig = {
  client: {
    RPC_SOURCE: {
      url: 'https://api.example.com',
      accessKey: 'xxxxx'
    }
  }
}
```

```ts
import { RpcClient } from '@summer-js/summer'

class User {
  id: number
  name: string
}

@RpcClient('RPC_SOURCE')
export class UserRpcService {
  getUser: (id: number) => Promise<User>
  getUsers: () => Promise<User[]>
}
```

:::tip
Both server/client class names should be same.<br/>
The return type must be a Promise type for the client.
:::

```ts
// If the client cannot define a same name class, the second param for @RpcClient can setup server class name
// highlight-next-line
@RpcClient('RPC_SOURCE','UserRpcService')
export class UserRpcClient {
  getUser: (id: number) => Promise<User>
  getUsers: () => Promise<User[]>
}

```


### Decorators

|  Decorators   | Usage  |
|  ----  | ----  |
| @RpcProvider | Rpc Provider |
| @RpcClient | Rpc Client | 

---
sidebar_position: 8
---

# RPC调用

Summer 提供了一种简单的远程调用 Service 的方法，RPC调用可以省去开发controller接口层，实现不同微服务 service 到 service 的直接调用。

![](/img/rpc.svg)

### 服务端

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


### 调用端

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
服务端与调用端的class名字方法要一致，调用方的返回值需要定义成Promise泛型
:::

```ts
// 若调用方class名字无法与服务端不一致，可以在Rpc第二个参数指定服务端的class名字
@RpcClient('RPC_SOURCE','UserRpcService')
export class UserRpcClient {
  getUser: (id: number) => Promise<User>
  getUsers: () => Promise<User[]>
}

```

:::tip
rpc 调用可以对远程端返回的结果进行类型校验，需要将返回 Promise 泛型定义成class类型<br/>
若不校验可以定义成interface
:::


### 相关 Decorators

|  Decorator   | 作用  |
|  ----  | ----  |
| @RpcProvider | 提供RPC服务（可被注入） |
| @RpcClient | 调用RPC服务 | 

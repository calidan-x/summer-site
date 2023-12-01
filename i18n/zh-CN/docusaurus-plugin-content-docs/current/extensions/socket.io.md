---
sidebar_position: 60
---

# Socket.IO

### Install

```shell
npm install socket.io
npm install @summer-js/socket.io
```


### Config

```ts title="default.config.ts"
import { SocketIOConfig } from '@summer-js/socket.io'

// SOCKET_IO_CONFIG 必须赋值，就算是一个配置项也没有
export const SOCKET_IO_CONFIG: SocketIOConfig = {
    // path?: string | undefined;
}
```

### Use in Controller

```ts
import { SocketIOController, On, IO } from '@summer-js/socket.io'
import { Socket } from 'socket.io'

class MsgData {
  msg: string
}

// highlight-next-line
@SocketIOController
export class IOEventController {
  // 自动注入
  io: IO

  @On connection(socket: Socket) {
    console.log(socket.request.headers)
    socket.send('Welcome')
  }

  @On disconnecting(socket: Socket) {
    // 即将断开连接逻辑
  }

  @On disconnect(socket: Socket) {
    // 断开连接逻辑
  }

  @On message(socket: Socket, data: MsgData) {
    console.log(data)
    socket.emit('message', { hi: 'Hi' })
  }

  // when event name cannot use method name represent
  @On('io-message') ioMessage(socket: Socket, data: MsgData) {
    console.log(data)
    socket.emit('evt', 'Hello')
  }

}

```

:::note
connection / disconnecting / disconnect 是 Socket.IO 固定的事件
:::

:::info
类 `MsgData` 可以用来验证请求数据的结构以确保每次请求的安全性. 如果你不想验证请求结构，可以使用any，或者interface定义结构。
验证错误信息会发到客户端的 `error` 事件上。
:::
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

// the SOCKET_IO_CONFIG must set even no option
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
  // auto-injection
  io: IO

  @On connection(socket: Socket) {
    console.log(socket.request.headers)
    socket.send('Welcome')
  }

  @On disconnecting(socket: Socket) {
    // disconnecting logic
  }

  @On disconnect(socket: Socket) {
    // disconnect logic
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
connection / disconnecting / disconnect are Socket.IO build-in event
:::

:::info
Class `MsgData` can verify incoming message structure to make every calls safe. If you don't what to verify, use interface instead.
Data verify error send to client's `error` event
:::
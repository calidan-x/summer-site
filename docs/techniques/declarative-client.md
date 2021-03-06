---
sidebar_position: 7
---

# Declarative Request Client

 

```ts title="SendGrid"
import { Body, createRequestClientDecorator, Send } from '@summer-js/summer'

const SendGrid = createRequestClientDecorator((config) => ({
  baseUrl: 'https://api.sendgrid.com',
  headers: {
    // <<API_KEY>> can be read from config
    Authorization: 'Bearer <<API_KEY>>',
    'Content-Type': 'application/json'
  }
}))

interface SendMailData {
  personalizations: [{ to: [{ email: string; name: string }]; subject: string }]
  content: [{ type: 'text/plain'; value: string }]
  from: { email: string; name: string }
}

@SendGrid
export class SendGridClient {
  @Send('POST', '/v3/mail/send')
  sendEmail(@Body data: SendMailData) {
    // You don't need to do any implement
    return
  }
}
```

```ts title="call another service"
import { createRequestClientDecorator, PathParam, Query, Send } from '@summer-js/summer'

const BookApp = createRequestClientDecorator((config) => ({
  baseUrl: 'https://api.example.com'
}))

class Book{
  id: number
  name: string
}

@BookApp
export class BookAppClient {
  @Send('GET', '/v1/books/:id')
  getBookById(@PathParam id: number): Promise<Book> { return }

  @Send('GET', '/v1/books')
  getBooks(@Query name: string): Promise<Book[]> { return }
}
```

:::tip
You don't need to implement the method, only write a 'return', codes will be generated by the decorator.
:::

:::tip
The return type must be a Promise type.
:::


### Api/Decorators


|  Api/Decorator   | Usage  |
|  ----  | ----  |
| createRequestClientDecorator | create request client |
| @Send | Send request |
| @Body | Body to send |
| @Query | Query param to send |
| @Queries |All Queries to send |
| @PathParam |Path param to replace the request url |
---
sidebar_position: 7
---

# 声明式请求客户端

:::caution
这个功能将会在未来版本移除
:::


微服务之间调用或服务调用第三方应用可以使用声明式请求客户端。<br/>

使用声明式请求客户端的目的是使用装饰器的方式自动的生成请求代码，比起传统的方法请求编写更简洁美观。

```ts title="调用SendGrid发邮件"
import { Body, createRequestClientDecorator, Send } from '@summer-js/summer'

const SendGrid = createRequestClientDecorator((config) => ({
  baseUrl: 'https://api.sendgrid.com',
  headers: {
    // <<API_KEY>> 可以从传入的环境 config 获取
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
    // 此处不需要写任何实现
    return
  }
}
```

```ts title="调用其他微服务接口"
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
实现方法只需要写入一个空 return 不需要写任何其他内容，写 return 是为了使 IDE 验证通过
:::

:::tip
请求调用可以对API返回的结果进行类型校验，需要将返回 Promise 泛型定义成class类型<br/>
若不校验可以定义成interface
:::


### 相关 Api/Decorator


|  Api/Decorator   | 作用  |
|  ----  | ----  |
| createRequestClientDecorator | 创建请求客户端（可被注入） |
| @Send | 设置请求方法与路径 |
| @Body | 标记为发送body |
| @Query | 标记为发送query |
| @Queries |标记为发送queries |
| @PathParam |标记为发送path参数 |
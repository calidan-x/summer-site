---
sidebar_position: 50
---

# DTO 转换


通常而言DTO转换是后端处理必不可少的环节，会占据后端大量代码。

一个请求结构，需要转换成与数据相同的模型字段才可以存入，从数据库读取出来的内容也需要做一定的裁切拼装才以接口形式输出给前端。

Summer专门为DTO转换提供了2个便利方法。



### 数据转换
```ts
convertData(instance,Class)
```
该函数可以把前一个实例的字段赋值到新类型实例中，多余的字段会被忽略，字段类型不一致会报错

```ts
import { Controller, Post, Body, convertData } from '@summer-js/summer';

// request DTO
class AddBookRequest {
  title: string;
  author: string;
}

// entity class
class Book {
  id: number;
  title: string;
  author: string;
}

@Controller('/v1')
export class BookController {
  @Post('/books')
  add(@Body addBookRequest: AddBookRequest) {
    const book: Book = convertData(addBookRequest, Book);
    /* equals 
    const book: Book = new Book();
    book.title = addBookRequest.title;
    book.author = addBookRequest.author;
    */
    console.log(book);
  }
}
```


:::tip 为什么不使用 Object.assign()
Object.assign()确实也可以达到类似的效果，但是在赋值无法使用TS判断类型，并且有可能给目标对象添加额外属性
:::




### 数据填充
```ts
fillData(instance:T,data:T);
```
该函数可以把一段数据灌入前一个实例中，多余的字段会被忽略，类型不相同会报错

```ts

import { Controller, fillData, Get, PathParam } from '@summer-js/summer';

class Person {
  id: number;
  name: string;
  age: int;
}

class Book {
  id: number;
  title: string;
}

class BookResource {
  id: number;
  title: string;
  author: Person;
}

@Controller
export class BookController {
  @Get('/books/:id')
  list(@PathParam id: number) {
    const bookResource: BookResource = new BookResource();
    const book: Book = new Book();
    book.id = id;
    fillData(bookResource, book);
    bookResource.author = new Person();
    return bookResource;
  }
}


```
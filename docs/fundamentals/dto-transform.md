---
sidebar_position: 50
---

# DTO 转换

DTO转换是后端开发重要环节，通常一个数据库系统从。。。。。

Summer为DTO转换提供了2个便利方法

通常一个请求DTO是数据库的一部分

### 数据类型转换
```ts
convertData(instance:T,class) => T
```


```ts
import { Controller, Post, Body, Required, convertData } from '@summer-js/summer';

// request DTO
class AddBookRequest {
  @Required()
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


:::tip
为什么不使用 Object.assign()？
Object.assign()确实也可以达到类似的效果，但是在赋值过程中无法法判断类型，并且有可能给目标对象添加额外属性
:::




### 数据填充
```ts
fillData(instance:T,data:T);
```


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
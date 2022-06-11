---
sidebar_position: 50
---

# DTO Conversion

Normally DTO conversion is an essential part that takes a lot of backend code.

A request structure needs to convert to an entity structure before saving to DB, and an entity read from DB needs to convert to a response structure so that can be sent to the frontend.

These two processes always produce lots of codes, to make it simpler, Summer provides 2 simple and safe functions for conversion.
 


### Instance Type Conversion
```ts
convertData(instance,Class)
```
This function converts an instance to another instance type.

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
    /* equals to:
    const book: Book = new Book();
    book.title = addBookRequest.title;
    book.author = addBookRequest.author;
    */
    console.log(book);
  }
}
```




### Data Filling
```ts
fillData(instance:T,data:T);
```
This function helps inject data into an existing instance.

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
  personId: number
}

class BookResource {
  id: number;
  title: string;
  author: Person;
}

@Controller
export class BookController {
  @Get('/books/:id')
  bookDetail(@PathParam id: number) {
    const bookResource: BookResource = new BookResource();
    const book: Book = /* read book from DB */
    bookResource.author = /* read book from DB */

    // note that the personId will be ignore
    fillData(bookResource, book);
    return bookResource;
  }
}


```
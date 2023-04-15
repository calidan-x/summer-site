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
    // highlight-next-line
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
import { Controller, fillData, Get, PathParam } from '@summer-js/summer'

class Book {
  id: number
  title: string
  createTime: Date
  updateTime: Date
}

class Author {
  authorId: number
  authorName: string
  photo: string
}

class BookResource {
  id: number
  title: string
  authorId: number
  authorName: string
  photo: string
}

@Controller
export class BookController {
  @Get('/books/:id')
  bookDetail(@PathParam id: number) {
    const bookResource: BookResource = new BookResource()
    const book: Book = { id, title: 'DUNE', createTime: new Date(), updateTime: new Date() }
    const author: Author = { authorId: 1, authorName: 'Frank Herbert', photo: 'https://photo.exmaple.com/xxx.jpg' }
    // highlight-next-line
    fillData(bookResource, book)
    // highlight-next-line
    fillData(bookResource, author)
    return bookResource
  }
}
```

```json title="GET http://127.0.0.1:8801/books/123"
{
    "id":123,
    "title":"DUNE",
    "authorId":1,
    "authorName":"Frank Herbert",
    "photo":"https://photo.exmaple.com/xxx.jpg"
}
```
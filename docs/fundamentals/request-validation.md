---
sidebar_position: 20
---

# Request Validation

:::tip Runtime TypeScript Type Validation
Summer can validate TypeScript type in runtime, so everything is just as simple as writing normal code. <br/>
The request DTO must be a class.
:::


## Supported Validation Types
|  Type   |  Description |
|  ----  | ----  |
| boolean | Boolean type |
| number | Number type |
| string | String type |
| int | Integer type |
| bigint | BigInt type |
| Date | Date type |
| enum | Enum（includes Numeric Enum and String Enum) |
| 't1' \| 't2' | String Union type |
| {object} | Object |
| array[] | Array |
| generic&lt;T&gt; | Simple Generic Object type|


## Data Restriction Decorators
|  Decorators   | Usage  |
|  ----  | ----  |
| ? | optional |
| @Min(min: number)  | use in number/int/bigint minimum |
| @Max(max: number)  | use in number/int/bigint maximum |
| @MinLen(minLen: number)  | use in string/array[] minimum length |
| @MaxLen(maxLen: number)  | use in string/array[] maximum length |
| @Email  |  use in string email format |
| @Pattern(regexp :RegExp)  | use in string match RegExp |
| @Validate(func: (val: any) => boolean \| string )  | custom validation,<br/> pass in value and return true \| "Error Message"<br/> to determine validation result |
| @IgnoreUnknownProperties | allow undefined property in request DTO |
 



## General Validation Example
```ts title="src/dto/request/book.ts"
enum BookType {
  Fiction = 0,
  Education = 1
}

class AddBookRequest {
  // validate title is string type
  title: string;
  // validate author is string type
  author: string;
  // validate type is "Fiction" or "Education"
  type: BookType;
  // validate pageCount is an integer
  pageCount: int;
}
```

```ts title="src/controller/BookController.ts"
import { Controller, Post, Body } from '@summer-js/summer'
import { AddBookRequest } from '../dto/request/book'

@Controller('/v1')
export class BookController {
  @Post('/books')
  add(@Body addBookRequest: AddBookRequest) {
    console.log(addBookRequest)
  }
}
```



## Type Validation

### Integer Validation
**int** is not a primitive type in TypeScript, this type is an extension type in Summer which is only used for integer validation, in normal code int works like a **number**.

```ts title="src/controller/BookController.ts"
import { Controller, Get, PathParam } from '@summer-js/summer'

@Controller
export class BookController {
  @Get('/books/:inx')
  book(@PathParam inx: int) {
    const books = ['Harry Potter', 'The Great Gatsby', 'Dune']
    return books[inx]
  }
}
```

```json title="Get http://127.0.0.1:8801/todos/1.5"
{
  message: "Validation Failed",
  errors: [
    {
      param: "inx",
      message: "'1.5' is not an integer"
    }
  ]
}
```

### Enum Validation

Enum validates the pass in param is a string key of enum.

```ts title="src/controller/BookController.ts"
import { Controller, Get, Query } from '@summer-js/summer'

enum BookType {
  Fiction = 0,
  Education = 1
}

@Controller
export class BookController {
  @Get('/books')
  addBook(@Query type: BookType) {
    if (type === BookType.Education) {
      console.log('Searching Education Books...')
    } else if (type === BookType.Fiction) {
      console.log('Searching Fiction Books...')
    }
  }
}
```


```json title="GET http://127.0.0.1:8801/books?type=Romance"
{
    "message":"Validation Failed",
    "errors":[
        {
            "param":"type",
            "message":"'Romance' is not in [\"Fiction\",\"Education\"]"
        }
    ]
}
```

```json title="GET http://127.0.0.1:8801/books?type=Fiction"
Searching Fiction Books...
```


### Date Validation

Date validates the pass in param is a date/datetime string format like '2022-10-01' or '2022-10-01 12:00:00'<br/>

```ts title="src/controller/BookController.ts"
import { Controller, Get, Query } from '@summer-js/summer'

@Controller
export class BookController {
  @Get('/books')
  addBook(@Query createDate: Date) {
    console.log('Searching Books in created in ' + createDate)
  }
}
```

```json title="GET http://127.0.0.1:8801/books?createDate=xxx"
{
    "message":"Validation Failed",
    "errors":[
        {
            "param":"createDate",
            "message":"error parsing 'xxx' to Date"
        }
    ]
}
```

### Boolean Validation
String 'true'/'false' '0'/'1', Number 0/1 can be recognized as boolean for validation


```ts title='Validation boolean query data'
import { Controller, Get, Query } from '@summer-js/summer';

@Controller
export class ExampleController {
  @Get('/boolean-test')
  hello(@Query isDone: boolean) {
    console.log(typeof isDone, isDone);
  }
}
```

```json title="GET http://localhost:8801/boolean-test?isDone=true"
boolean true
```

```json title="GET http://localhost:8801/boolean-test?isDone=0"
boolean false
```

### int/number array Validation
String "1,3,10" can be recognized as int[\]/number[\] for validation

```ts title="src/controller/BookController.ts"
import { Controller, Delete, PathParam } from '@summer-js/summer'

@Controller
export class BookController {
  @Delete('/books/:ids')
  deleteBooks(@PathParam ids: int[]) {
    console.log('Delete Books id in ' + JSON.stringify(ids))
  }
}
```

```json title="http://127.0.0.1:8801/books/12,15,31"
Delete Books id in [12,15,31]
```


## Data Restriction

```ts
import { Controller, Post, Body, Min, MaxLen  } from '@summer-js/summer';

enum BookType {
  Fiction = 0,
  Education = 1
}

class AddBookRequest { 
  title: string;

  // no more than 50 chars
  @MaxLen(50)
  author: string;

  type: BookType;

  // pageCount must bigger than 0
  @Min(1)
  pageCount: int;
}

@Controller('/v1')
export class BookController {
  @Post('/books')
  add(@Body addBookRequest: AddBookRequest) {
    console.log(addBookRequest);
  }
}
```



## Required or Optional

:::tip Required Param and Optional Param
use '?' to mark the param is an optional param, optional param can set a default value<br/>
:::


```ts
class PersonRequest{
  name: string
  age?: number = 12
}
```

notice the '**?**' optional token also works in method params
```ts
@Get(/books)
addBooks(@Query keyword?: string){
  // code
}
```


## Object Validation

```ts title="src/dto/request/book.ts"
export enum Gender {
  Female = 1,
  Male = 2
}

export class Person {
  name: string;
  age: int;
  gender: Gender;
}

export class Book {
  title: string;
  author: Person;
}
```

```ts
import { Controller, Post, Body } from '@summer-js/summer';
import { Book } from '../dto/request/book'

@Controller
export class BookController {
  @Post('/books')
  addBook(@Body book: Book) {
    console.log(typeof book, book);
  }
}
```

## Object Array Validation

```ts title="src/dto/request/book.ts"
export class Book {
  title: string;
  author: string;
}
```

```ts title="src/controller/BookController.ts"
import { Controller, Post, Body } from '@summer-js/summer';
import { Book } from '../dto/request/book'

@Controller
export class BookController {
  @Post('/books')
  addBooks(@Body param: Book[]) {
    console.log(typeof param, param);
  }
}
```


## Class Inherit Validation

```ts title="src/dto/request/animal.ts"
class Animal {
  name: string
  weight: number
}

export class Dog extends Animal {
  noseLength: number
  eyesColor: 'blue' | 'brown'
}
```

```ts title="src/controller/AnimalController.ts"
import { Controller, Post, Body } from '@summer-js/summer'
import { Dog } from '../dto/request/animal'

@Controller
export class AnimalController {
  @Post('/dogs')
  add(@Body dog: Dog) {
    console.log(typeof dog, dog)
  }
}
```

## Custom Validation

```ts title="src/dto/request/book.ts"
import { Validate } from '@summer-js/summer'

export class Book {
  @Validate((val: string) => {
     if(val.substring(0, 1).toUpperCase() === val.substring(0, 1)){
      // return true to pass validation
      return true
     }
     // or return an error message
     return "Title must starts with uppercase letter"
  })
  title: string
}
```

```ts title="src/controller/BookController.ts"
import { Controller, Body, Post } from '@summer-js/summer'
import { Book } from '../dto/request/book'

@Controller
export class BookController {
  @Post('/books')
  detail(@Body book: Book) {
    return book
  }
}
```

## Simple Generic Type Validation

```ts title="src/dto/request/animal.ts"
export class Dog {
  name: string
  weight: number
}

export class Cat {
  name: string
  tailLength: number
}

export class AnimalRequest<T>{
  obj: T
  count: number
}
```

```ts title="src/controller/AnimalController.ts"
import { Controller, Post, Body } from '@summer-js/summer'
import { Dog, Cat, AnimalRequest } from '../dto/request/animal'

@Controller
export class AnimalController {
  @Post('/dogs')
  addDog(@Body dog: AnimalRequest<Dog>) {
    console.log(dog)
  }

  @Post('/cats')
  addCat(@Body cat: AnimalRequest<Cat>) {
    console.log(cat)
  }
}
```

:::caution Generic Type in Summer
Summer only supports simple generic type in runtime.<br/>
Complicated generic type is unsupported.
:::

```ts

class TObj<T>{
  a: T
}

class PObj{
  a: number
}

class Obj<T, K, G> {
  field1: T
  field2: K
  field3: G
  filed4: TObj<int>
}

// work
@Post
api(@Body body: Obj<int[], string, boolean>) { }

// work
@Post
api(@Body body: Obj<int[], string, PObj>) { }

// not work, may cause error
@Post
api(@Body body: Obj<int[], string, TObj<TObj<TObj<number>>>>) { }

```

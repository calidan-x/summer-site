---
sidebar_position: 20
---

# Request Validation

### Validate Request Data
:::tip Runtime TypeScript Type Validation
Summer can validate TypeScript type in runtime, so everything just as simple as writing normal code. <br/>
The request DTO must be a class.
:::

### General Validation Example
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

### Supported Validation Types
|  Type   |  Description |
|  ----  | ----  |
| boolean | Boolean type |
| number | Number type |
| string | String type |
| int | Integer type |
| bigint | BigInt type |
| Date | Date type |
| enum | Enum（including Numeric Enum and String Enum) |
| 't1' \| 't2' | String Union type |
| File | upload file |
| {object} | Object |
| array[] | Array |



### Integer Validation
**int** is not a primitive type in TypeScript, this type is an extension type in Summer which is only used for integer validation, in normal code int works like a **number**.

```ts title="src/controller/TodoController.ts"
import { Controller, Get, PathParam } from '@summer-js/summer';

@Controller
export class TodoController {
  
  @Get('/todos/:inx')
  detail(@PathParam inx: int) {
    const todoList = ['Lean Summer', 'Watch TV', 'Play NS Game'];
    return todoList[inx];
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

:::info Enum Validation
Enum validates the pass in param is a string key of enum.
:::

:::info Date Validation
Date validates the pass in param is a date/datetime string format like '2022-10-01' or '2022-10-01' 12:00:00<br/>
:::

:::info Boolean Validation
if boolean type use single @Query validate, the string 'true'/'false' number 0/1 can be treat like boolean for validation
:::

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

```
GET http://localhost:8801/boolean-test?isDone=true
will output: boolean true
```

```
GET http://localhost:8801/boolean-test?isDone=0
will output: boolean false
```


### Data Restriction and Optional Validation

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

### Data Restriction Decorators
|  Decorators   | Usage  |
|  ----  | ----  |
| ? | optional |
| @Min  | use in number/int/bigint minimum |
| @Max  | use in number/int/bigint maximum |
| @MinLen  | use in string/array[] minimum length |
| @MaxLen  | use in string/array[] maximum length |
| @Email  |  use in string email format |
| @Pattern  | use in string match RegExp |
| @Validate  | custom validation, pass in value and return true/false to determine validation result |
| @IgnoreUnknownProperties | allow undefined property in request DTO |

### Required or Optional

:::tip Required Param and Optional Param
use ? to mark the param is an optional param, optional param can set a default value<br/>
:::


```ts
class PersonRequest{
  name: string
  age?: number = 12
}
```

```ts
// notice the '?' optional token also work in method params
@Get(/books)
addBooks(@Query keyword?: string){
  // you code
}
```


```ts
class BlogRequest{
  // title cannot post as empty string
  title!: string
  context: string
}
```


### Array Validation

```ts  
import { Controller, Post, Body } from '@summer-js/summer';

class Book {
  title: string;
  author: string;
}

@Controller
export class BookController {
  @Post('/books')
  addBooks(@Body param: Book[]) {
    console.log(typeof param, param);
  }
}
```

### Enum Validation

```ts title='Enum is a very great way to handle magic number'
import { Controller, Post, Body } from '@summer-js/summer';


enum Gender {
  Female = 1,
  Male = 2
}

class Person {
  name: string;
  gender: Gender;
}

@Controller
export class PersonController {
  @Post('/persons')
  addBooks(@Body person: Person) {
    // person.gender value(1/2) is the value of Gender.Male / Gender.Female
    console.log(person.gender)

    // save the integer value to DB

    return person
    // person.gender will be serialized to string 'Male'/'Female' to frontend
  }
}
```


### Object Validation

```ts
import { Controller, Post, Body } from '@summer-js/summer';

enum Gender {
  Female = 1,
  Male = 2
}

class Person {
  name: string;
  age: int;
  gender: Gender;
}

class Book {
  title: string;
  author: Person;
}

@Controller
export class BookController {
  @Post('/books')
  addBook(@Body book: Book) {
    console.log(typeof book, book);
  }
}
```

### Class Hierarchy Validation

```ts
import { Controller, Post, Body } from '@summer-js/summer';

class Animal {
  name: string;
  weight: number;
}

class Dog extends Animal {
  noseLength: number;
  eyesColor: 'blue' | 'brown';
}

@Controller
export class AnimalController {
  @Post('/dogs')
  add(@Body dog: Dog) {
    console.log(typeof dog, dog);
  }
}
```

### Simple Generic Type Validation
```ts
import { Controller, Post, Body } from '@summer-js/summer';

class Dog {
  name: string
  weight: number
}

class Cat {
  name: string
  tailLength: number
}

class AnimalRequest<T>{
  obj: T
  count: number
}

@Controller
export class AnimalController {
  @Post('/dogs')
  addDog(@Body dog: AnimalRequest<Dog>) { 
    // your code
  }

  @Post('/cats')
  addDog(@Body dog: AnimalRequest<Cat>) {
    // your code
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

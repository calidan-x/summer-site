---
sidebar_position: 20
---

# Request Validation

### Validate Request Data
:::tip Runtime TypeScript Type Validation
Summer can validate TypeScript type in runtime, so everything just as simple as writing normal code, the request DTO must be a class.
:::

```ts
import { Controller, Post, Body } from '@summer-js/summer';

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

@Controller('/v1')
export class BookController {
  @Post('/books')
  add(@Body addBookRequest: AddBookRequest) {
    console.log(addBookRequest);
  }
}
```

### Supported Validation Types
|  Type   |  Description |
|  ----  | ----  |
| boolean | Boolean type |
| number | Number type |
| string | String type |
| int/bigint | Integer type |
| Date | Date type |
| TimeStamp | TimeStamp type |
| enum | Enum（including Numeric Enum and String Enum) |
| 't1' \| 't2' | String Union type |
| File | upload file |
| {object} | Object |
| array[] | Array |



:::info Integer Validation
'int' is not a base type in TypeScript, this type is an extension type in Summer which only use for validation, in normal code int is an alias of number.
:::

:::info Enum Validation
Enum validate the pass in param is a string key of enum. The final value of the filed in request DTO is the value of enum.
:::

:::info Date Validation
Date validate the pass in param is a date/datetime format like 2022-10-01 or 2022-10-01 12:00:00<br/>
TimeStamp validation a timestamp format like 1654777515 or 1654777515000
Both of then will finally convert into a Date object.
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
| ? | Optional Key |
| @Min  | use in number/int/bigint minimum |
| @Max  | use in number/int/bigint maximum |
| @MinLen  | use in string/array[] minimum length |
| @MaxLen  | use in string/array[] maximum length |
| @Email  |  use in string email format |
| @Pattern  | use in string match RegExp |
| @Validate  | custom validation, pass in value and return true/false to determine validation result |

### Required Param and Optional Param

:::tip Required Param and Optional Param
use ? to mark the param is an optional param, optional param can set a default value<br/>
:::

```ts
class PersonRequest{
  name: string
  age?: number = 12
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

---
sidebar_position: 20
---

# 请求校验

### 校验数据类型
:::tip 运行时校验TypeScript类型
Summer支持运行时校验TypeScript类型，所以请求DTO只需要按正常的TypeScript写法就可以了，必须写成class类，不能是interface
:::


## 支持的验证类型
|   类型   |  说明 |
|  ----  | ----  |
| boolean | 布尔型 |
| number | 数字型 |
| string | 字符串型 |
| int | 整形 |
| bigint | 大整型 |
| Date | 日期类型 |
| enum | 枚举（支持数字枚举和字符串枚举) |
| 't1' \| 't2' | 字符串联合类型 |
| {object} | JSON对象 |
| array[] | 数组 |
| generic&lt;T&gt; | 简单的泛型 |


## 数据限制装饰器
|  装饰器   | 用途  |
|  ----  | ----  |
| ? | 选传参数 |
| @Min(min: number)  | 使用在 number/int/bigint 限定最小值 |
| @Max(max: number)  | 使用在 number/int/bigint 限定最大值 |
| @MinLen(minLen: number)  | 使用在 string/array[] 限定最小长度 |
| @MaxLen(maxLen: number)  | 使用在 string/array[] 限定最大长度 |
| @Email  |  使用在 string 限定必须是电子邮件格式 |
| @Pattern(regexp :RegExp)  | 使用在 string 匹配正则 |
| @Validate(func: (val: any) => boolean \| string )  | 自定义验证，验证函数返回 true 时代表验证通过，<br/>返回字符串 "错误信息" 表示验证失败。|
| @IgnoreUnknownProperties | 允许接口发来额外不在请求中定义的字段 |
 



## 请求验证例子
```ts title="src/dto/request/book.ts"
enum BookType {
  Fiction = 0,
  Education = 1
}

class AddBookRequest {
  // 验证 title 必须是字符串，而且是个选传参数，在不传时默认为 "无标题"
  title = "无标题"
  // 验证 author 必须是字符串
  author: string
  // 验证 type 必须是 "Fiction" 或 "Education"
  type: BookType
  // 验证 pageCount 必须是整形
  pageCount: int
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



## 类型验证

### 整形验证
**int** 不是TS/JS的基本类型，这是 Summer 扩展用于做请求验证的类型，在常规代码中int等同于 **number**.

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

### 枚举验证
 
枚举类型验证传入值必须是枚举的其中一个key值

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


### 日期验证

日期验证传入的格式是否为日期格式例如 '2022-10-01' or '2022-10-01 12:00:00'<br/>

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

### 布尔值验证
字符串 'true'/'false' '0'/'1', 数字 0/1 都可以用于验证通过并转成布尔型


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

### 数字型数组验证
带逗号的字符串 "1,3,10" 可以通过int[\]/number[\]的验证

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


## 数据约束

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



## 必传与选传

:::tip 必传与选传
使用 '?' 标记的字段为选传参数，选传参数可以给默认值。<br/>
Summer的选传必须给API接口做了最佳适配，必传代表了必须要有数据，所以必传还有非空的概念。不写 '?' 的传参在传空字符串的时候不会验证通过。
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
addBooks(@Query keyword?: string, @Query pageNumber = 1){
  // code
}
```


## 对象体验证

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

## 对象体数组验证

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


## 类继承验证

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

## 自定义验证

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

## 简单的泛型验证

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

:::caution Summer中的泛型验证
Summer 只支持简单的泛型.<br/>
复杂的泛型无法验证（包扩多层嵌套，复杂结构）
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

// 可以验证
@Post
api(@Body body: Obj<int[], string, boolean>) { }

// 可以验证
@Post
api(@Body body: Obj<int[], string, PObj>) { }

// 不可使用，可能会导致程序错误
@Post
api(@Body body: Obj<int[], string, TObj<TObj<TObj<number>>>>) { }

```

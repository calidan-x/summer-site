---
sidebar_position: 20
---

# 请求校验

### 校验数据类型
:::tip 运行时校验TypeScript类型
Summer支持运行时校验TypeScript类型，所以请求DTO只需要按正常的TypeScript写法就可以了，必须写成class类，不能是interface
:::

```ts
import { Controller, Post, Body } from '@summer-js/summer';

enum BookType {
  Fiction = 0,
  Education = 1
}

class AddBookRequest {
  // 限定title必须是string型
  title: string;
  // 限定author必须是string型
  author: string;
  // 限定type必须是BookType型，传值"Fiction"|"Education"
  type: BookType;
  // 限定pageCount必须是整形
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

### 支持的校验的类型
|  Decorator   | 类型  |
|  ----  | ----  |
| boolean | 布尔型 |
| number | 数字型，包括整数和小数 |
| string | 字符串 |
| int/bigint | 整数 |
| enum | 枚举（包括数字值枚举，字符串值枚举） |
| 't1' \| 't2' | 字符串联合类型 |
| {object} | 对象 |
| array[] | 数组 |



:::info 整形校验
int型不是TypeScript支持的基础数据类型，是Summer额外补充仅用于请求参数的类型，在非校验代码中int型等同于number
:::

:::info 枚举校验
enum型请求数据使用string型，Summer会自动转换成枚举值，便于后续的数据库存储
:::

:::info 布尔型校验
布尔型如果是使用在 @Query 上，字符串 'ture' 'false' '0' '1' 会被转换成布尔型 true/false 
:::

```ts
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
http://localhost:8801/boolean-test?isDone=true
will output: boolean true
```

```
http://localhost:8801/boolean-test?isDone=0
will output: boolean false
```


### 数据长度格式等校验

```ts
import { Controller, Post, Body, Min, MaxLen  } from '@summer-js/summer';

enum BookType {
  Fiction = 0,
  Education = 1
}

class AddBookRequest { 
  title: string;

  // 限定author不超过50个字符
  @MaxLen(50)
  author: string;

  type: BookType;

  // 限定pageCount必须大于或等于1
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

### 数据格式相关Decorator
|  写法   | 作用  |
|  ----  | ----  |
| ? | 选传值 |
| @Min  | 在 number/int/bigint 类型中使用，限制最小值 |
| @Max  | 在 number/int/bigint 类型中使用，限制最大值 |
| @MinLen  | 在string型使用，限制字符串最小长度 |
| @MaxLen  | 在string型使用，限制字符串最大长度 |
| @Email  | 在string型使用，限定格式为email格式 |
| @Match  | 在string型使用，限定匹配正则表达式 |

### 必传参数与选传参数

:::tip 必传参数与选传参数
使用可选?符号标记为可选传参，选传值可以设置默认值<br/>
:::

```ts
class PersonRequest{
  name: string
  age?: number = 12
}
```


### 数组型校验

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

### 复杂对象校验

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

### 继承类校验

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

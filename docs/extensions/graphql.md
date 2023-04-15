---
sidebar_position: 80
---

# GraphQL

### Install

```shell
npm install graphql
npm install @summer-js/graphql
```


### Implement

```ts title="src/graphql/index.ts"
import { buildSchema } from 'graphql'

export const schema = buildSchema(`
type Query {
  users(id: Int): [User]
  books: [String]
}

type User {
  id: Int
  name: String
  age: Int
}

input MessageInput {
  content: String
  author: String
}

type Message {
  id: ID!
  content: String
  author: String
}

type Mutation {
  createMessage(input: MessageInput): Message
}

`)
```
 
```ts title="src/controllers/GraphqlController.ts"
import { Controller, Post, Body } from '@summer-js/summer'
import { handle, GraphQLRequest } from '@summer-js/graphql'
import { schema } from '../graphql'

@Controller
export class GraphqlController {
  @Post('/graphql')
  graphql(@Body req: GraphQLRequest) {
    var rootValue = {
      users: (_query: any) => {
        // data can read from DB here
        return [
          {
            id: 1,
            name: 'Tom',
            age: 123
          }
        ]
      },
      books: () => ['Book1', 'Book2', 'Book3'],
      createMessage({ input }) {
        input.id = 1
        return input
      }
    }
    return handle({ source: req.query, schema, rootValue })
  }
}
```
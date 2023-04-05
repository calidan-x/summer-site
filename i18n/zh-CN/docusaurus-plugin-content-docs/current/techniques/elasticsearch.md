---
sidebar_position: 70
---

# Elasticsearch

### Install

```shell
npm install @elastic/elasticsearch
npm install @summer-js/elasticsearch
```


### Config

```ts title="default.config.ts"
import { ElasticSearchConfig } from '@summer-js/elasticsearch'

export const ELASTICSEARCH_CONFIG: ElasticSearchConfig = {
  node: 'http://localhost:9200'
}
```

### Implement

```ts
import { Controller, Get } from '@summer-js/summer'
import { ESClient } from '@summer-js/elasticsearch'

@Controller('/es')
export class ESController {
  // auto-injection
  esClient: ESClient

  @Get('/search')
  async run() {
    await this.esClient.index({
      index: 'game-of-thrones',
      document: {
        character: 'Ned Stark',
        quote: 'Winter is coming.'
      }
    })

    await this.esClient.index({
      index: 'game-of-thrones',
      document: {
        character: 'Daenerys Targaryen',
        quote: 'I am the blood of the dragon.'
      }
    })

    await this.esClient.index({
      index: 'game-of-thrones',
      document: {
        character: 'Tyrion Lannister',
        quote: 'A mind needs books like a sword needs a whetstone.'
      }
    })

    // here we are forcing an index refresh, otherwise
    await this.esClient.indices.refresh({ index: 'game-of-thrones' })

    // Let's search!
    const result = await this.esClient.search({
      index: 'game-of-thrones',
      query: {
        match: { quote: 'winter' }
      }
    })

    return result.hits.hits
  }
}
```
 
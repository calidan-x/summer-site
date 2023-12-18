---
sidebar_position: 70
---

# Elasticsearch

### 安装

```shell
npm install @elastic/elasticsearch
npm install @summer-js/elasticsearch
```


### 配置

```ts title="default.config.ts"
import { ElasticSearchConfig } from '@summer-js/elasticsearch'

export const ELASTICSEARCH_CONFIG: ElasticSearchConfig = {
  DataSource:{
    node: 'http://localhost:9200'
  }
}
```

### 使用

```ts
import { Controller, Get } from '@summer-js/summer'
import { ESClient } from '@summer-js/elasticsearch'

@Controller('/es')
export class ESController {
  // 自动注入
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

    // 刷新数据
    await this.esClient.indices.refresh({ index: 'game-of-thrones' })

    // 查询
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
 
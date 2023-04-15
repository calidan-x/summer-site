---
sidebar_position: 71
---

# 文件上传

文件上传需要使用 multipart/form-data 的表单形式上传，<br/>
上传成功后可以在controller中获取到上传文件的文件信息与临时保存地址。


```ts
import { Controller, Post, Body, File } from '@summer-js/summer'

class Request {
  field1: string
  field2?: int
  // highlight-next-line
  file: File
}

@Controller('/upload')
export class FileUploadController {
  @Post
  hello(@Body body: Request) {
    console.log('body', body)
    return file
  }
}

```

```json title="服务器返回"
{
    "filename": "1.jpg",
    "encoding": "7bit",
    "mimeType": "image/jpeg",
    "tmpPath": "/var/folders/j8/wm4p8dcd70ngf7hd3ql0ml_h0000gn/T/upload-ed2f42075fa6d7c8970c5284dc154937"
}
```


---
sidebar_position: 71
---

# File Upload

File upload should use multipart/form-data form format, the uploaded file will be saved in a tmp path that can be read by @File.


```ts
import { Controller, Post, UploadedFile, Body, File } from '@summer-js/summer'

class Request {
  field1: string
  field2?: int
}

@Controller('/upload')
export class FileUploadController {
  @Post
  hello(@File file: UploadedFile, @Body body: Request) {
    return file
  }
}

```

```json
{
    "filename": "1.jpg",
    "encoding": "7bit",
    "mimeType": "image/jpeg",
    "tmpPath": "/var/folders/j8/wm4p8dcd70ngf7hd3ql0ml_h0000gn/T/upload-ed2f42075fa6d7c8970c5284dc154937"
}
```


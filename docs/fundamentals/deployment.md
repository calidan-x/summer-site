---
sidebar_position: 90
---

# 服务器部署

### 修改端口号

在 config.default.ts 或对应环境配置修改

```ts
export const SERVER_CONFIG: ServerConfig = {
  port: [端口号]
};
```

```ts title="使用前缀路径"
export const SERVER_CONFIG: ServerConfig = {
  basePath: '/my-service',
  port: [端口号]
};
```

### 编译与打包
Summer使用esbuild打包，最终程序会被打包成一个可执行文件和一份source map文件和一个资源文件夹

执行命令
```
npm run build 或 npx summer -b --env prod
```
:::note
这里的prod是环境名，可以根据命名需求配置生产环境的环境名
:::

生成文件
```
build/index.js
build/index.js.map
```

:::note 关于打包生成的文件
Summer生成的最终执行文件相当简洁，不再有node_modules目录让部署变得更方便，同时编译打包出的执行文件能够直接检测执行环境，可以通过 ``node --enable-source-maps index.js`` 执行，也可以直接传到 AWS Lambda 阿里云函数FC 等无服务器上执行，不需要再做额外配置
:::

### 使用资源文件
创建 src/resouce 文件夹放入资源文件<br/>
src/resouce 目录会自动被打包到 build/resouce 

### 在Linux系统机器部署

1. 将 build/index.js 和 build/index.js.map 文件传上 linux 服务器

2. 执行 `node --enable-source-maps index.js` 启动即可

:::note
--enable-source-maps 可以帮助定位debug错误信息，建议开启
不开启启动速度会更快一些些
:::


### 在Docker/K8S 中部署
1. 创建 Dockerfile

``` title="Dockerfile"
FROM node:14

WORKDIR /usr/src/app

COPY . .

EXPOSE 8801
CMD [ "node", "--enable-source-maps", "server.js" ]
```

2. 执行docker打包
`docker build . -t <your username>/node-web-app`

3. 执行
`docker run -p 80:8801 -d <your username>/node-web-app`

### 在 AWS Lambda 上部署
![](/img/awslambda.jpg)
直接将打包好的 build/index.js 压缩成zip文件上传到Lambda服务器即可



### 在 阿里云 函数计算 FC 上部署
![](/img/alifc1.jpg)
![](/img/alifc2.jpg)
直接将打包好的 build/index.js 压缩成zip文件上传到Lambda服务器即可

:::note Serverless 服务器限制：
* 无法保留程序状态，每次执行完立即销毁<br/>
* 无法使用定时任务(可以用过其他定时器触碰实现)<br/>
* 硬盘文件读写操作受限
:::
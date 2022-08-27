---
sidebar_position: 90
---

# Deployment

### Change Server Config

in default.config.ts or other env config

```ts title="change port number"
export const SERVER_CONFIG: ServerConfig = {
  port: [PORT_NUMBER]
};
```

```ts title="change basePath"
export const SERVER_CONFIG: ServerConfig = {
  basePath: '/my-service',
  port: [PORT_NUMBER]
};
```

### Compile and Build
Summer use esbuild to pack code, the final build folder including:

- an executable file **/build/index.js**
- a source map file  **/build/index.js.map**  
- a resource folder (copy from ./resource) **/build/resource** (optional)

run script to build
``` title="check package.json"
npm run build or npx summer build --env prod
```
:::note
prod is the ENV_NAME
:::


:::note The final compiled file
The final compiled file runs independently without **node_modules**, this makes deployment process much easier.<br/>
To start up the server, simply runs **node --enable-source-maps build/index.js**.<br/>
The file is also compatible with Serverless deployment.
:::

### Resource Files
To deploy your server code with assets,<br/>
create folder **resource** and put the resource files into it.<br/>
**resource** will be copied to **build/resource**.


### Get Build TimeStamp
build timestamp can help to generate update time
```
process.env.SUMMER_BUILD_TIME
```

### Enable Cluster Mode

Clusters of Node.js processes can be used to run multiple instances of Node.js that can distribute workloads among their application threads. When process isolation is not needed, use the worker_threads module instead, which allows running multiple application threads within a single Node.js instance.

```ts title="src/config/default.config.ts"
export const SERVER_CONFIG: ServerConfig = {
  port: 8801,
  clusterMode: true,
  // workersNumber is your deploy machine cpu core count by default
  // or you can set your preferred number
  workersNumber: 4
}
```

### Deploy in Linux Server

1. Put **build/index.js** and **build/index.js.map** to server

2. Run **node --enable-source-maps index.js**

:::note
--enable-source-maps can help to locate server error in ts file.
:::


### Deploy in Docker/K8S
1. Create Dockerfile

``` title="Dockerfile"
FROM node:16

WORKDIR /usr/src/app

COPY ./build .

EXPOSE 80
CMD [ "node", "--enable-source-maps", "index.js" ]
```

2. Build Docker image
`docker build . -t <your username>/node-app`

3. Run
`docker run -p 80:80 -d <your username>/node-app`

### Deploy in AWS Lambda
![](/img/awslambda.jpg)
Zip and upload build/index.js and build/index.js.map to Lambda function
set NODE_OPTIONS=--enable-source-maps in (Configuration->Environment variables) to enable source map.



### Deploy in AliCloud FC
![](/img/alifc1.jpg)
![](/img/alifc2.jpg)
Zip and upload build/index.js and build/index.js.map to FC

 
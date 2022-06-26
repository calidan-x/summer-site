---
sidebar_position: 90
---

# Deployment

### Change Server Config

in default.config.ts or env config

```ts title="change port number"
export const SERVER_CONFIG: ServerConfig = {
  port: [PORT_NUMBER]
};
```

```ts title="alert basePath"
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
npm run build or npx summer -b --env prod
```
:::note
prod is the ENV_NAME
:::



:::note About the final compiled file
The final compiled file can be run independently without **node_modules** which makes the deployment process much easier.<br/>
To startup server simply run **node --enable-source-maps build/index.js**.<br/>
The code is also compatible with Serverless deployment which can detect the running environment.
:::

### Use Resource Files
create folder **./resource** and put the resource files into it.<br/>
**./resource** will be copied to **build/resource**.

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

EXPOSE 8801
CMD [ "node", "--enable-source-maps", "index.js" ]
```

2. Build Docker image
`docker build . -t <your username>/node-web-app`

3. Run
`docker run -p 80:8801 -d <your username>/node-web-app`

### Deploy in AWS Lambda
![](/img/awslambda.jpg)
Zip and upload build/index.js and build/index.js.map to Lambda function
set NODE_OPTIONS=--enable-source-maps in (Configuration->Environment variables) to enable source map.



### Deploy in AliCloud FC
![](/img/alifc1.jpg)
![](/img/alifc2.jpg)
Zip and upload build/index.js and build/index.js.map to FC

 
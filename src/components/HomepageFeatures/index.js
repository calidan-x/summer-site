import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

const isChinese = location.href.includes("zh-CN")

const FeatureList = isChinese
  ? [
      {
        title: "程序员友好",
        Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
        description: <>学习成本低，功能强大，简单易用</>
      },
      {
        title: "运行时 TypeScript",
        Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
        description: (
          <>严格的运行时 TypeScript 验证，自动生成 Swagger 类型文档</>
        )
      },
      {
        title: "其他",
        Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
        description: (
          <>
            自定义装饰器，丰富的扩展（MySQL, Redis,
            GraphQL..），代码打包（支持Serverless模式），RPC调用...
          </>
        )
      }
    ]
  : [
      {
        title: "Programmer Friendly",
        Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
        description: <>every things just as simple & powerful as possible</>
      },
      {
        title: "Runtime TypeScript",
        Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
        description: (
          <>strict runtime typing validation and swagger typing document</>
        )
      },
      {
        title: "More",
        Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
        description: (
          <>
            customer decorators, rich extension(MySQL, Redis, GraphQL..),
            serverless compatible build, RPC …
          </>
        )
      }
    ]

// translate({ id: "homepage.TagLine" })

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}

import React from "react"
import clsx from "clsx"
import Layout from "@theme/Layout"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import styles from "./index.module.css"
import HomepageFeatures from "@site/src/components/HomepageFeatures"

import Translate, { translate } from "@docusaurus/Translate"

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header
      className={clsx("hero", styles.heroBanner)}
      style={{ backgroundColor: "var(--ifm-color-banner-bg)" }}
    >
      <div className="container">
        <img width="100px" src="/img/logo.svg" />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          <Translate id="homepage.TagLine">
            Simple / Powerful / Enterprise
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            style={{ borderRadius: "25px" }}
            to="/docs/intro"
          >
            <Translate id="homepage.GettingStart">Get Started</Translate>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title="Summer" description="Efficient NodeJs Backend Framework">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}

if (typeof window !== "undefined") {
  if (window.location.href.indexOf("www.summerjs.dev") > 0) {
    window.location.href = window.location.href.replace(
      "www.summerjs.dev",
      "summerjs.dev"
    )
  }
}

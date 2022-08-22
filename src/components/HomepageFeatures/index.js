import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

const FeatureList = [
  {
    title: 'Programmer Friendly',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>every things just as simple & powerful as possible</>
  },
  {
    title: 'Runtime TypeScript',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: <>strict runtime typing validation and swagger typing document</>
  },
  {
    title: 'More',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: <>customer decorators, easy DTO conversion, serverless compatible build, RPC …</>
  }
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
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

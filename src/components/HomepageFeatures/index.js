import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

const FeatureList = [
  {
    title: 'Enterprise',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: <>Runtime typescript check</>
  },
  {
    title: 'Extensible',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: <>Custom decorators，plugins</>
  },
  {
    title: 'Programmer Friendly',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>Always easy to learn and easy to use.</>
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

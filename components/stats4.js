import React from 'react'

import PropTypes from 'prop-types'

import './stats4.css'

const Stats4 = (props) => {
  return (
    <div className="thq-section-padding">
      <div className="stats4-max-width thq-section-max-width">
        <div className="stats4-container1">
          <h2 className="stats4-title thq-heading-2">{props.heading1}</h2>
          <span className="stats4-content thq-body-small">
            {props.content1}
          </span>
        </div>
        <div className="stats4-container2">
          <div className="stats4-container3">
            <h2 className="thq-heading-2">{props.stat1}</h2>
            <span className="stats4-text1 thq-body-small">
              {props.stat1Description}
            </span>
          </div>
          <div className="stats4-container4">
            <h2 className="thq-heading-2">{props.stat2}</h2>
            <span className="stats4-text3 thq-body-small">
              {props.stat2Description}
            </span>
          </div>
          <div className="stats4-container5">
            <h2 className="thq-heading-2">{props.stat3}</h2>
            <span className="stats4-text5 thq-body-small">
              {props.stat3Description}
            </span>
          </div>
          <div className="stats4-container6">
            <h2 className="thq-heading-2">{props.stat4}</h2>
            <span className="stats4-text7 thq-body-small">
              {props.stat4Description}
            </span>
          </div>
        </div>
      </div>
      <img
        alt={props.backgroundAlt}
        src={props.backgroundSrc}
        className="stats4-image"
      />
    </div>
  )
}

Stats4.defaultProps = {
  backgroundAlt: 'Informatik',
  stat1: 'Templates',
  stat3Description:
    'Ein Python-Programm, mit dem Sie Videos von überall herunterladen können',
  stat2: 'Converter',
  stat3: 'Downloader',
  stat2Description: 'Konvertieren Sie ihre Dateien in die gewünschten Formate',
  backgroundSrc:
    'https://images.unsplash.com/photo-1455849318743-b2233052fcff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0NzY2OHw&ixlib=rb-4.0.3&q=80&w=1080',
  stat4Description:
    'Erhalten Sie jederzeit Unterstützung durch unseren Kundensupport rund um die Uhr',
  stat1Description:
    'Wählen Sie aus einer Vielzahl professionell gestalteter Vorlagen',
  stat4: '24/7 Support',
  heading1: 'Informatik',
  content1: 'Hier sind alle bisherigen Projekte gelistet',
}

Stats4.propTypes = {
  backgroundAlt: PropTypes.string,
  stat1: PropTypes.string,
  stat3Description: PropTypes.string,
  stat2: PropTypes.string,
  stat3: PropTypes.string,
  stat2Description: PropTypes.string,
  backgroundSrc: PropTypes.string,
  stat4Description: PropTypes.string,
  stat1Description: PropTypes.string,
  stat4: PropTypes.string,
  heading1: PropTypes.string,
  content1: PropTypes.string,
}

export default Stats4

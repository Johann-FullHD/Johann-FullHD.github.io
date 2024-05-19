import React from 'react'

import PropTypes from 'prop-types'

import './timeline3.css'

const Timeline3 = (props) => {
  return (
    <div className="thq-section-padding">
      <div className="timeline3-max-width thq-section-max-width">
        <div className="timeline3-container01">
          <h2 className="timeline3-text thq-heading-2">{props.title1}</h2>
        </div>
        <div className="timeline3-timeline-container">
          <div className="timeline3-step1">
            <div className="timeline3-container02">
              <div className="timeline3-progress0"></div>
              <div className="timeline3-container03"></div>
              <div className="timeline3-progress001"></div>
            </div>
            <div className="timeline3-container04">
              <h3 className="thq-heading-3">{props.card1Date}</h3>
              <span className="timeline3-text02 thq-body-small">
                {props.card1Content}
              </span>
            </div>
          </div>
          <div className="timeline3-step2">
            <div className="timeline3-container05">
              <div className="timeline3-progress002"></div>
              <div className="timeline3-container06"></div>
              <div className="timeline3-progress003"></div>
            </div>
            <div className="timeline3-container07">
              <h3 className="thq-heading-3">{props.card2Date}</h3>
              <span className="timeline3-text04 thq-body-small">
                {props.card2Content}
              </span>
            </div>
          </div>
          <div className="timeline3-step3">
            <div className="timeline3-container08">
              <div className="timeline3-progress004"></div>
              <div className="timeline3-container09"></div>
              <div className="timeline3-progress005"></div>
            </div>
            <div className="timeline3-container10">
              <h3 className="thq-heading-3">{props.card3Date}</h3>
              <span className="timeline3-text06 thq-body-small">
                {props.card3Content}
              </span>
            </div>
          </div>
          <div className="timeline3-step4">
            <div className="timeline3-container11">
              <div className="timeline3-progress006"></div>
              <div className="timeline3-container12"></div>
              <div className="timeline3-progress007"></div>
            </div>
            <div className="timeline3-container13">
              <h3 className="thq-heading-3">{props.card4Date}</h3>
              <span className="timeline3-text08 thq-body-small">
                {props.card4Content}
              </span>
            </div>
          </div>
          <div className="timeline3-step5">
            <div className="timeline3-container14">
              <div className="timeline3-progress008"></div>
              <div className="timeline3-container15"></div>
              <div className="timeline3-progress009"></div>
            </div>
            <div className="timeline3-container16">
              <h3 className="thq-heading-3">{props.card5Date}</h3>
              <span className="timeline3-text10 thq-body-small">
                {props.card5Content}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Timeline3.defaultProps = {
  card1Content: 'Geburt',
  card2Date: '2015 - 2019',
  card4Date: '2024',
  card5Content: 'Schüler des Gymnasiums Dresden - Klotzsche',
  card4Content: 'Vertiefung im Front-End-Developing und lernen von Julia',
  title1: 'Bisherige Lebenstationen',
  card3Content: 'Konfirmation in der evang.-luth. Gemeinde Dresden Klotzsche',
  card3Date: '30.04.2023',
  card2Content:
    'Besuch der 50. Grundschule "Gertrud Caspari" (3 Jahre KLassensprecher)',
  card1Date: '19.07.2008',
  card5Date: '2019 - heute',
}

Timeline3.propTypes = {
  card1Content: PropTypes.string,
  card2Date: PropTypes.string,
  card4Date: PropTypes.string,
  card5Content: PropTypes.string,
  card4Content: PropTypes.string,
  title1: PropTypes.string,
  card3Content: PropTypes.string,
  card3Date: PropTypes.string,
  card2Content: PropTypes.string,
  card1Date: PropTypes.string,
  card5Date: PropTypes.string,
}

export default Timeline3

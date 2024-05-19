import React, { useState } from 'react'

import PropTypes from 'prop-types'

import './timeline1.css'

const Timeline1 = (props) => {
  const [step2, setStep2] = useState(false)
  const [step3, setStep3] = useState(false)
  const [container2, setContainer2] = useState(false)
  const [step0, setStep0] = useState(true)
  const [step1, setStep1] = useState(false)
  const [container0, setContainer0] = useState(true)
  const [container3, setContainer3] = useState(false)
  const [container1, setContainer1] = useState(false)
  return (
    <div className="thq-section-padding">
      <div className="timeline1-max-width thq-section-max-width">
        <div className="timeline1-timeline">
          <div className="timeline1-progress0"></div>
          <div
            onClick={() => {
              setStep0(true)
              setContainer0(true)
              setContainer2(false)
              setStep1(false)
              setStep2(false)
              setContainer1(false)
              setStep3(false)
              setContainer3(false)
            }}
            className="timeline1-step0"
          >
            <span className="thq-body-small">{props.date1}</span>
            <div className="timeline1-container01"></div>
          </div>
          {!step1 && <div className="timeline1-container02"></div>}
          {step1 && <div className="timeline1-container03"></div>}
          {step1 && (
            <div
              onClick={() => {
                setContainer3(false)
                setStep2(false)
                setContainer2(false)
                setStep1(true)
                setStep3(false)
                setContainer1(true)
                setContainer0(false)
              }}
              className="timeline1-container04"
            >
              <span className="thq-body-small">{props.date2}</span>
              <div className="timeline1-container05"></div>
            </div>
          )}
          {!step1 && (
            <div
              onClick={() => {
                setContainer0(false)
                setStep1(true)
                setStep3(false)
                setStep0(true)
                setContainer3(false)
                setContainer1(true)
                setContainer2(false)
                setStep2(false)
              }}
              className="timeline1-container06"
            >
              {container0 && (
                <span className="timeline1-text02 thq-body-small">
                  {props.date2}
                </span>
              )}
              <div className="timeline1-container07"></div>
            </div>
          )}
          {!step2 && <div className="timeline1-container08"></div>}
          {step2 && <div className="timeline1-container09"></div>}
          {!step2 && (
            <div
              onClick={() => {
                setStep1(true)
                setContainer0(false)
                setContainer3(false)
                setStep3(false)
                setContainer1(false)
                setStep0(true)
                setContainer2(true)
                setStep2(true)
              }}
              className="timeline1-container10"
            >
              <span className="timeline1-text03 thq-body-small">
                {props.date3}
              </span>
              <div className="timeline1-container11"></div>
            </div>
          )}
          {step2 && (
            <div
              onClick={() => {
                setContainer0(false)
                setContainer1(false)
                setContainer3(false)
                setContainer2(true)
                setStep3(false)
              }}
              className="timeline1-container12"
            >
              <span className="thq-body-small">{props.date3}</span>
              <div className="timeline1-container13"></div>
            </div>
          )}
          {!step3 && <div className="timeline1-container14"></div>}
          {step3 && <div className="timeline1-container15"></div>}
          {!step3 && (
            <div
              onClick={() => {
                setStep2(true)
                setContainer2(false)
                setStep0(true)
                setContainer3(true)
                setStep1(true)
                setContainer1(false)
                setStep3(true)
                setContainer0(false)
              }}
              className="timeline1-container16"
            >
              <span className="timeline1-text05 thq-body-small">
                {props.date4}
              </span>
              <div className="timeline1-container17"></div>
            </div>
          )}
          {step3 && (
            <div className="timeline1-container18">
              <span className="thq-body-small">{props.date4}</span>
              <div className="timeline1-container19"></div>
            </div>
          )}
          {!step3 && <div className="timeline1-container20"></div>}
          {step3 && <div className="timeline1-container21"></div>}
        </div>
        {container0 && (
          <div className="timeline1-container22">
            <div className="timeline1-content-container thq-flex-column">
              <h3 className="thq-heading-3">{props.date1}</h3>
              <h3 className="thq-heading-3">{props.card1Title}</h3>
              <span className="thq-body-small">{props.card1Content}</span>
            </div>
            <img
              alt={props.card1ImageAlt}
              src={props.card1ImageSrc}
              className="timeline1-image thq-img-ratio-1-1"
            />
          </div>
        )}
        {container1 && (
          <div className="timeline1-container23">
            <div className="timeline1-content-container1 thq-flex-column">
              <h3 className="thq-heading-3">{props.date2}</h3>
              <h3 className="thq-heading-3">{props.card2Title}</h3>
              <span className="thq-body-small">{props.card2Content}</span>
              <div className="timeline1-container24">
                <button type="button" className="thq-button-filled">
                  Explore Features
                </button>
                <button type="button" className="thq-button-outline">
                  Upgrade Now
                </button>
              </div>
            </div>
            <img
              alt={props.card2ImageAlt}
              src={props.card2ImageSrc}
              className="timeline1-image1 thq-img-ratio-1-1"
            />
          </div>
        )}
        {container2 && (
          <div className="timeline1-container25">
            <div className="timeline1-content-container2 thq-flex-column">
              <h3 className="thq-heading-3">{props.date3}</h3>
              <h3 className="thq-heading-3">{props.card3Title}</h3>
              <span className="thq-body-small">{props.card3Content}</span>
              <div className="timeline1-container26">
                <button type="button" className="thq-button-filled">
                  View Results
                </button>
                <button type="button" className="thq-button-outline">
                  Provide Feedback
                </button>
              </div>
            </div>
            <img
              alt={props.card3ImageAlt}
              src={props.card3ImageSrc}
              className="timeline1-image2 thq-img-ratio-1-1"
            />
          </div>
        )}
        {container3 && (
          <div className="timeline1-container27">
            <div className="timeline1-content-container3 thq-flex-column">
              <h3 className="thq-heading-3">Date</h3>
              <h3 className="thq-heading-3">{props.card4Title}</h3>
              <span className="thq-body-small">{props.card4Content}</span>
              <div className="timeline1-container28">
                <button type="button" className="thq-button-filled">
                  Download App
                </button>
                <button type="button" className="thq-button-outline">
                  Learn More
                </button>
              </div>
            </div>
            <img
              alt={props.card4ImageAlt}
              src={props.card4ImageSrc}
              className="timeline1-image3 thq-img-ratio-1-1"
            />
          </div>
        )}
      </div>
    </div>
  )
}

Timeline1.defaultProps = {
  card2ImageSrc:
    'https://images.unsplash.com/photo-1514894780887-121968d00567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0Nzc5Nnw&ixlib=rb-4.0.3&q=80&w=1080',
  card3Title: 'Customer Satisfaction Survey',
  card2ImageAlt: 'New Features Image',
  card4Content: 'Launched our mobile app for easy website building on the go.',
  date3: 'Januar 2024',
  card4Title: 'Mobile App Launch',
  card3Content: 'Conducted a survey to gather feedback from our users.',
  date4: 'Mai 2024',
  card1ImageAlt: 'Platform Launch Image',
  card2Title: 'New Features Added',
  card3ImageSrc:
    'https://images.unsplash.com/photo-1559165317-ea38df4a09cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0Nzc5Nnw&ixlib=rb-4.0.3&q=80&w=1080',
  card4ImageAlt: 'Mobile App Launch Image',
  card4ImageSrc:
    'https://images.unsplash.com/photo-1498409785966-ab341407de6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0Nzc5NXw&ixlib=rb-4.0.3&q=80&w=1080',
  card1Title: 'Erstellen des ersten Projekts',
  card3ImageAlt: 'Survey Image',
  card1ImageSrc:
    'https://images.unsplash.com/photo-1521235465694-a166f9f041cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0Nzc5NXw&ixlib=rb-4.0.3&q=80&w=200',
  card2Content:
    'Introduced new features to enhance website building experience.',
  date1: 'September 2023',
  date2: 'Oktober 2023',
  card1Content:
    'Erstellung des ersten Projektes, welcher sich zum Exif-VIewer entwickelt hat. Kennenlernen der Sprachen Python, HTML und CSS',
}

Timeline1.propTypes = {
  card2ImageSrc: PropTypes.string,
  card3Title: PropTypes.string,
  card2ImageAlt: PropTypes.string,
  card4Content: PropTypes.string,
  date3: PropTypes.string,
  card4Title: PropTypes.string,
  card3Content: PropTypes.string,
  date4: PropTypes.string,
  card1ImageAlt: PropTypes.string,
  card2Title: PropTypes.string,
  card3ImageSrc: PropTypes.string,
  card4ImageAlt: PropTypes.string,
  card4ImageSrc: PropTypes.string,
  card1Title: PropTypes.string,
  card3ImageAlt: PropTypes.string,
  card1ImageSrc: PropTypes.string,
  card2Content: PropTypes.string,
  date1: PropTypes.string,
  date2: PropTypes.string,
  card1Content: PropTypes.string,
}

export default Timeline1

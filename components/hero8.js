import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './hero8.css'

const Hero8 = (props) => {
  return (
    <div className="hero8-header26 thq-section-padding">
      <div className="hero8-max-width thq-section-max-width thq-flex-column">
        <div className="hero8-column">
          <div className="hero8-content">
            <h1 className="hero8-text thq-heading-1">{props.heading1}</h1>
            <p className="hero8-text1 thq-body-large">{props.content1}</p>
            <div className="hero8-actions">
              <a
                href="https://asd"
                target="_blank"
                rel="noreferrer noopener"
                className="hero8-button thq-button-filled"
              >
                <span className="thq-body-small">{props.action1}</span>
              </a>
              <Link to="/contact" className="hero8-button1 thq-button-outline">
                <span className="thq-body-small">{props.action2}</span>
              </Link>
            </div>
          </div>
        </div>
        <img
          alt={props.image1Alt}
          src={props.image1Src}
          className="thq-img-ratio-16-9"
        />
      </div>
    </div>
  )
}

Hero8.defaultProps = {
  image1Alt: 'Website Builder Service',
  image1Src:
    'https://images.unsplash.com/photo-1564475485710-13d47be662a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0NjI1Mnw&ixlib=rb-4.0.3&q=80&w=1080',
  heading1: 'Johann Kramer',
  content1:
    'Eine Mischung aus Ästhetik, Eisenbahnen, Codierung und Führung. Bekannt für Loyalität, Organisation und Interesse an Fotografie, Technik, Programmierung und sozialen Themen.',
  action1: 'Download CV',
  action2: 'Get in Touch',
}

Hero8.propTypes = {
  image1Alt: PropTypes.string,
  image1Src: PropTypes.string,
  heading1: PropTypes.string,
  content1: PropTypes.string,
  action1: PropTypes.string,
  action2: PropTypes.string,
}

export default Hero8

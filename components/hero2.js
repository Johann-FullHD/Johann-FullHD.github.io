import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './hero2.css'

const Hero2 = (props) => {
  return (
    <div className="hero2-header5 thq-section-padding">
      <img
        alt={props.image1Alt}
        src={props.image1Src}
        className="hero2-image"
      />
      <div className="hero2-container">
        <div className="hero2-max-width thq-section-max-width">
          <div className="hero2-column">
            <div className="hero2-content">
              <h1 className="thq-heading-1 hero2-text">{props.heading1}</h1>
              <p className="thq-body-large hero2-text1">{props.content1}</p>
              <div className="hero2-actions">
                <div className="hero2-container1">
                  <a
                    href="https://git"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hero2-button thq-button-filled"
                  >
                    <span className="thq-body-small">{props.action1}</span>
                  </a>
                </div>
                <div className="hero2-container2">
                  <Link
                    to="/contact"
                    className="hero2-button1 thq-button-outline"
                  >
                    <span className="thq-body-small">{props.action2}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Hero2.defaultProps = {
  action2: 'Contact',
  image1Alt: 'Image of Johann Kramer',
  image1Src:
    'https://images.unsplash.com/photo-1613594580783-8982872a6a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyMDk5MHw&ixlib=rb-4.0.3&q=80&w=1080',
  action1: 'Download CV',
  content1:
    'Eine Mischung aus Ästhetik, Eisenbahnen, Codierung und Führung. Bekannt für Loyalität, Organisation und Interesse an Fotografie, Technik, Programmierung und sozialen Themen.',
  heading1: 'Johann F. Kramer',
}

Hero2.propTypes = {
  action2: PropTypes.string,
  image1Alt: PropTypes.string,
  image1Src: PropTypes.string,
  action1: PropTypes.string,
  content1: PropTypes.string,
  heading1: PropTypes.string,
}

export default Hero2

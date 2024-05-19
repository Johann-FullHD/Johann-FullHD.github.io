import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './cta22.css'

const CTA22 = (props) => {
  return (
    <div className="cta22-container thq-section-padding">
      <div className="cta22-max-width thq-section-max-width">
        <div className="cta22-row">
          <div className="cta22-content">
            <div className="cta22-container1">
              <div className="cta22-row1 thq-flex-column">
                <div className="cta22-container2">
                  <Link
                    to="/galerie"
                    className="cta22-navlink thq-button-filled"
                  >
                    {props.action1}
                  </Link>
                  <a
                    href="https://www.instagram.com/trainspotter.dresden/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="cta22-link thq-button-outline"
                  >
                    {props.action2}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          alt={props.image1Alt}
          src={props.image1Src}
          className="cta22-image thq-img-ratio-16-9"
        />
      </div>
    </div>
  )
}

CTA22.defaultProps = {
  image1Src:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0NjczNXw&ixlib=rb-4.0.3&q=80&w=1080',
  image1Alt: 'Foto',
  action2: 'Instagram',
  action1: 'Galerie',
}

CTA22.propTypes = {
  image1Src: PropTypes.string,
  image1Alt: PropTypes.string,
  action2: PropTypes.string,
  action1: PropTypes.string,
}

export default CTA22

import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './footer43.css'

const Footer43 = (props) => {
  return (
    <div className="footer43-footer7 thq-section-padding">
      <div className="footer43-max-width thq-section-max-width">
        <div className="footer43-content">
          <div className="footer43-logo">
            <img
              alt={props.image1Alt}
              src={props.image1Src}
              className="footer43-logo1"
            />
          </div>
          <div className="footer43-links">
            <Link to="/" className="footer43-navlink thq-body-small">
              {props.link1}
            </Link>
            <Link to="/informatik" className="footer43-navlink1 thq-body-small">
              {props.link2}
            </Link>
            <Link to="/foto" className="footer43-navlink2 thq-body-small">
              {props.link3}
            </Link>
            <Link to="/about" className="footer43-navlink3 thq-body-small">
              {props.link4}
            </Link>
            <Link to="/faq" className="footer43-navlink4 thq-body-small">
              {props.link5}
            </Link>
          </div>
        </div>
        <div className="footer43-credits">
          <div className="thq-divider-horizontal"></div>
          <div className="footer43-row">
            <div className="footer43-container">
              <span className="thq-body-small">© 2024 Johann Kramer</span>
            </div>
            <div className="footer43-footer-links">
              <Link
                to="/privacy-policy"
                className="footer43-text1 thq-body-small"
              >
                {props.privacyLink}
              </Link>
              <Link
                to="/terms-of-service"
                className="footer43-text2 thq-body-small"
              >
                {props.termsLink}
              </Link>
              <Link
                to="/code-of-conduct"
                className="footer43-text3 thq-body-small"
              >
                {props.codeofconduct}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Footer43.defaultProps = {
  termsLink: 'Terms of Service',
  image1Src:
    'https://images.unsplash.com/photo-1694064020922-914fe3502d0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNDMzOHw&ixlib=rb-4.0.3&q=80&w=1080',
  image1Alt: 'Logo',
  link2: 'Informatik',
  privacyLink: 'Privacy Policy',
  link5: 'FAQ',
  link3: 'Fotografie',
  link1: 'Home',
  codeofconduct: 'Code of Conduct',
  link4: 'About',
}

Footer43.propTypes = {
  termsLink: PropTypes.string,
  image1Src: PropTypes.string,
  image1Alt: PropTypes.string,
  link2: PropTypes.string,
  privacyLink: PropTypes.string,
  link5: PropTypes.string,
  link3: PropTypes.string,
  link1: PropTypes.string,
  codeofconduct: PropTypes.string,
  link4: PropTypes.string,
}

export default Footer43

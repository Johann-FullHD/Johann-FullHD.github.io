import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './footer42.css'

const Footer42 = (props) => {
  return (
    <div className="footer42-footer7 thq-section-padding">
      <div className="footer42-max-width thq-section-max-width">
        <div className="footer42-content">
          <div className="footer42-logo">
            <img
              alt={props.image1Alt}
              src={props.image1Src}
              className="footer42-logo1"
            />
          </div>
          <div className="footer42-links">
            <Link to="/" className="footer42-navlink thq-body-small">
              {props.link1}
            </Link>
            <Link to="/informatik" className="footer42-navlink1 thq-body-small">
              {props.link2}
            </Link>
            <Link to="/foto" className="footer42-navlink2 thq-body-small">
              {props.link3}
            </Link>
            <Link to="/about" className="footer42-navlink3 thq-body-small">
              {props.link4}
            </Link>
            <Link to="/faq" className="footer42-navlink4 thq-body-small">
              {props.link5}
            </Link>
          </div>
        </div>
        <div className="footer42-credits">
          <div className="thq-divider-horizontal"></div>
          <div className="footer42-row">
            <div className="footer42-container">
              <span className="thq-body-small">© 2024 Johann Kramer</span>
            </div>
            <div className="footer42-footer-links">
              <Link
                to="/privacy-policy"
                className="footer42-text1 thq-body-small"
              >
                {props.privacyLink}
              </Link>
              <Link
                to="/terms-of-service"
                className="footer42-text2 thq-body-small"
              >
                {props.termsLink}
              </Link>
              <Link
                to="/code-of-conduct"
                className="footer42-text3 thq-body-small"
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

Footer42.defaultProps = {
  link4: 'About',
  privacyLink: 'Privacy Policy',
  link2: 'Informatik',
  image1Src:
    'https://images.unsplash.com/photo-1581335740120-f76bdf9a6451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNDA1M3w&ixlib=rb-4.0.3&q=80&w=1080',
  termsLink: 'Terms of Service',
  link1: 'Home',
  codeofconduct: 'Code of Conduct',
  link3: 'Fotografie',
  link5: 'FAQ',
  image1Alt: "Logo for Johann Kramer's website",
}

Footer42.propTypes = {
  link4: PropTypes.string,
  privacyLink: PropTypes.string,
  link2: PropTypes.string,
  image1Src: PropTypes.string,
  termsLink: PropTypes.string,
  link1: PropTypes.string,
  codeofconduct: PropTypes.string,
  link3: PropTypes.string,
  link5: PropTypes.string,
  image1Alt: PropTypes.string,
}

export default Footer42

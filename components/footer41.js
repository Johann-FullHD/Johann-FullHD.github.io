import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './footer41.css'

const Footer41 = (props) => {
  return (
    <div className="footer41-footer7 thq-section-padding">
      <div className="footer41-max-width thq-section-max-width">
        <div className="footer41-content">
          <div className="footer41-logo">
            <img
              alt={props.image1Alt}
              src={props.image1Src}
              className="footer41-logo1"
            />
          </div>
          <div className="footer41-links">
            <Link to="/" className="footer41-navlink thq-body-small">
              {props.link1}
            </Link>
            <Link to="/informatik" className="footer41-navlink1 thq-body-small">
              {props.link2}
            </Link>
            <Link to="/foto" className="footer41-navlink2 thq-body-small">
              {props.link3}
            </Link>
            <Link to="/about" className="footer41-navlink3 thq-body-small">
              {props.link4}
            </Link>
            <Link to="/faq" className="footer41-navlink4 thq-body-small">
              {props.link5}
            </Link>
          </div>
        </div>
        <div className="footer41-credits">
          <div className="thq-divider-horizontal"></div>
          <div className="footer41-row">
            <div className="footer41-container">
              <span className="thq-body-small">© 2024 Johann Kramer</span>
            </div>
            <div className="footer41-footer-links">
              <Link
                to="/privacy-policy"
                className="footer41-text1 thq-body-small"
              >
                {props.privacyLink}
              </Link>
              <Link
                to="/terms-of-service"
                className="footer41-text2 thq-body-small"
              >
                {props.termsLink}
              </Link>
              <Link
                to="/code-of-conduct"
                className="footer41-text3 thq-body-small"
              >
                {props.codeofConduct}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Footer41.defaultProps = {
  codeofConduct: 'Code of Conduct',
  link2: 'Informatik',
  link1: 'Home',
  link4: 'About',
  termsLink: 'Terms of Service',
  image1Alt: 'Johann Kramer Logo',
  link3: 'Fotografie',
  privacyLink: 'Privacy Policy',
  image1Src:
    'https://images.unsplash.com/photo-1465845075873-957c8326f63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0NzU4OHw&ixlib=rb-4.0.3&q=80&w=1080',
  link5: 'FAQ',
}

Footer41.propTypes = {
  codeofConduct: PropTypes.string,
  link2: PropTypes.string,
  link1: PropTypes.string,
  link4: PropTypes.string,
  termsLink: PropTypes.string,
  image1Alt: PropTypes.string,
  link3: PropTypes.string,
  privacyLink: PropTypes.string,
  image1Src: PropTypes.string,
  link5: PropTypes.string,
}

export default Footer41

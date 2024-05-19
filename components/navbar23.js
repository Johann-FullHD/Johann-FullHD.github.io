import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './navbar23.css'

const Navbar23 = (props) => {
  return (
    <div className="navbar23-container">
      <header data-thq="thq-navbar" className="navbar23-navbar-interactive">
        <img
          alt={props.logoAlt}
          src={props.logoSrc}
          className="navbar23-image1"
        />
        <div data-thq="thq-navbar-nav" className="navbar23-desktop-menu">
          <nav className="navbar23-links">
            <span>{props.link1}</span>
            <span>{props.link2}</span>
            <span>{props.link3}</span>
            <span className="thq-link thq-body-small">{props.link4}</span>
            <span className="thq-link thq-body-small">{props.link5}</span>
          </nav>
        </div>
        <div data-thq="thq-burger-menu" className="navbar23-burger-menu">
          <svg viewBox="0 0 1024 1024" className="navbar23-icon">
            <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
          </svg>
        </div>
        <div data-thq="thq-mobile-menu" className="navbar23-mobile-menu">
          <div className="navbar23-nav">
            <div className="navbar23-top">
              <img
                alt={props.logoAlt}
                src={props.logoSrc}
                className="navbar23-logo"
              />
              <div data-thq="thq-close-menu" className="navbar23-close-menu">
                <svg viewBox="0 0 1024 1024" className="navbar23-icon02">
                  <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                </svg>
              </div>
            </div>
            <nav className="navbar23-links1">
              <Link to="/" className="navbar23-link11 thq-link thq-body-small">
                {props.link1}
              </Link>
              <Link
                to="/informatik"
                className="navbar23-link21 thq-link thq-body-small"
              >
                {props.link2}
              </Link>
              <span className="thq-link thq-body-small">{props.link3}</span>
              <Link
                to="/about"
                className="navbar23-link41 thq-link thq-body-small"
              >
                {props.link4}
              </Link>
              <span className="thq-link thq-body-small">{props.link5}</span>
            </nav>
          </div>
          <div className="navbar23-icon-group">
            <a
              href="https://github.com/Johann-FullHD"
              target="_blank"
              rel="noreferrer noopener"
              className="navbar23-link"
            >
              <svg viewBox="0 0 1024 1024" className="navbar23-icon04">
                <path d="M512.008 12.642c-282.738 0-512.008 229.218-512.008 511.998 0 226.214 146.704 418.132 350.136 485.836 25.586 4.738 34.992-11.11 34.992-24.632 0-12.204-0.48-52.542-0.696-95.324-142.448 30.976-172.504-60.41-172.504-60.41-23.282-59.176-56.848-74.916-56.848-74.916-46.452-31.778 3.51-31.124 3.51-31.124 51.4 3.61 78.476 52.766 78.476 52.766 45.672 78.27 119.776 55.64 149.004 42.558 4.588-33.086 17.852-55.68 32.506-68.464-113.73-12.942-233.276-56.85-233.276-253.032 0-55.898 20.004-101.574 52.76-137.428-5.316-12.9-22.854-64.972 4.952-135.5 0 0 43.006-13.752 140.84 52.49 40.836-11.348 84.636-17.036 128.154-17.234 43.502 0.198 87.336 5.886 128.256 17.234 97.734-66.244 140.656-52.49 140.656-52.49 27.872 70.528 10.35 122.6 5.036 135.5 32.82 35.856 52.694 81.532 52.694 137.428 0 196.654-119.778 239.95-233.79 252.624 18.364 15.89 34.724 47.046 34.724 94.812 0 68.508-0.596 123.644-0.596 140.508 0 13.628 9.222 29.594 35.172 24.566 203.322-67.776 349.842-259.626 349.842-485.768 0-282.78-229.234-511.998-511.992-511.998z"></path>
              </svg>
            </a>
            <a
              href="https://github.com/Johann-FullHD"
              target="_blank"
              rel="noreferrer noopener"
              className="thq-link thq-body-small navbar23-link1"
            >
              <svg viewBox="0 0 1024 1024" className="navbar23-icon06">
                <path d="M1013.8 307.2c0 0-10-70.6-40.8-101.6-39-40.8-82.6-41-102.6-43.4-143.2-10.4-358.2-10.4-358.2-10.4h-0.4c0 0-215 0-358.2 10.4-20 2.4-63.6 2.6-102.6 43.4-30.8 31-40.6 101.6-40.6 101.6s-10.2 82.8-10.2 165.8v77.6c0 82.8 10.2 165.8 10.2 165.8s10 70.6 40.6 101.6c39 40.8 90.2 39.4 113 43.8 82 7.8 348.2 10.2 348.2 10.2s215.2-0.4 358.4-10.6c20-2.4 63.6-2.6 102.6-43.4 30.8-31 40.8-101.6 40.8-101.6s10.2-82.8 10.2-165.8v-77.6c-0.2-82.8-10.4-165.8-10.4-165.8zM406.2 644.8v-287.8l276.6 144.4-276.6 143.4z"></path>
              </svg>
            </a>
            <a
              href="https://github.com/Johann-FullHD"
              target="_blank"
              rel="noreferrer noopener"
              className="thq-link thq-body-small navbar23-link2"
            >
              <svg viewBox="0 0 1024 1024" className="navbar23-icon08">
                <path d="M96 0l-96 160v736h256v128h128l128-128h160l288-288v-608h-864zM832 544l-160 160h-160l-128 128v-128h-192v-576h640v416z"></path>
                <path d="M608 256h96v256h-96v-256z"></path>
                <path d="M416 256h96v256h-96v-256z"></path>
              </svg>
            </a>
            <a
              href="https://github.com/Johann-FullHD"
              target="_blank"
              rel="noreferrer noopener"
              className="thq-link thq-body-small navbar23-link3"
            >
              <svg viewBox="0 0 1024 1024" className="navbar23-icon12">
                <path d="M512 92.2c136.8 0 153 0.6 206.8 3 50 2.2 77 10.6 95 17.6 23.8 9.2 41 20.4 58.8 38.2 18 18 29 35 38.4 58.8 7 18 15.4 45.2 17.6 95 2.4 54 3 70.2 3 206.8s-0.6 153-3 206.8c-2.2 50-10.6 77-17.6 95-9.2 23.8-20.4 41-38.2 58.8-18 18-35 29-58.8 38.4-18 7-45.2 15.4-95 17.6-54 2.4-70.2 3-206.8 3s-153-0.6-206.8-3c-50-2.2-77-10.6-95-17.6-23.8-9.2-41-20.4-58.8-38.2-18-18-29-35-38.4-58.8-7-18-15.4-45.2-17.6-95-2.4-54-3-70.2-3-206.8s0.6-153 3-206.8c2.2-50 10.6-77 17.6-95 9.2-23.8 20.4-41 38.2-58.8 18-18 35-29 58.8-38.4 18-7 45.2-15.4 95-17.6 53.8-2.4 70-3 206.8-3zM512 0c-139 0-156.4 0.6-211 3-54.4 2.4-91.8 11.2-124.2 23.8-33.8 13.2-62.4 30.6-90.8 59.2-28.6 28.4-46 57-59.2 90.6-12.6 32.6-21.4 69.8-23.8 124.2-2.4 54.8-3 72.2-3 211.2s0.6 156.4 3 211c2.4 54.4 11.2 91.8 23.8 124.2 13.2 33.8 30.6 62.4 59.2 90.8 28.4 28.4 57 46 90.6 59 32.6 12.6 69.8 21.4 124.2 23.8 54.6 2.4 72 3 211 3s156.4-0.6 211-3c54.4-2.4 91.8-11.2 124.2-23.8 33.6-13 62.2-30.6 90.6-59s46-57 59-90.6c12.6-32.6 21.4-69.8 23.8-124.2 2.4-54.6 3-72 3-211s-0.6-156.4-3-211c-2.4-54.4-11.2-91.8-23.8-124.2-12.6-34-30-62.6-58.6-91-28.4-28.4-57-46-90.6-59-32.6-12.6-69.8-21.4-124.2-23.8-54.8-2.6-72.2-3.2-211.2-3.2v0z"></path>
                <path d="M512 249c-145.2 0-263 117.8-263 263s117.8 263 263 263 263-117.8 263-263c0-145.2-117.8-263-263-263zM512 682.6c-94.2 0-170.6-76.4-170.6-170.6s76.4-170.6 170.6-170.6c94.2 0 170.6 76.4 170.6 170.6s-76.4 170.6-170.6 170.6z"></path>
                <path d="M846.8 238.6c0 33.91-27.49 61.4-61.4 61.4s-61.4-27.49-61.4-61.4c0-33.91 27.49-61.4 61.4-61.4s61.4 27.49 61.4 61.4z"></path>
              </svg>
            </a>
          </div>
        </div>
      </header>
    </div>
  )
}

Navbar23.defaultProps = {
  link4: 'About',
  logoAlt: 'logo',
  link2: 'Informatik',
  link1: 'Home',
  link5: 'FAQ',
  logoSrc:
    'https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/84ec08e8-34e9-42c7-9445-d2806d156403/fac575ac-7a41-484f-b7ac-875042de11f8?org_if_sml=1&force_format=original',
  link3: 'Fotografie',
}

Navbar23.propTypes = {
  link4: PropTypes.string,
  logoAlt: PropTypes.string,
  link2: PropTypes.string,
  link1: PropTypes.string,
  link5: PropTypes.string,
  logoSrc: PropTypes.string,
  link3: PropTypes.string,
}

export default Navbar23

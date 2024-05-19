import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './not-found3.css'

const NotFound3 = (props) => {
  return (
    <div
      className={`not-found3-container thq-section-padding ${props.rootClassName} `}
    >
      <div className="not-found3-max-width">
        <h1 className="not-found3-text thq-heading-1">404</h1>
        <h2 className="not-found3-text1 thq-heading-2">Page not found</h2>
        <span className="not-found3-text2 thq-body-small">
          {props.content1}
        </span>
        <Link to="/" className="not-found3-button thq-button-filled">
          <span className="thq-body-small">{props.action1}</span>
        </Link>
      </div>
    </div>
  )
}

NotFound3.defaultProps = {
  action1: 'Back to homepage',
  rootClassName: '',
  content1:
    "Oops, it looks like you've landed on a page that doesn't exist! Don't worry, it happens to the best of us. We're sorry you couldn't find what you were looking for. It's possible the page was removed, renamed, or is temporarily unavailable.  If you're sure you typed the URL correctly, you can try searching for the content you're looking for using the search bar above. Our navigation menu above can also help you explore our website and find what you need.  If you're still stuck, feel free to contact us and we'll do our best to assist you. And don't forget, sometimes clearing your browser cache can also resolve the issue.  Thanks for your patience, and we hope you find what you're looking for soon!",
}

NotFound3.propTypes = {
  action1: PropTypes.string,
  rootClassName: PropTypes.string,
  content1: PropTypes.string,
}

export default NotFound3

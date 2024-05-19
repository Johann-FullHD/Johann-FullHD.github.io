import React from 'react'

import PropTypes from 'prop-types'

import './banner3.css'

const Banner3 = (props) => {
  return (
    <div className="banner3-container thq-section-padding">
      <img
        alt={props.image1Alt}
        src={props.image1Src}
        className="banner3-image thq-img-ratio-16-9"
      />
      <div className="banner3-max-width thq-section-max-width">
        <div className="banner3-container1">
          <h2 className="banner3-title thq-heading-2">{props.heading1}</h2>
          <h3 className="banner3-text thq-heading-3">{props.content1}</h3>
        </div>
      </div>
    </div>
  )
}

Banner3.defaultProps = {
  action1: 'Instagram',
  image1Src:
    'https://images.unsplash.com/photo-1555421689-d68471e189f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0NjY5NXw&ixlib=rb-4.0.3&q=80&w=1080',
  content1: 'Alles rund um die Fotografie von Johann Kramer',
  image1Alt: 'Website Builder',
  heading1: 'Fotografie',
}

Banner3.propTypes = {
  action1: PropTypes.string,
  image1Src: PropTypes.string,
  content1: PropTypes.string,
  image1Alt: PropTypes.string,
  heading1: PropTypes.string,
}

export default Banner3

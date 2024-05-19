import React from 'react'

import PropTypes from 'prop-types'

import './features22.css'

const Features22 = (props) => {
  return (
    <div className="features22-layout349 thq-section-padding">
      <div className="features22-max-width thq-section-max-width">
        <div className="features22-container">
          <h2 className="thq-heading-2">{props.heading1}</h2>
          <span className="features22-text01 thq-body-small">
            {props.content1}
          </span>
        </div>
        <div className="features22-container1 thq-grid-4">
          <div className="features22-card thq-card">
            <img
              alt={props.feature1ImageAlt}
              src={props.feature1ImageSrc}
              className="features22-image thq-img-round"
            />
            <h2 className="thq-heading-2">{props.feature1Title}</h2>
            <span className="features22-text03 thq-body-small">
              {props.feature1Description}
            </span>
            <a
              href="https://asd"
              target="_blank"
              rel="noreferrer noopener"
              className="features22-link button"
            >
              {props.button}
            </a>
          </div>
          <div className="features22-card1 thq-card">
            <img
              alt={props.feature2ImageAlt}
              src={props.feature2ImageSrc}
              className="features22-image1 thq-img-round"
            />
            <h2 className="thq-heading-2">{props.feature2Title}</h2>
            <span className="features22-text05 thq-body-small">
              {props.feature2Description}
            </span>
            <a
              href="https://asd"
              target="_blank"
              rel="noreferrer noopener"
              className="features22-link1 button"
            >
              {props.button1}
            </a>
          </div>
          <div className="features22-card2 thq-card">
            <img
              alt={props.feature3ImageAlt}
              src={props.feature3ImageSrc}
              className="features22-image2 thq-img-round"
            />
            <h1 className="thq-heading-2">{props.feature3Title}</h1>
            <span className="features22-text07 thq-body-small">
              {props.feature3Description}
            </span>
            <a
              href="https://asd"
              target="_blank"
              rel="noreferrer noopener"
              className="features22-link2 button"
            >
              {props.button2}
            </a>
          </div>
          <div className="features22-card3 thq-card">
            <img
              alt={props.feature4ImageAlt}
              src={props.feature4ImageSrc}
              className="features22-image3 thq-img-round"
            />
            <h1 className="thq-heading-2">{props.feature4Title}</h1>
            <span className="features22-text09 thq-body-small">
              {props.feature4Description}
            </span>
            <a
              href="https://asd"
              target="_blank"
              rel="noreferrer noopener"
              className="features22-link3 button"
            >
              {props.button3}
            </a>
          </div>
          <div className="features22-card4 thq-card">
            <img
              alt={props.feature6ImageAlt}
              src={props.feature6ImageSrc}
              className="features22-image4 thq-img-round"
            />
            <h1 className="thq-heading-2">{props.feature5Title}</h1>
            <span className="features22-text11 thq-body-small">
              {props.feature5Description}
            </span>
            <a
              href="https://asd"
              target="_blank"
              rel="noreferrer noopener"
              className="features22-link4 button"
            >
              {props.button4}
            </a>
          </div>
          <div className="features22-card5 thq-card">
            <img
              alt={props.feature6ImageAlt}
              src={props.feature6ImageSrc}
              className="features22-image5 thq-img-round"
            />
            <h1 className="thq-heading-2">{props.feature6Title}</h1>
            <span className="features22-text13 thq-body-small">
              {props.feature6Description}
            </span>
            <a
              href="https://asd"
              target="_blank"
              rel="noreferrer noopener"
              className="features22-link5 button"
            >
              {props.button5}
            </a>
          </div>
          <div className="features22-card6 thq-card">
            <img
              alt={props.feature7ImageAlt}
              src={props.feature7ImageSrc}
              className="features22-image6 thq-img-round"
            />
            <h1 className="thq-heading-2">{props.feature7Title}</h1>
            <span className="features22-text15 thq-body-small">
              {props.feature7Description}
            </span>
            <a
              href="https://asd"
              target="_blank"
              rel="noreferrer noopener"
              className="features22-link6 button"
            >
              {props.button6}
            </a>
          </div>
          <div className="features22-card7 thq-card">
            <img
              alt={props.feature6ImageAlt}
              src={props.feature6ImageSrc}
              className="features22-image7 thq-img-round"
            />
            <h1 className="thq-heading-2">{props.feature8Title}</h1>
            <span className="features22-text17 thq-body-small">
              {props.feature8Description}
            </span>
            <a
              href="https://asd"
              target="_blank"
              rel="noreferrer noopener"
              className="features22-link7 button"
            >
              {props.button7}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

Features22.defaultProps = {
  feature3Title: "Author's Insights",
  feature1Description:
    'Explore a collection of insightful articles on various topics related to computer science, including programming languages, algorithms, and software development.',
  button6: 'Button',
  feature6ImageAlt: 'Behind-the-Scenes Content Image',
  feature2Description:
    'Immerse yourself in stunning photography galleries showcasing landscapes, portraits, and creative compositions captured by Johann Kramer.',
  button1: 'Button',
  button7: 'Button',
  feature3Description:
    'Gain valuable insights and perspectives from Johann Kramer on the intersection of computer science and photography, along with personal experiences and reflections.',
  feature8ImageSrc:
    'https://images.unsplash.com/photo-1513652990199-8a52e2313122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNzAzMHw&ixlib=rb-4.0.3&q=80&w=1400',
  feature4ImageAlt: 'Interactive Tutorials Image',
  button3: 'Button',
  feature7ImageAlt: 'Resource Recommendations Image',
  feature5ImageSrc:
    'https://images.unsplash.com/photo-1527412444964-0a5432f632b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNzAzMHw&ixlib=rb-4.0.3&q=80&w=1400',
  feature8Description:
    'Explore collaboration opportunities with Johann Kramer for projects that bridge the gap between Informatik and Fotografie, fostering creativity and innovation.',
  button5: 'Button',
  content1:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.',
  feature5ImageAlt: 'Community Forums Image',
  feature5Description:
    'Join vibrant community forums to discuss the latest trends, share tips and tricks, and connect with fellow enthusiasts passionate about Informatik and Fotografie.',
  feature6Title: 'Behind-the-Scenes Content',
  feature7ImageSrc:
    'https://images.unsplash.com/photo-1608742213509-815b97c30b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNzAzMHw&ixlib=rb-4.0.3&q=80&w=1400',
  feature8Title: 'Collaboration Opportunities',
  feature1ImageAlt: 'Computer Science Articles Image',
  feature6ImageSrc:
    'https://images.unsplash.com/photo-1611056156281-dff875aef9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNzAzMXw&ixlib=rb-4.0.3&q=80&w=1400',
  button2: 'Button',
  feature6Description:
    'Get exclusive access to behind-the-scenes content, including the making of computer science projects and the creative process behind captivating photographs.',
  feature3ImageAlt: "Author's Insights Image",
  feature5Title: 'Community Forums',
  feature2Title: 'Fotografie (Photography) Galleries',
  feature7Description:
    'Discover curated lists of recommended resources, such as books, tools, and websites, to further your knowledge in both computer science and photography domains.',
  heading1: 'Projekte',
  feature1Title: 'Informatik (Computer Science) Articles',
  feature4ImageSrc:
    'https://images.unsplash.com/photo-1558459654-c430be5b0a44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNzAzMHw&ixlib=rb-4.0.3&q=80&w=1400',
  feature3ImageSrc:
    'https://images.unsplash.com/photo-1516101922849-2bf0be616449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNzAzMXw&ixlib=rb-4.0.3&q=80&w=1400',
  button4: 'Button',
  feature2ImageSrc:
    'https://images.unsplash.com/photo-1568046772612-8bb5afe37e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNzAzMXw&ixlib=rb-4.0.3&q=80&w=1400',
  feature8ImageAlt: 'Collaboration Opportunities Image',
  button: 'Button',
  feature7Title: 'Resource Recommendations',
  feature4Title: 'Interactive Tutorials',
  feature1ImageSrc:
    'https://images.unsplash.com/photo-1705247372456-b6ae4b54cc90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTUyNzAzMHw&ixlib=rb-4.0.3&q=80&w=1400',
  feature4Description:
    'Engage in interactive tutorials that cover a range of topics in computer science and photography, designed to enhance your skills and knowledge.',
  feature2ImageAlt: 'Photography Galleries Image',
}

Features22.propTypes = {
  feature3Title: PropTypes.string,
  feature1Description: PropTypes.string,
  button6: PropTypes.string,
  feature6ImageAlt: PropTypes.string,
  feature2Description: PropTypes.string,
  button1: PropTypes.string,
  button7: PropTypes.string,
  feature3Description: PropTypes.string,
  feature8ImageSrc: PropTypes.string,
  feature4ImageAlt: PropTypes.string,
  button3: PropTypes.string,
  feature7ImageAlt: PropTypes.string,
  feature5ImageSrc: PropTypes.string,
  feature8Description: PropTypes.string,
  button5: PropTypes.string,
  content1: PropTypes.string,
  feature5ImageAlt: PropTypes.string,
  feature5Description: PropTypes.string,
  feature6Title: PropTypes.string,
  feature7ImageSrc: PropTypes.string,
  feature8Title: PropTypes.string,
  feature1ImageAlt: PropTypes.string,
  feature6ImageSrc: PropTypes.string,
  button2: PropTypes.string,
  feature6Description: PropTypes.string,
  feature3ImageAlt: PropTypes.string,
  feature5Title: PropTypes.string,
  feature2Title: PropTypes.string,
  feature7Description: PropTypes.string,
  heading1: PropTypes.string,
  feature1Title: PropTypes.string,
  feature4ImageSrc: PropTypes.string,
  feature3ImageSrc: PropTypes.string,
  button4: PropTypes.string,
  feature2ImageSrc: PropTypes.string,
  feature8ImageAlt: PropTypes.string,
  button: PropTypes.string,
  feature7Title: PropTypes.string,
  feature4Title: PropTypes.string,
  feature1ImageSrc: PropTypes.string,
  feature4Description: PropTypes.string,
  feature2ImageAlt: PropTypes.string,
}

export default Features22

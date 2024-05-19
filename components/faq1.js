import React from 'react'

import PropTypes from 'prop-types'

import './faq1.css'

const FAQ1 = (props) => {
  return (
    <div className="faq1-faq7 thq-section-padding">
      <div className="faq1-max-width thq-section-max-width">
        <div className="thq-flex-column">
          <h2 className="thq-heading-2">{props.heading1}</h2>
          <p className="faq1-text1 thq-body-large">{props.content1}</p>
        </div>
        <div className="thq-flex-column faq1-list">
          <div className="faq1-list-item1">
            <p className="faq1-faq1-question thq-body-large">
              {props.faq1Question}
            </p>
            <span className="thq-body-small">{props.faq1Answer}</span>
          </div>
          <div className="faq1-list-item2">
            <p className="faq1-faq2-question thq-body-large">
              {props.faq2Question}
            </p>
            <span className="thq-body-small">{props.faq2Answer}</span>
          </div>
          <div className="faq1-list-item3">
            <p className="faq1-faq3-question thq-body-large">
              {props.faq3Question}
            </p>
            <span className="thq-body-small">{props.faq3Answer}</span>
          </div>
          <div className="faq1-list-item4">
            <p className="faq1-faq4-question thq-body-large">
              {props.faq4Question}
            </p>
            <span className="thq-body-small">{props.faq4Answer}</span>
          </div>
          <div className="faq1-list-item5">
            <p className="faq1-faq5-question thq-body-large">
              {props.faq5Question}
            </p>
            <span className="thq-body-small">{props.faq5Answer}</span>
          </div>
        </div>
        <div className="thq-flex-column">
          <div className="faq1-content1">
            <h2 className="thq-heading-2">{props.heading2}</h2>
            <p className="faq1-text3 thq-body-large">{props.content2}</p>
          </div>
          <div className="faq1-container">
            <button className="thq-button-outline faq1-button">
              <span className="thq-body-small">{props.action1}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

FAQ1.defaultProps = {
  faq4Answer:
    'You can reach out to Johann Kramer through the contact form on this website or connect with him on social media platforms such as Twitter, Instagram, and LinkedIn.',
  faq5Question: 'Is there a way to collaborate with Johann Kramer?',
  action1: 'Contact',
  faq1Question: 'What is Informatik (Computer Science) about?',
  faq4Question: 'How can I contact Johann Kramer?',
  faq3Answer:
    'Johann Kramer is a passionate computer scientist and photographer who combines his technical expertise with artistic vision to create innovative projects that bridge the gap between technology and art.',
  faq3Question: 'Who is Johann Kramer?',
  content1:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
  content2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  heading2: 'Still have a question?',
  heading1: 'FAQs',
  faq5Answer:
    'Yes, Johann Kramer is open to collaboration opportunities in the fields of computer science and photography. Feel free to reach out with your ideas and proposals.',
  faq1Answer:
    'Informatik is the study of computers and computational systems. It involves understanding how computers work, designing software and hardware, and solving complex problems using technology.',
  faq2Answer:
    'Photography is a powerful medium for capturing moments, expressing creativity, and communicating ideas visually. It allows us to document the world around us and share our perspectives with others.',
  faq2Question: 'Why is Fotografie (Photography) important?',
}

FAQ1.propTypes = {
  faq4Answer: PropTypes.string,
  faq5Question: PropTypes.string,
  action1: PropTypes.string,
  faq1Question: PropTypes.string,
  faq4Question: PropTypes.string,
  faq3Answer: PropTypes.string,
  faq3Question: PropTypes.string,
  content1: PropTypes.string,
  content2: PropTypes.string,
  heading2: PropTypes.string,
  heading1: PropTypes.string,
  faq5Answer: PropTypes.string,
  faq1Answer: PropTypes.string,
  faq2Answer: PropTypes.string,
  faq2Question: PropTypes.string,
}

export default FAQ1

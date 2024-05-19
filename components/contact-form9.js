import React from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'

import './contact-form9.css'

const ContactForm9 = (props) => {
  return (
    <div className="contact-form9-contact11 thq-section-padding">
      <div className="contact-form9-max-width thq-section-max-width">
        <div className="contact-form9-section-title thq-card">
          <span className="thq-body-small">{props.content2}</span>
          <div className="contact-form9-content">
            <h2 className="thq-heading-2">{props.heading1}</h2>
            <p className="thq-body-large">{props.content1}</p>
          </div>
        </div>
        <div className="contact-form9-content1">
          <form className="contact-form9-form thq-card">
            <div className="contact-form9-input">
              <label htmlFor="contact-form-9-name" className="thq-body-small">
                Name
              </label>
              <input
                type="text"
                id="contact-form-9-name"
                placeholder="Full Name"
                className="thq-input"
              />
            </div>
            <div className="contact-form9-input1">
              <label htmlFor="contact-form-9-email" className="thq-body-small">
                Email
              </label>
              <input
                type="text"
                id="contact-form-9-email"
                required="true"
                placeholder="Email"
                className="thq-input"
              />
            </div>
            <div className="contact-form9-container">
              <div className="contact-form9-input2">
                <label
                  htmlFor="contact-form-9-options"
                  className="thq-body-small"
                >
                  Choose one topic
                </label>
                <select
                  id="contact-form-9-options"
                  placeholder="Select one"
                  className="thq-select"
                >
                  <option value="Option 1">Option 1</option>
                  <option value="Option 1">Customer Service</option>
                  <option value="Option 1">Feature request</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </div>
            </div>
            <div className="contact-form9-input3">
              <label
                htmlFor="contact-form-9-message"
                className="thq-body-small"
              >
                Message
              </label>
              <textarea
                id="contact-form-9-message"
                rows="3"
                placeholder="Enter your message"
                className="thq-input"
              ></textarea>
            </div>
            <div className="contact-form9-checkbox">
              <input
                type="checkbox"
                id="contact-form-9-check"
                checked="true"
                required="true"
                className="thq-checkbox"
              />
              <label htmlFor="contact-form-9-check" className="thq-body-small">
                <span>
                  I accept the
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <Link to="/" className="contact-form9-navlink">
                  Terms of Service
                </Link>
                <br></br>
              </label>
            </div>
            <a
              href="mailto:kjohann1908@gmail.com?subject=Website | Auto Contact Form"
              className="contact-form9-button thq-button-filled"
            >
              <span className="thq-body-small">{props.action}</span>
            </a>
          </form>
          <div className="contact-form9-content2 thq-card">
            <div className="contact-form9-row thq-flex-row">
              <div className="contact-form9-content3">
                <svg
                  viewBox="0 0 1024 1024"
                  className="contact-form9-icon thq-icon-small"
                >
                  <path d="M854 342v-86l-342 214-342-214v86l342 212zM854 170q34 0 59 26t25 60v512q0 34-25 60t-59 26h-684q-34 0-59-26t-25-60v-512q0-34 25-60t59-26h684z"></path>
                </svg>
                <div className="contact-form9-contact-info">
                  <h3 className="thq-heading-3">Email - privat</h3>
                  <a
                    href="mailto:johannk1908@hotmail.com?subject=Website | [Ihr Anliegen]"
                    className="contact-form9-email thq-body-small"
                  >
                    {props.email}
                  </a>
                </div>
              </div>
              <div className="contact-form9-content4">
                <svg
                  viewBox="0 0 1024 1024"
                  className="contact-form9-icon2 thq-icon-small"
                >
                  <path d="M854 342v-86l-342 214-342-214v86l342 212zM854 170q34 0 59 26t25 60v512q0 34-25 60t-59 26h-684q-34 0-59-26t-25-60v-512q0-34 25-60t59-26h684z"></path>
                </svg>
                <div className="contact-form9-contact-info1">
                  <h3 className="thq-heading-3">Email - geschäftlich</h3>
                  <a
                    href="mailto:kjohann1908@gmail.com?subject=Website | [Ihr Anliegen]"
                    className="contact-form9-phone thq-body-small"
                  >
                    {props.email2}
                  </a>
                </div>
              </div>
            </div>
            <div className="thq-flex-row contact-form9-row1">
              <img
                alt={props.imageAlt}
                src={props.imageSrc}
                className="contact-form9-image thq-img-ratio-1-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ContactForm9.defaultProps = {
  content2:
    'Bei Fragen oder Rückmeldungen können Sie sich gerne an mich wenden.',
  email: 'johannk1908@hotmail.com',
  action: 'Submit',
  imageAlt: 'Contact Image',
  heading1: 'Contact Me',
  content1:
    'Ich bin hier, um Ihnen zu helfen. Bitte füllen Sie das untenstehende Formular aus oder kontaktieren Sie mich direkt.',
  imageSrc:
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0NzQ5NXw&ixlib=rb-4.0.3&q=80&w=1400',
  email2: 'kjohann1908@gmail.com',
}

ContactForm9.propTypes = {
  content2: PropTypes.string,
  email: PropTypes.string,
  action: PropTypes.string,
  imageAlt: PropTypes.string,
  heading1: PropTypes.string,
  content1: PropTypes.string,
  imageSrc: PropTypes.string,
  email2: PropTypes.string,
}

export default ContactForm9

import React from 'react'

import PropTypes from 'prop-types'

import './testimonial6.css'

const Testimonial6 = (props) => {
  return (
    <div className="thq-section-padding">
      <div className="testimonial6-max-width thq-section-max-width">
        <div
          data-thq="slider"
          data-loop="true"
          data-autoplay="true"
          data-navigation="true"
          data-pagination="true"
          className="testimonial6-slider swiper"
        >
          <div data-thq="slider-wrapper" className="swiper-wrapper">
            <div
              data-thq="slider-slide"
              className="testimonial6-slider-slide swiper-slide"
            >
              <div className="testimonial6-card">
                <p className="testimonial6-text thq-body-large">
                  {props.review1}
                </p>
                <div className="testimonial6-avatar">
                  <img
                    alt={props.author1Alt}
                    src={props.author1Src}
                    className="testimonial6-avatar-image thq-img-round thq-img-ratio-1-1"
                  />
                  <div className="testimonial6-avatar-content">
                    <span className="testimonial6-text01 thq-body-small">
                      {props.author1Name}
                    </span>
                    <span className="thq-body-small">
                      {props.author1Position}
                    </span>
                  </div>
                </div>
              </div>
              <div className="testimonial6-card1">
                <p className="testimonial6-text03 thq-body-large">
                  {props.review2}
                </p>
                <div className="testimonial6-avatar1">
                  <img
                    alt={props.author2Alt}
                    src={props.author2Src}
                    className="testimonial6-avatar-image1 thq-img-round thq-img-ratio-1-1"
                  />
                  <div className="testimonial6-avatar-content1">
                    <span className="testimonial6-text04 thq-body-small">
                      {props.author2Name}
                    </span>
                    <span className="thq-body-small">
                      {props.author2Position}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-thq="slider-slide"
              className="testimonial6-slider-slide1 swiper-slide"
            >
              <div className="testimonial6-card2">
                <p className="testimonial6-text06 thq-body-large">
                  {props.review3}
                </p>
                <div className="testimonial6-avatar2">
                  <img
                    alt={props.author3Alt}
                    src={props.author3Src}
                    className="testimonial6-avatar-image2 thq-img-round thq-img-ratio-1-1"
                  />
                  <div className="testimonial6-avatar-content2">
                    <span className="testimonial6-text07 thq-body-small">
                      {props.author3Name}
                    </span>
                    <span className="thq-body-small">
                      {props.author3Position}
                    </span>
                  </div>
                </div>
              </div>
              <div className="testimonial6-card3">
                <p className="testimonial6-text09 thq-body-large">
                  {props.review4}
                </p>
                <div className="testimonial6-avatar3">
                  <img
                    alt={props.author4Alt}
                    src={props.author4Src}
                    className="testimonial6-avatar-image3 thq-img-round thq-img-ratio-1-1"
                  />
                  <div className="testimonial6-avatar-content3">
                    <span className="testimonial6-text10 thq-body-small">
                      {props.author4Name}
                    </span>
                    <span className="thq-body-small">
                      {props.author4Position}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-thq="slider-pagination"
            className="testimonial6-slider-pagination swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
          >
            <div
              data-thq="slider-pagination-bullet"
              className="swiper-pagination-bullet swiper-pagination-bullet-active"
            ></div>
            <div
              data-thq="slider-pagination-bullet"
              className="swiper-pagination-bullet"
            ></div>
          </div>
          <div
            data-thq="slider-button-prev"
            className="swiper-button-prev"
          ></div>
          <div
            data-thq="slider-button-next"
            className="swiper-button-next"
          ></div>
        </div>
        <div
          data-thq="slider"
          data-loop="true"
          data-autoplay="true"
          data-navigation="true"
          data-pagination="true"
          className="testimonial6-slider1 swiper"
        >
          <div data-thq="slider-wrapper" className="swiper-wrapper">
            <div
              data-thq="slider-slide"
              className="testimonial6-slider-slide2 swiper-slide"
            >
              <div className="testimonial6-card4">
                <img
                  alt="Company Logo"
                  src="https://presentation-website-assets.teleporthq.io/logos/logo.png"
                  className="testimonial6-logo"
                />
                <span className="testimonial6-text12 thq-body-large">
                  Choose from our variety of pricing plans, including Basic,
                  Business, and Enterprise subscriptions, each offering a range
                  of features. Start today!
                </span>
                <div className="testimonial6-avatar4">
                  <img
                    alt={props.author1Alt}
                    src={props.author1Src}
                    className="testimonial6-avatar-image4 thq-img-round thq-img-ratio-1-1"
                  />
                  <div className="testimonial6-avatar-content4">
                    <span className="testimonial6-text13 thq-body-small">
                      <span>Author Name</span>
                      {props.author1Name}
                    </span>
                    <span className="thq-body-small">
                      Position, Company name
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-thq="slider-slide"
              className="testimonial6-slider-slide3 swiper-slide"
            >
              <div className="testimonial6-card5">
                <img
                  alt="Company Logo"
                  src="https://presentation-website-assets.teleporthq.io/logos/logo.png"
                  className="testimonial6-logo1"
                />
                <span className="testimonial6-text16 thq-body-large">
                  Choose from our variety of pricing plans, including Basic,
                  Business, and Enterprise subscriptions, each offering a range
                  of features. Start today!
                </span>
                <div className="testimonial6-avatar5">
                  <img
                    alt={props.author2Alt}
                    src={props.author2Src}
                    className="testimonial6-avatar-image5 thq-img-round thq-img-ratio-1-1"
                  />
                  <div className="testimonial6-avatar-content5">
                    <span className="testimonial6-text17 thq-body-small">
                      <span>Author Name</span>
                      {props.author2Name}
                    </span>
                    <span className="thq-body-small">
                      Position, Company name
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-thq="slider-slide"
              className="testimonial6-slider-slide4 swiper-slide"
            >
              <div className="testimonial6-card6">
                <img
                  alt="Company Logo"
                  src="https://presentation-website-assets.teleporthq.io/logos/logo.png"
                  className="testimonial6-logo2"
                />
                <span className="testimonial6-text20 thq-body-large">
                  Choose from our variety of pricing plans, including Basic,
                  Business, and Enterprise subscriptions, each offering a range
                  of features. Start today!
                </span>
                <div className="testimonial6-avatar6">
                  <img
                    alt={props.author3Alt}
                    src={props.author3Src}
                    className="testimonial6-avatar-image6 thq-img-round thq-img-ratio-1-1"
                  />
                  <div className="testimonial6-avatar-content6">
                    <span className="testimonial6-text21 thq-body-small">
                      <span>Author Name</span>
                      {props.author3Name}
                    </span>
                    <span className="thq-body-small">
                      <span>Position, Company name</span>
                      {props.author3Position}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-thq="slider-slide"
              className="testimonial6-slider-slide5 swiper-slide"
            >
              <div className="testimonial6-card7">
                <img
                  alt="Company Logo"
                  src="https://presentation-website-assets.teleporthq.io/logos/logo.png"
                  className="testimonial6-logo3"
                />
                <span className="testimonial6-text25 thq-body-large">
                  Choose from our variety of pricing plans, including Basic,
                  Business, and Enterprise subscriptions, each offering a range
                  of features. Start today!
                </span>
                <div className="testimonial6-avatar7">
                  <img
                    alt={props.author4Alt}
                    src={props.author4Src}
                    className="testimonial6-avatar-image7 thq-img-round thq-img-ratio-1-1"
                  />
                  <div className="testimonial6-avatar-content7">
                    <span className="testimonial6-text26 thq-body-small">
                      <span>Author Name</span>
                      {props.author4Name}
                    </span>
                    <span className="thq-body-small">
                      <span>Position, Company name</span>
                      {props.author4Position}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-thq="slider-pagination"
            className="testimonial6-slider-pagination1 swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
          >
            <div
              data-thq="slider-pagination-bullet"
              className="swiper-pagination-bullet swiper-pagination-bullet-active"
            ></div>
            <div
              data-thq="slider-pagination-bullet"
              className="swiper-pagination-bullet"
            ></div>
            <div
              data-thq="slider-pagination-bullet"
              className="swiper-pagination-bullet"
            ></div>
            <div
              data-thq="slider-pagination-bullet"
              className="swiper-pagination-bullet"
            ></div>
          </div>
          <div
            data-thq="slider-button-prev"
            className="swiper-button-prev"
          ></div>
          <div
            data-thq="slider-button-next"
            className="swiper-button-next"
          ></div>
        </div>
      </div>
    </div>
  )
}

Testimonial6.defaultProps = {
  author1Name: 'Anonym',
  author3Position: 'Familie',
  review1:
    'Du bist nicht nur ein Klassensprecher, du bist ein Freund, der immer für uns da ist. Dein Engagement und deine Unterstützung sind unbezahlbar.',
  author4Position: 'Freund',
  author2Position: 'Fremder',
  author4Alt: 'Anonym',
  author4Name: 'Anonym',
  review2:
    'Ich habe Sie noch nie zuvor gesehen, aber ich muss sagen, Ihr Enthusiasmus und Ihr Interesse an politischen Themen sind bemerkenswert. Sie sind definitiv jemand, den man im Auge behalten sollte.',
  author3Alt: 'Anonym',
  review3:
    'Ich erinnere mich noch gut an den kleinen  Johann, der schon immer so neugierig und voller Energie war. Jetzt sehe ich, wie er diese Eigenschaften in seinem vielseitigen Engagement einsetzt. Als Klassensprecher, Fotograf, Programmierer und politisch interessierter junger Mann ist er ein wahres Vorbild. Ich bin so stolz auf ihn und freue mich darauf, zu sehen, was die Zukunft für ihn bereithält.',
  author4Src:
    'https://st3.depositphotos.com/13159112/17145/v/450/depositphotos_171453724-stock-illustration-default-avatar-profile-icon-grey.jpg',
  author3Name: 'Oma',
  author2Alt: 'Anonym',
  review4:
    'Ich bewundere Johann für seine Fähigkeit, das Leben in all seinen Facetten zu genießen und gleichzeitig Verantwortung zu übernehmen. Er ist ein Freund, auf den man sich verlassen kann, und seine positive Einstellung ist ansteckend. Ich bin froh, ihn in meinem Leben zu haben.',
  author2Src:
    'https://st3.depositphotos.com/13159112/17145/v/450/depositphotos_171453724-stock-illustration-default-avatar-profile-icon-grey.jpg',
  author1Src:
    'https://st3.depositphotos.com/13159112/17145/v/450/depositphotos_171453724-stock-illustration-default-avatar-profile-icon-grey.jpg',
  author1Alt: 'Anoym',
  author1Position: 'Sehr enger Freund',
  author3Src:
    'https://st3.depositphotos.com/13159112/17145/v/450/depositphotos_171453724-stock-illustration-default-avatar-profile-icon-grey.jpg',
  author2Name: 'Anonym',
}

Testimonial6.propTypes = {
  author1Name: PropTypes.string,
  author3Position: PropTypes.string,
  review1: PropTypes.string,
  author4Position: PropTypes.string,
  author2Position: PropTypes.string,
  author4Alt: PropTypes.string,
  author4Name: PropTypes.string,
  review2: PropTypes.string,
  author3Alt: PropTypes.string,
  review3: PropTypes.string,
  author4Src: PropTypes.string,
  author3Name: PropTypes.string,
  author2Alt: PropTypes.string,
  review4: PropTypes.string,
  author2Src: PropTypes.string,
  author1Src: PropTypes.string,
  author1Alt: PropTypes.string,
  author1Position: PropTypes.string,
  author3Src: PropTypes.string,
  author2Name: PropTypes.string,
}

export default Testimonial6

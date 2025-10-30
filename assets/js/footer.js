import { Link } from "react-router-dom";

import PropTypes from "prop-types";

import "./footer37.css";

const Footer37 = (props) => {
  return (
    <div className="footer37-footer4 thq-section-padding">
      <div className="footer37-max-width thq-section-max-width">
        <div className="footer37-content">
          <div className="footer37-logo">
            <img
              alt={props.image1Alt}
              src={props.image1Src}
              className="footer37-image1"
            />
          </div>
          <div className="footer37-links">
            <Link to="/">{props.link1}</Link>
            <Link to="/informatik">{props.link2}</Link>
            <Link to="/foto">{props.link3}</Link>
            <Link to="/about" className="footer37-link4 thq-body-small">
              {props.link4}
            </Link>
            <Link to="/faq" className="footer37-link5 thq-body-small">
              {props.link5}
            </Link>
          </div>
          <div className="footer37-social-links">
            <div className="footer37-social-links1">
              <a
                href="https://github.com/Johann-FullHD"
                target="_blank"
                rel="noreferrer noopener"
                className="footer37-link"
              >
                <svg viewBox="0 0 1024 1024" className="footer37-icon" aria-hidden="true">
                  <use href="#icon-github" xlinkHref="#icon-github"></use>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/trainspotter.dresden/"
                target="_blank"
                rel="noreferrer noopener"
                className="footer37-link1 thq-body-small footer37-link1"
              >
                <svg viewBox="0 0 877.7142857142857 1024" className="footer37-icon2 thq-icon-small" aria-hidden="true">
                  <use href="#icon-instagram" xlinkHref="#icon-instagram"></use>
                </svg>
              </a>
              <a
                href="https://www.twitch.tv/johann_fullhd"
                target="_blank"
                rel="noreferrer noopener"
                className="footer37-link2 thq-body-small footer37-link2"
              >
                <svg viewBox="0 0 1024 1024" className="footer37-icon4" aria-hidden="true">
                  <use href="#icon-twitch" xlinkHref="#icon-twitch"></use>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCjLAZ_XMyXZzTdS9dHBDWZg"
                target="_blank"
                rel="noreferrer noopener"
                className="footer37-link3 thq-body-small footer37-link3"
              >
                <svg viewBox="0 0 1024 1024" className="footer37-icon6 thq-icon-small" aria-hidden="true">
                  <use href="#icon-youtube" xlinkHref="#icon-youtube"></use>
                </svg>
              </a>
              <a
                href="https://www.reddit.com/user/Global_Swimmer3590/"
                target="_blank"
                rel="noreferrer noopener"
                className="footer37-link-reddit thq-body-small"
                aria-label="Reddit Profil von Johann Kramer"
              >
                <svg viewBox="0 0 24 24" className="footer37-icon" aria-hidden="true">
                  <use href="#icon-reddit" xlinkHref="#icon-reddit"></use>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer37-credits">
          <div className="thq-divider-horizontal"></div>
          <div className="footer37-row">
            <div className="footer37-footer-links">
              <span className="thq-body-small">© {new Date().getFullYear()} Johann Kramer</span>
              <Link
                to="/privacy-policy"
                className="footer37-link11 thq-body-small"
              >
                {props.privacyLink}
              </Link>
              <Link
                to="/terms-of-service"
                className="footer37-link12 thq-body-small"
              >
                {props.termsLink}
              </Link>
              <Link
                to="/code-of-conduct"
                className="footer37-link13 thq-body-small"
              >
                {props.codeofConduct}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Footer37.defaultProps = {
  link2: "Informatik",
  image1Src:
    "https://images.unsplash.com/photo-1451188502541-13943edb6acb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTcxNTQ0ODMxMnw&ixlib=rb-4.0.3&q=80&w=1080",
  link4: "About",
  image1Alt: "Johann Kramer",
  link1: "Home",
  codeofConduct: "Code of Conduct",
  termsLink: "Terms of Service",
  privacyLink: "Privacy Policy",
  link5: "FAQ",
  link3: "Fotografie",
};

Footer37.propTypes = {
  link2: PropTypes.string,
  image1Src: PropTypes.string,
  link4: PropTypes.string,
  image1Alt: PropTypes.string,
  link1: PropTypes.string,
  codeofConduct: PropTypes.string,
  termsLink: PropTypes.string,
  privacyLink: PropTypes.string,
  link5: PropTypes.string,
  link3: PropTypes.string,
};

export default Footer37;
  link3: PropTypes.string,
};

export default Footer37;
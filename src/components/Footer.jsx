import React from "react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="site-footer" role="contentinfo">
      <div className="footer-org">
        <ul className="footer-breadcrumbs">
          <li>
            <a
              href="https://provost.nd.edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Office of the Provost
            </a>
          </li>
        </ul>

        <a href="#content" className="site-link">
          RealMath AR
        </a>

        <div className="footer-contacts">
          <p className="contact-info">
            <span className="address">
              353 DeBartolo Hall and 943 Flanner Hall
              <br />
              Notre Dame, IN 46556 USA
            </span>
            <span className="footer-phone">
              Phone{" "}
              <a href="tel:5746319146">(574) 631-9146</a>
            </span>
            <span className="footer-email">
              <a href="mailto:learning@nd.edu">learning@nd.edu</a>
            </span>
          </p>
        </div>

        <ul className="footer-utility">
          <li>
            <a href="mailto:arodri37@nd.edu">Report a Problem</a>
          </li>
        </ul>

        <p className="copyright">
          <a href="https://www.nd.edu/copyright/">&copy; {year}</a>{" "}
          <a href="https://www.nd.edu/">University of Notre Dame</a>
        </p>
      </div>

      <div className="footer-parent">
        <a
          href="https://www.nd.edu/"
          className="mark-footer"
          aria-label="University of Notre Dame"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://static.nd.edu/images/marks/white/ndmark.svg"
            width="250"
            height="60"
            loading="lazy"
            alt="University of Notre Dame"
          />
        </a>

        <nav aria-label="Footer links navigation">
          <ul className="footer-links">
            <li>
              <a href="https://search.nd.edu/" target="_blank" rel="noopener noreferrer">
                Search
              </a>
            </li>
            <li>
              <a href="https://mobile.nd.edu/" target="_blank" rel="noopener noreferrer">
                Mobile App
              </a>
            </li>
            <li>
              <a href="https://news.nd.edu/" target="_blank" rel="noopener noreferrer">
                News
              </a>
            </li>
            <li>
              <a href="https://events.nd.edu/" target="_blank" rel="noopener noreferrer">
                Events
              </a>
            </li>
            <li>
              <a href="https://www.nd.edu/visit/" target="_blank" rel="noopener noreferrer">
                Visit
              </a>
            </li>
            <li>
              <a
                href="https://www.nd.edu/about/accessibility/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Accessibility
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Notre Dame social media navigation">
          <ul className="footer-social">
            <li>
              <a
                href="https://www.facebook.com/notredame/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Notre Dame on Facebook"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/NotreDame"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Notre Dame on X"
              >
                X
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/notredame/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Notre Dame on Instagram"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/user/NDdotEDU"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Notre Dame on YouTube"
              >
                YouTube
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/school/university-of-notre-dame/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Notre Dame on LinkedIn"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

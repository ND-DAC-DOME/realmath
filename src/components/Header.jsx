import React from "react";

export const Header = () => {
  return (
    <>
      <nav className="skip-links" aria-label="Skip links">
        <a href="#content">Skip To Content</a>
      </nav>
      <header id="header" className="site-header">
        <div className="site-header-inner">
          <p className="mark-header">
            <a href="https://www.nd.edu/" aria-label="University of Notre Dame">
              University of Notre Dame
            </a>
          </p>
          <div className="site-title-group">
            <p className="site-parent">Notre Dame Learning</p>
            <p id="site-title" className="site-title">
              <a href="#content" title="RealMath AR">
                RealMath AR
              </a>
            </p>
          </div>
        </div>
      </header>
    </>
  );
};

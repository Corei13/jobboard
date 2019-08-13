import React from 'react';

import Header from './Header';

const Banner = () => (
  <div className="banner banner-2 banner-2-bg">
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="banner-content">
            <h1>Find the right job</h1>
            <p>Create free account to find thousands Jobs, Employment & Career Opportunities around you!</p>
            <div className="short-infos">
              <div className="info">
                <h4>5,862</h4>
                <span>Jobs Posted</span>
              </div>
              <div className="info">
                <h4>240</h4>
                <span>Companies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => (
  <>
    <Banner />
  </>
);

export default Home;
import React from 'react';
import { Container, Row, Col, Form, Modal, Nav } from 'react-bootstrap';

import Title from './helpers/Title'

const Job = () => (
  <div className="job-list">
    <div className="thumb">
      <a href="#">
        <img src="images/job/company-logo-2.png" className="img-fluid" alt="" />
      </a>
    </div>
    <div className="body">
      <div className="content">
        <h4><a href="job-details.html">Project Manager</a></h4>
        <div className="info">
          <span className="company"><a href="#"><i data-feather="briefcase"></i>Degoin</a></span>
          <span className="office-location"><a href="#"><i data-feather="map-pin"></i>San Francisco</a></span>
          <span className="job-type part-time"><a href="#"><i data-feather="clock"></i>Part Time</a></span>
        </div>
      </div>
      <div className="more">
        <div className="buttons">
          <a href="#" className="button" data-toggle="modal" data-target="#apply-popup-id">Apply Now</a>
          <a href="#" className="favourite"><i data-feather="heart"></i></a>
        </div>
        <p className="deadline">Deadline: Oct 31,  2019</p>
      </div>
    </div>
  </div>
)

const Listing = () => {
  return (
    <>
      <Title onSearch={q => console.log(q)}>Available Jobs</Title>
      <div className="alice-bg section-padding-bottom">
        <Container>
          <Row>
            <Col>
              <div className="job-listing-container">
                <div className="filtered-job-listing-wrapper">
                  <div className="job-view-controller-wrapper">
                    <div className="job-view-controller">
                      <div className="controller list active">
                        <i data-feather="menu"></i>
                      </div>
                      <div className="controller grid">
                        <i data-feather="grid"></i>
                      </div>
                      <div className="job-view-filter">
                        <select className="selectpicker">
                          <option value="" selected>Most Recent</option>
                          <option value="california">Top Rated</option>
                          <option value="las-vegas">Most Popular</option>
                        </select>
                      </div>
                    </div>
                    <div className="showing-number">
                      <span>Showing 1–12 of 28 Jobs</span>
                    </div>
                  </div>
                  <div className="job-filter-result">
                    <Job />
                    <Job />
                    <Job />
                    <Job />
                    <Job />
                    <div className="apply-popup">
                      <div className="modal fade" id="apply-popup-id" tabindex="-1" role="dialog" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title"><i data-feather="edit"></i>APPLY FOR THIS JOB</h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <form action="#">
                                <div className="form-group">
                                  <input type="text" placeholder="Full Name" className="form-control" />
                                </div>
                                <div className="form-group">
                                  <input type="email" placeholder="Email Address" className="form-control" />
                                </div>
                                <div className="form-group">
                                  <textarea className="form-control" placeholder="Message"></textarea>
                                </div>
                                <div className="form-group file-input-wrap">
                                  <label for="up-cv">
                                    <input id="up-cv" type="file" />
                                    <i data-feather="upload-cloud"></i>
                                    <span>Upload your resume <span>(pdf,zip,doc,docx)</span></span>
                                  </label>
                                </div>
                                <div className="more-option">
                                  <input className="custom-radio" type="checkbox" id="radio-4" name="termsandcondition" />
                                  <label for="radio-4">
                                    <span className="dot"></span> I accept the <a href="#">terms & conditions</a>
                                  </label>
                                </div>
                                <button className="button primary-bg btn-block">Apply Now</button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pagination-list text-center">
                    <nav className="navigation pagination">
                      <div className="nav-links">
                        <a className="prev page-numbers" href="#"><i className="fas fa-angle-left"></i></a>
                        <a className="page-numbers" href="#">1</a>
                        <span aria-current="page" className="page-numbers current">2</span>
                        <a className="page-numbers" href="#">3</a>
                        <a className="page-numbers" href="#">4</a>
                        <a className="next page-numbers" href="#"><i className="fas fa-angle-right"></i></a>
                      </div>
                    </nav>                
                  </div>
                </div>
                <div className="job-filter-wrapper">
                  <div className="selected-options same-pad">
                    <div className="selection-title">
                      <h4>You Selected</h4>
                      <a href="#">Clear All</a>
                    </div>
                    <ul className="filtered-options">
                    </ul>
                  </div>
                  <div className="job-filter-dropdown same-pad category">
                    <select className="selectpicker">
                      <option value="" selected>Category</option>
                      <option value="california">Accounting / Finance</option>
                      <option value="california">Education</option>
                      <option value="california">Design &amp; Creative</option>
                      <option value="california">Health Care</option>
                      <option value="california">Engineer &amp; Architects</option>
                      <option value="california">Marketing &amp; Sales</option>
                      <option value="california">Garments / Textile</option>
                      <option value="california">Customer Support</option>
                      <option value="california">Digital Media</option>
                      <option value="california">Telecommunication</option>
                    </select>
                  </div>
                  <div className="job-filter-dropdown same-pad location">
                    <select className="selectpicker">
                      <option value="" selected>Location</option>
                      <option value="california">Chicago</option>
                      <option value="california">New York City</option>
                      <option value="california">San Francisco</option>
                      <option value="california">Washington</option>
                      <option value="california">Boston</option>
                      <option value="california">Los Angeles</option>
                      <option value="california">Seattle</option>
                      <option value="california">Las Vegas</option>
                      <option value="california">San Diego</option>
                    </select>
                  </div>
                  <div data-id="job-type" className="job-filter job-type same-pad">
                    <h4 className="option-title">Job Type</h4>
                    <ul>
                      <li className="full-time"><i data-feather="clock"></i><a href="#" data-attr="Full Time">Full Time</a></li>
                      <li className="part-time"><i data-feather="clock"></i><a href="#" data-attr="Part Time">Part Time</a></li>
                      <li className="freelance"><i data-feather="clock"></i><a href="#" data-attr="Freelance">Freelance</a></li>
                      <li className="temporary"><i data-feather="clock"></i><a href="#" data-attr="Temporary">Temporary</a></li>
                    </ul>
                  </div>
                  <div data-id="experience" className="job-filter experience same-pad">
                    <h4 className="option-title">Experience</h4>
                    <ul>
                      <li><a href="#" data-attr="Fresh">Fresh</a></li>
                      <li><a href="#" data-attr="Less than 1 year">Less than 1 year</a></li>
                      <li><a href="#" data-attr="2 Year">2 Year</a></li>
                      <li><a href="#" data-attr="3 Year">3 Year</a></li>
                      <li><a href="#" data-attr="4 Year">4 Year</a></li>
                      <li><a href="#" data-attr="5 Year">5 Year</a></li>
                      <li><a href="#" data-attr="Avobe 5 Years">Avobe 5 Years</a></li>
                    </ul>
                  </div>
                  <div className="job-filter same-pad">
                    <h4 className="option-title">Salary Range</h4>
                    <div className="price-range-slider">
                      <div className="nstSlider" data-range_min="0" data-range_max="10000" 
                      data-cur_min="0"    data-cur_max="6130">
                        <div className="bar"></div>
                        <div className="leftGrip"></div>
                        <div className="rightGrip"></div>
                        <div className="grip-label">
                          <span className="leftLabel"></span>
                          <span className="rightLabel"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-id="post" className="job-filter post same-pad">
                    <h4 className="option-title">Date Posted</h4>
                    <ul>
                      <li><a href="#" data-attr="Last hour">Last hour</a></li>
                      <li><a href="#" data-attr="Last 24 hour">Last 24 hour</a></li>
                      <li><a href="#" data-attr="Last 7 days">Last 7 days</a></li>
                      <li><a href="#" data-attr="Last 14 days">Last 14 days</a></li>
                      <li><a href="#" data-attr="Last 30 days">Last 30 days</a></li>
                    </ul>
                  </div>
                  <div data-id="gender" className="job-filter same-pad gender">
                    <h4 className="option-title">Gender</h4>
                    <ul>
                      <li><a href="#" data-attr="Male">Male</a></li>
                      <li><a href="#" data-attr="Female">Female</a></li>
                    </ul>
                  </div>
                  <div data-id="qualification" className="job-filter qualification same-pad">
                    <h4 className="option-title">Qualification</h4>
                    <ul>
                      <li><a href="#" data-attr="Matriculation">Undergrad</a></li>
                      <li><a href="#" data-attr="Intermidiate">PhD</a></li>
                      <li><a href="#" data-attr="Gradute">No Requirement</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Listing;
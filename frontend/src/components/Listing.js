import React from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';

import Title from './helpers/Title'
import Loader from './helpers/Loader';
import Pagination from './helpers/Pagination';
import Alert from './helpers/Alert';
import { Select } from './helpers/Input';

import { getJobs, apply } from '../actions';

const Job = ({ id, company: { url, logo, name }, location, applied, onApply }) => {
  const [status, setStatus] = React.useState(applied ? 'applied' : 'apply');

  const handleApply = async () => {
    setStatus('applying');
    await onApply({ jobId: id });
    setStatus('applied');
  }

  return (
    <div className="job-list">
      <div className="thumb">
        <a href="#">
          <img src={logo} className="img-fluid" alt="" />
        </a>
      </div>
      <div className="body">
        <div className="content">
          <h4><a href="/404">{name}</a></h4>
          <div className="info">
            <span><a target="_blank" href={url}><i data-feather="briefcase"></i>{url}</a></span>
          </div>
          <div className="info">
            <span className="company"><a href="#"><i data-feather="briefcase"></i>Degoin</a></span>
            <span className="office-location"><a href="#"><i data-feather="map-pin"></i>{location}</a></span>
            <span className="job-type part-time"><a href="#"><i data-feather="clock"></i></a></span>
          </div>
        </div>
        <div className="more">
          <div className="buttons">
            <Button
              className="button" variant="light" size="lg" disabled={status !== 'apply'}
              onClick={handleApply}
            >
              {status === 'applying' ? <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="lg"
                  role="status"
                  aria-hidden="true"
                /> Applying...
                </> : <>{status === 'applied' ? 'Applied' : 'Apply Now'}</>
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Jobs = ({ jobs, onApply }) => (
  <>
    {jobs.map(job => <Job key={job.id} {...job} onApply={() => onApply(job.id)} />)}
  </>
);

const Listing = () => {
  const jobsPerPage = 10;
  const sort = React.useState('popular');
  const [page, setPage] = React.useState(1);
  const [jobs, setJobs] = React.useState({ list: [], total: 0, hash: 0 });
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const jobs = await getJobs({ offset: (page - 1) * jobsPerPage, size: jobsPerPage });
        setJobs(jobs);
      } catch (err) {
        setAlert(['danger', err.message]);
      }
      setLoading(false)
    })();
  }, [page]);
  
  const onApply = async jobId => {
    try {
      await apply({ jobId });
      setAlert(['success', 'Successfully applied!']);
    } catch (err) {
      setAlert(['danger', err.message]);
    }
  }

  return (
    <>
      <Title>Available Jobs</Title>
      <div className="alice-bg section-padding-bottom">
        <Container>
          <Row>
            <Col>
              <div className="job-listing-container">
                <div className="filtered-job-listing-wrapper">
                  <Alert state={[alert, setAlert]} />
                  {loading
                    ? (
                      <div className="job-filter-result">
                        <Loader />
                      </div>
                    ) : <>
                      <div className="job-view-controller-wrapper">
                        <div className="job-view-controller">
                          <div className="job-view-filter" style={{ width: '200px' }}>
                            <Select
                              state={sort}
                              allowEmpty={false}
                              options={[
                                ['Most Recent', 'recent'],
                                ['Most Popular', 'popular']
                              ]}
                            />
                          </div>
                        </div>
                        <div className="showing-number">
                          <span>Showing {(page - 1) * jobsPerPage + 1}–{Math.min(jobs.total, page * jobsPerPage)} of {jobs.total} Jobs</span>
                        </div>
                      </div>
                      <div className="job-filter-result">
                        <Jobs jobs={jobs.list} onApply={onApply} />
                      </div>
                      <Pagination pages={Math.ceil(jobs.total / jobsPerPage)} current={page} setPage={setPage} />
                    </>
                  }
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
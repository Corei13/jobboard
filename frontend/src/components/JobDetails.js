import React from 'react';
import { Container, Row, Col, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Title from './helpers/Title';
import Sidebar from './helpers/Sidebar';
import Loader from './helpers/Loader';
import Alert from './helpers/Alert';
import { Text, TextInline, Select } from './helpers/Input';
import { getJob, apply } from '../actions';
import Context from '../context';

const Details = ({ id, location, applied, description, company: { url, logo, name, size, about } }) => {
  const { user } = React.useContext(Context.Auth);
  const [status, setStatus] = React.useState(applied ? 'applied' : 'apply');
  const handleApply = async () => {
    setStatus('applying');
    await apply({ jobId: id });
    setStatus('applied');
  };

  return (
    <>
      <div class="job-title-and-info">
        <div class="title">
          <div class="thumb">
            <img src={logo} class="img-fluid" alt="" />
          </div>
          <div class="title-body">
            <h4>{name}</h4>
            <div class="info">
              <span class="office-location"><a href="#"><i data-feather="map-pin"></i>{location}</a></span>
              <span class="job-type full-time"><a href="#"><i data-feather="clock"></i>TODO: Full-Time</a></span>
            </div>
          </div>
        </div>
        <div class="buttons">
          { user.role === 'candidate' &&
            <Button
              className="apply" variant="light" size="lg" disabled={status !== 'apply'}
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
          }
        </div>
      </div>
      <div class="details-information section-padding-60">
        <div class="row">
          <div class="col-xl-7 col-lg-8">
            <div class="description details-section">
              <h4><i data-feather="align-left"></i>Description</h4>
              <p style={{ textAlign: 'justify' }}>{description}</p>
            </div>
            {/* <div class="responsibilities details-section">
              <h4><i data-feather="zap"></i>Responsibilities</h4>
              <ul>
                <li>The applicants should have experience in the following areas</li>
                <li>Skills on M.S Word, Excel, and Integrated Accounting package i.e. Software</li>
                <li>Have sound knowledge of commercial activities.</li>
                <li>Should have vast knowledge in IAS/ IFRS, Company Act, Income Tax, VAT.</li>
                <li>Good verbal and written communication skills.</li>
                <li>Leadership, analytical, and problem-solving abilities.</li>
              </ul>
            </div> */}
            {/* <div class="edication-and-experience details-section">
              <h4><i data-feather="book"></i>Education + Experience</h4>
              <ul>
                <li>M.Com (Accounting) / M.B.S / M.B.A under National University with CA course complete.</li>
                <li>M.S (Statistics) any Public University / National University.</li>
                <li>Masters of library science any Public University.</li>
                <li>2 to 3 year(s) Experiance</li>
              </ul>
            </div> */}
          </div>
          <div class="col-xl-4 offset-xl-1 col-lg-4">
            <div class="information-and-share">
              <div class="job-summary">
                <h4>Summary</h4>
                <ul>
                  <li><span>Published on:</span> TODO</li>
                  <li><span>Type:</span> TODO</li>
                  <li><span>Experience:</span> 2 to 3 year(s)</li>
                </ul>
              </div>
              {/* <div class="share-job-post">
                <span class="share"><i class="fas fa-share-alt"></i>Share:</span>
                <a href="#"><i class="fab fa-facebook-f"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-linkedin-in"></i></a>
                <a href="#"><i class="fab fa-google-plus-g"></i></a>
                <a href="#"><i class="fab fa-pinterest-p"></i></a>
                <a href="#" class="add-more"><span class="ti-plus"></span></a>
              </div> */}
            </div> 
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-7 col-lg-8">
          <div class="company-information details-section">
            <h4><i data-feather="briefcase"></i>About the Company</h4>
            <ul>
              <li><span>Location:</span> {location}</li>
              <li><span>Website:</span> <a target="_blank" href={url}>{url}</a></li>
              <li><span>Size:</span> {size}</li>
              <li style={{ textAlign: 'justify' }}>{about}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const JobDetails = ({ match: { params: { companyId } } }) => {
  const [job, setJob] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const job = await getJob({ companyId });
        setJob(job);
      } catch (err) {
        setAlert(['danger', err.message]);
      }
      setLoading(false);
    })();
  }, [companyId]);

  return (
    <div class="alice-bg padding-top-60 section-padding-bottom">
      <Container>
        <Row>
          <Col>
            <div class="job-listing-details">
              <Alert state={[alert, setAlert]} />
              { loading && <Loader style={{ height: '100%' }}/> }
              { job && <Details {...job} /> }
            </div>
          </Col>
        </Row>
      </Container>
    </div>  
  );
};

export default JobDetails;

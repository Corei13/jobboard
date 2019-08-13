import React from 'react';
import { Container, Row, Col, Form, Modal, Nav } from 'react-bootstrap';

import Title from './helpers/Title'
import Sidebar from './helpers/Sidebar'

const FullName = () => (
  <Form.Group>
    <input type="text" className="form-control" placeholder="Your Name" />
  </Form.Group>
);

const Informations = () => (
  <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <select className="form-control">
          <option>Select Category</option>
          <option>Accounting / Finance</option>
          <option>Health Care</option>
          <option>Garments / Textile</option>
          <option>Telecommunication</option>
        </select>
        <i className="fa fa-caret-down"></i>
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <input type="text" className="form-control" placeholder="Your Location" />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <select className="form-control">
          <option>Job Type</option>
          <option>Part Time</option>
          <option>Full Time</option>
          <option>Temperory</option>
          <option>Permanent</option>
          <option>Freelance</option>
        </select>
        <i className="fa fa-caret-down"></i>
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <select className="form-control">
          <option>Experience (Optional)</option>
          <option>Less than 1 Year</option>
          <option>2 Year</option>
          <option>3 Year</option>
          <option>4 Year</option>
          <option>Over 5 Year</option>
        </select>
        <i className="fa fa-caret-down"></i>
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <input type="text" className="form-control" placeholder="Salary Range" />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <select className="form-control">
          <option>Qualification</option>
          <option>Matriculation</option>
          <option>Intermidiate</option>
          <option>Gradute</option>
        </select>
        <i className="fa fa-caret-down"></i>
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <select className="form-control">
          <option>Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <i className="fa fa-caret-down"></i>
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <input type="date" className="form-control" />
      </div>
    </div>
    <div className="col-md-12">
      <div className="form-group datepicker">
        <input type="text" className="form-control" placeholder="Your Skill" />
      </div>
    </div>
  </div>
);

const AboutYou = () => (
  <textarea className="tinymce-editor-1" placeholder="Description text here"></textarea>
);

const Education = () => <>
  <div className="form-group">
    <input type="text" className="form-control" placeholder="Institute" />
  </div>
  <div className="form-group">
    <input type="text" className="form-control" placeholder="Period" />
  </div>
  <div className="form-group">
    <textarea className="form-control" placeholder="Description (Optional)"></textarea>
  </div>
</>;

const Single = ({ title, Component }) => (
  <Row>
    <Form.Label column={true} md={3} >{title}</Form.Label>
    <Col md={9}>
      <Component />
    </Col>
  </Row>
);

const Multi = ({ title, Component }) => {
  const [n, setN] = React.useState(1);
  return (
    <Row>
      <Form.Label column={true} md={3} >{title}</Form.Label>
      <Col md={9}>
        {Array(n).fill().map((_, i) =>
          <>
            <Component />
            {
              i === n - 1
                ? <a href="" className="add-new-field" onClick={e => { e.preventDefault(); setN(n + 1); }}>+ Add {title}</a>
                : <a href="" className="add-new-field" onClick={e => { e.preventDefault(); setN(n + 1); }}>- Remove</a>
            }
          </>
        )}
      </Col>
    </Row>
  );
};

const steps = {
  'Full Name': FullName,
  'Informations': Informations,
  'About You': AboutYou,
}

const Application = () => {
  const [step, setStep] = React.useState(0);

  const steps = {
    Alice: [FullName, Single],
    Bob: [Informations, Single],
    Education: [Education, Multi],
  };

  const [title, [Form, Type]] = Object.entries(steps)[step];

  return (
    <>
      <Title>Application</Title>
      <div className="alice-bg section-padding-bottom">
        <div className="container no-gliters">
          <div className="row no-gliters">
            <div className="col">
              <div className="post-container">
                <div className="post-content-wrapper">
                  <form action="#" className="job-post-form">
                    <div className="basic-info-input">
                      <Type title={title} Component={Form} />
                      <div className="form-group row">
                        <label className="col-md-3 col-form-label"></label>
                        <div className="col-md-9">
                          {
                            step === Object.keys(steps).length - 1
                              ? <button className="button" onClick={console.log('submit')}>Submit</button>
                              : <button className="button" onClick={() => setStep(step + 1)}>Next</button>
                          }
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <Sidebar
                  selected={step}
                  menu={Object.keys(steps)}
                  onSelect={key => console.log('selected', key)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Application;
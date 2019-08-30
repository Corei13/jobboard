import React from 'react';
import { Container, Row, Col, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Title from './helpers/Title';
import Sidebar from './helpers/Sidebar';
import Loader from './helpers/Loader';
import Alert from './helpers/Alert';
import { Text, TextInline, Select } from './helpers/Input';
import { saveCandidateProfile, getCandidateProfile } from '../actions';

const Location = ({ location, isUsResident, isSpecialCountry, isUsStudent, currentVisa, remote }) => (
  <>
    <Text
      state={location}
      title="Where do you currently reside?"
      required
    />
    <Select
      state={isUsResident}
      title="Are you a US citizen or Green Card holder?"
      bool={true}
    />
    <Select
      state={isSpecialCountry}
      title="Are you a citizen of Canada, Mexico, Singapore, Chile, or Australia? (You may be eligible for an H-1B1/E-3/TN visa)"
      bool={true}
    />
    <Select
      state={isUsStudent}
      title="Are you a current student in the US who has completed at least one year of study? (You may be eligible for OPT/CPT/F1)"
      bool={true}
    />
    <Select
      state={currentVisa}
      title="What kind of US visa do you currently have, if any?"
      options={[
        ['O-1', 'O1'],
        ['H-1B', 'H1B'],
        ['H-1B1/E-3/TN', 'H1B1_E3_TN'],
        ['OPT/CPT/F1', 'OPT_CPT_F1'],
        ['None of the above or I don\'t know', 'NA'],
      ]}
    />
    <Select
      state={remote}
      title="Are you open to working remotely?"
      options={[
        ["I don't want to work remotely", 'NO'],
        ["I'm open to working remotely", 'OPEN'],
        ["I only want to work remotely", 'ONLY']
      ]}
    />
  </>
)

const PersonalInfo = ({ firstName, lastName, linkedin }) => (
  <>
    <Form.Group>
      <InputGroup>
        <TextInline state={firstName} title="First Name" required />
        <TextInline state={lastName} title="Last Name" required />
      </InputGroup>
    </Form.Group>
    <Form.Group>
      <InputGroup>
        <TextInline state={linkedin} title="LinkedIn URL" />
      </InputGroup>
    </Form.Group>
  </>
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

const Single = ({ title, Component, states }) => (
  <Row>
    <Form.Label column={true} md={3} >{title}</Form.Label>
    <Col md={9}>
      <Component {...states} />
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

const Application = ({ history }) => {
  const [step, setStep] = React.useState(0);
  const [validated, setValidated] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [alert, setAlert] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const Forms = {
    PersonalInfo,
    Location
  };

  const steps = [
    { key: 'PersonalInfo', title: 'Personal Info', type: Single, fields: ['firstName', 'lastName', 'linkedin'] },
    { key: 'Location', title: 'Location', type: Single, fields: ['location', 'isUsResident', 'isSpecialCountry', 'isUsStudent', 'currentVisa', 'remote'] }
  ];

  React.useEffect(() => {
    (async () => {
      try {
        const profile = await getCandidateProfile();
        setProfile(profile);

        const { status = {} } = profile;
        const key = steps.findIndex(s => !status[s.key]);
        setStep(key === -1 ? steps.length - 1 : key);

        setLoading(false);
      } catch (err) {
        setAlert(['danger', err.message]);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e, key, states) => {
    e.preventDefault();
    setValidated(true);
    const data = states
      .reduce((o, k) => console.log(k, profile[k]) || ({ ...o, [k]: profile[k] }), {});
    console.log({ states, data });
    const form = e.target;
    if (form.checkValidity() === false) {
      form.reportValidity();
      return e.stopPropagation();
    }
    setSaving(true);
    try {
      const newStatus = { ...profile.status, [key]: true };
      await saveCandidateProfile({ ...data, status: newStatus });
      setProfile({ ...profile, status: newStatus });
      if (step === steps.length - 1) {
        history.push('/jobs');
      } else {
        setStep(step + 1);
      }
      setSaving(false);
    } catch (err) {
      setAlert(['danger', err.message]);
      setSaving(false);
      console.error(err);
    }
  }

  const { key, title, SubForm = Forms[key], type: Type, fields } = steps[step];
  console.log(steps[step]);

  return (
    <>
      <Title>Application</Title>
      <div className="alice-bg section-padding-bottom">
        <Container>
          <Row>
            <Col>
              <div className="post-container">
                <div className="post-content-wrapper">
                  <Alert state={[alert, setAlert]} />
                  {
                    loading
                      ? <Loader style={{ height: '100%' }}/>
                      : (
                        <Form
                          className="job-post-form"
                          noValidate validated={validated}
                          onSubmit={e => { e.persist(); handleSubmit(e, key, fields) }}
                          disabled
                        >
                          <div className="basic-info-input">
                            <Type title={title} Component={SubForm} states={fields.reduce((o, k) => ({ ...o, [k]: [profile[k], v => setProfile({ ...profile, [k]: v })] }), {})} />
                            <div className="form-group row">
                              <label className="col-md-3 col-form-label"></label>
                              <Col md={9}>
                                <Button className="button" size="lg" variant="primary" type="submit" disabled={saving}>
                                  {saving ? <>
                                    <Spinner
                                      as="span"
                                      animation="grow"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                    /> Please wait...
                                  </> : <>Save</>
                                  }
                                </Button>
                              </Col>
                            </div>
                          </div>
                        </Form>
                      )
                  }
                </div>
                <Sidebar
                  selected={step}
                  menu={steps.map(({ key, title }, index) => ({ title, done: profile.status && profile.status[key], active: index === step }))}
                  onSelect={step => setStep(step)}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default withRouter(Application);
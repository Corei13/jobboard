import React from 'react';
import { Container, Row, Col, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Title from './helpers/Title';
import Sidebar from './helpers/Sidebar';
import Loader from './helpers/Loader';
import Alert from './helpers/Alert';
import { Text, TextInline, Select } from './helpers/Input';
import { saveCandidateProfile, getCandidateProfile } from '../actions';

const Location = ({ location, remote }) => (
  <>
    <Text
      state={location}
      title="Where do you currently reside?"
      required
    />

    <Select
      state={remote}
      title="Are you open to working remotely?"
      bool={true}
    />
  </>
);

const Citizenship = ({ us_citizen, us_green_card, us_work_visa, us_student, uk_eu_citizen, special_citizen }) => (
  <>
    <Select
      state={us_citizen}
      title="Are you a US Citizen?"
      bool={true}
    />

    <Select
      state={us_green_card}
      title="Are you a US Green card holder?"
      bool={true}
    />

    <Select
      state={us_work_visa}
      title="Do you have a US work visa (H1B, etc.)?"
      bool={true}
    />

    <Select
      state={us_student}
      title="Are you a current student in the US who has completed at least one year of study? (You may be eligible for OPT/CPT/F1)"
      bool={true}
    />

    <Select
      state={uk_eu_citizen}
      title="Are you a citizen of the UK or EU?"
      bool={true}
    />

    <Select
      state={special_citizen}
      title="Are you a citizen of Canada, Mexico, Singapore, Chile, or Australia? (You may be eligible for an H-1B1/E-3/TN visa)"
      bool={true}
    />
  </>
)

const PersonalInfo = ({ first_name, last_name, linkedin }) => (
  <>
    <Form.Group>
      <InputGroup>
        <TextInline state={first_name} title="First Name" required />
        <TextInline state={last_name} title="Last Name" required />
      </InputGroup>
    </Form.Group>
    <Form.Group>
      <InputGroup>
        <TextInline state={linkedin} title="LinkedIn URL" />
      </InputGroup>
    </Form.Group>
  </>
);

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
    Location,
    Citizenship
  };

  const steps = [
    {
      key: 'PersonalInfo', title: 'Personal Info', type: Single,
      fields: ['first_name', 'last_name', 'linkedin']
    },

    {
      key: 'Location', title: 'Location', type: Single,
      fields: ['location', 'remote']
    },

    {
      key: 'Citizenship', title: 'Citizenship', type: Single,
      fields: ['us_citizen', 'us_green_card', 'us_work_visa', 'us_student', 'uk_eu_citizen', 'special_citizen']
    }
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
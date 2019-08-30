import React from 'react';
import { Container, Row, Col, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Title from './helpers/Title';
import Sidebar from './helpers/Sidebar';
import Loader from './helpers/Loader';
import Alert from './helpers/Alert';
import { Text, URL, TextArea, Number, TextInline, Select } from './helpers/Input';
import { saveCompanyProfile, getCompanyProfile } from '../actions';

const Company = ({ name, url, logo, size, about }) => (
  <>
    <Text state={name} title="Company Name" required />
    <URL state={url} title="URL" required />
    <URL state={logo} title="Logo" required />
    <Select
      state={size}
      title="Company Size"
      options={[
        ['<5', '_5'],
        ['5-10', '_5_10'],
        ['10-50', '_10_50'],
        ['50-100', '_50_100'],
        ['100+', '_100_'],
      ]}
    />
    <Text state={about} title="About" />
  </>
);

const Job = ({ location, remote, description }) => (
  <>
    <Text state={location} title="Location" required />
    <TextArea state={description} title="Job Description" />
    <Select
      state={remote}
      title="Are you open to remote?"
      options={[
        ["We don't allow remote", 'NO'],
        ["We are open to remote", 'OPEN'],
        ["We are remote-only", 'ONLY']
      ]}
    />
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

const CompanyDetails = ({ history }) => {
  const [step, setStep] = React.useState(0);
  const [validated, setValidated] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [alert, setAlert] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const Forms = {
    Company,
    Job
  };

  const steps = [
    { key: 'Company', title: 'Company Details', type: Single, fields: ['name', 'url', 'logo', 'size', 'about'] },
    { key: 'Job', title: 'Job Details', type: Single, fields: ['location', 'remote', 'description'] },
  ];

  React.useEffect(() => {
    (async () => {
      try {
        const profile = await getCompanyProfile();
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
      await saveCompanyProfile({
        companyId: profile.company_id,
        jobId: profile.job_id,
        ...data,
        status: newStatus
      });
      setProfile({ ...profile, status: newStatus });
      setAlert(['success', 'Successfully saved!']);
      if (step === steps.length - 1) {
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

export default withRouter(CompanyDetails);
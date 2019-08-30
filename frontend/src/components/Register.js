import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import Context from '../context';
import { signup } from '../actions';
import { hash, storeToken } from '../utils';
import Alert from './helpers/Alert';

const Register = ({ history }) => {
  const [validated, setValidated] = React.useState(false);
  const { updateUser } = React.useContext(Context.Auth);
  const [saving, setSaving] = React.useState(false);
  const [alert, setAlert] = React.useState([]);
  const [role, setRole] = React.useState('candidate');

  const firstName = React.useRef(null);
  const lastName = React.useRef(null);
  const email = React.useRef(null);
  const password = React.useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setValidated(true);
    const data = {
      firstName: firstName.current.value.trim(),
      lastName: lastName.current.value.trim(),
      email: email.current.value.trim(),
      password: await hash(password.current.value.trim()),
      role
    };
    console.log(data);
    const form = e.target;
    if (form.checkValidity() === false) {
      return e.stopPropagation();
    }
    setSaving(true);
    try {
      const { token } = await signup(data);
      storeToken(token);
      updateUser();
    } catch (err) {
      setAlert(['danger', err.message]);
      setSaving(false);
    }
  }

  return (
    <div className="padding-top-90 padding-bottom-90 access-page-bg">
      <Container>
        <Row>
          <Col xl={4} md={6}>
            <div className="access-form">
              <div className="form-header">
                <h5><i data-feather="edit"></i>Register Account</h5>
              </div>
              <Alert state={[alert, setAlert]} />
              <Form noValidate validated={validated} onSubmit={e => { e.persist(); handleSubmit(e) }} disabled>
                <div className="account-type">
                  <label htmlFor="idRegisterCan">
                    <Form.Control onClick={() => setRole('candidate')} id="idRegisterCan" type="radio" name="register" defaultChecked={role === 'candidate'} />
                    <span>Candidate</span>
                  </label>
                  <label htmlFor="idRegisterEmp">
                    <Form.Control onClick={() => setRole('employer')} id="idRegisterEmp" type="radio" name="register" defaultChecked={role === 'employer'} />
                    <span>Employer</span>
                  </label>
                </div>
                <Form.Group>
                  <InputGroup>
                    <Form.Control ref={firstName} required size="lg" placeholder="First Name" />
                    <Form.Control ref={lastName} required size="lg" placeholder="Last Name" />
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Form.Control ref={email} required size="lg" type="email" placeholder="Email Address" />
                </Form.Group>
                <Form.Group>
                  <Form.Control ref={password} required size="lg" type="password" placeholder="Password" />
                </Form.Group>
                {/* <div className="more-option terms">
                  <div className="mt-0 terms">
                    <input className="custom-radio" type="checkbox" id="radio-4" name="termsandcondition" checked />
                    <label htmlFor="radio-4">
                      <span className="dot"></span> I accept the <a href="#">terms & conditions</a>
                    </label>
                  </div>
                </div> */}
                <Button className="button" size="lg" block variant="primary" type="submit" disabled={saving}>
                  {saving ? <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> Please wait...
                  </> : <>Register</>
                  }
                </Button>
              </Form>
              <div className="shortcut-login">
                {/* <span>Or connect with</span>
                <div className="buttons">
                  <a href="#" className="facebook"><i className="fab fa-facebook-f"></i>Facebook</a>
                  <a href="#" className="google"><i className="fab fa-google"></i>Google</a>
                </div> */}
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(Register);

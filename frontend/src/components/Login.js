import React from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import Context from '../context';
import { signin } from '../actions';
import { hash, storeToken } from '../utils';
import Alert from './helpers/Alert';

const Login = ({ history }) => {
  const [validated, setValidated] = React.useState(false);
  const { updateUser } = React.useContext(Context.Auth);
  const [saving, setSaving] = React.useState(false);
  const [alert, setAlert] = React.useState([]);

  const email = React.useRef(null);
  const password = React.useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setValidated(true);
    const data = {
      email: email.current.value.trim(),
      password: await hash(password.current.value.trim()),
    };
    const form = e.target;
    if (form.checkValidity() === false) {
      return e.stopPropagation();
    }
    setSaving(true);
    try {
      const { token } = await signin(data);
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
                <h5><i data-feather="edit"></i>Login</h5>
              </div>
              <Alert state={[alert, setAlert]} />
              <Form noValidate validated={validated} onSubmit={e => { e.persist(); handleSubmit(e) }} disabled>
                <Form.Group>
                  <Form.Control ref={email} required size="lg" type="email" placeholder="Email Address" />
                </Form.Group>
                <Form.Group>
                  <Form.Control ref={password} required size="lg" type="password" placeholder="Password" />
                </Form.Group>
                <Button className="button" size="lg" block variant="primary" type="submit" disabled={saving}>
                  {saving ? <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> Please wait...
                  </> : <>Login</>
                  }
                </Button>
              </Form>
              <div className="shortcut-login">
                {/* <span>Or connect with</span>
                <div className="buttons">
                  <a href="#" className="facebook"><i className="fab fa-facebook-f"></i>Facebook</a>
                  <a href="#" className="google"><i className="fab fa-google"></i>Google</a>
                </div> */}
                <p>Don't have an account? <Link to="/register">Register</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(Login);

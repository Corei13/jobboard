import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import Context from '../context';
import { signout } from '../actions';

const Header = ({ history, ...rest }) => {
  const { user, updateUser } = React.useContext(Context.Auth);
  return (
    <header className="header-2">
      <Container>
        <Row>
          <Col>
            <div className="header-top">
              <div className="logo-area">
                <Link to="/" as="a"><img src="images/logo-2.png" alt="" /></Link>
              </div>
              <div className="header-top-toggler">
                <div className="header-top-toggler-button"></div>
              </div>
              <div className="top-nav">
                <div className="dropdown header-top-account login-modals">
                  { !user ?
                      <>
                        <button type="button" onClick={() => history.push('/login')}>Login</button>
                        <button type="button" onClick={() => history.push('/register')}>Register</button>
                      </> :
                      <>
                        {
                          user.role === 'candidate' &&
                            <button type="button" onClick={() => history.push('/application')}>Update Profile</button>
                        }
                        {
                          user.role === 'employer' &&
                            <button type="button" onClick={() => history.push('/company-details')}>Update Company Info</button>
                        }
                        <button type="button" onClick={() => { signout(); updateUser(); }}>Logout</button>
                      </>
                  }
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  )
};

export default withRouter(Header);
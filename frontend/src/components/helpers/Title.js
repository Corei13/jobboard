import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Title = ({ children, onSearch  }) => (
  <div className="alice-bg padding-top-70 padding-bottom-70">
    <Container>
      <Row>
        <Col md={6}>
          <div className="breadcrumb-area">
            <h1>{children}</h1>
          </div>
        </Col>
        {
          onSearch && (
            <Col md={6}>
              <div className="breadcrumb-form">
                <form action="#">
                  <input type="text" placeholder="Search" />
                  <button><i data-feather="search"></i></button>
                </form>
              </div>
            </Col>
          )
        }
      </Row>
    </Container>
  </div>
);

export default Title;


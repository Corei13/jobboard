import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ size = '40px', style }) => (
  <div className="d-flex justify-content-center align-items-center" style={style}>
    <Spinner style={{ height: size, width: size }} animation="border" size="lg" />
  </div>
);

export default Loader;

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

const BootstrapGrid = () => {
  return (
    <Row className="mb-3">
      <Col md={2}></Col>
      <Col md={3} className="bg-light p-3">
        <h2>Column 1 (6 columns)</h2>
        <p>This column spans 6 out of 12 grid spaces. You can place any content you want here.</p>
        <Button variant="primary">Learn More</Button>
      </Col>
      <Col md={1}></Col>
      <Col md={3} className="bg-info text-white p-3">
        <h2>Column 2 (3 columns)</h2>
        <p>This column spans 3 out of 12 grid spaces. Bootstrap's grid system is responsive.</p>
        <Button variant="secondary">Details</Button>
      </Col>
      <Col md={3} className="bg-secondary text-white p-3">
        <h2>Column 3 (3 columns)</h2>
        <p>This column also spans 3 out of 12 grid spaces. You can easily rearrange columns on different screen sizes.</p>
        <Button variant="success">Contact Us</Button>
      </Col>
    </Row>
  );
};

export default BootstrapGrid;

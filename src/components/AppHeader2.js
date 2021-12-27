import React from "react";
import { Row, Col } from "react-bootstrap";

const AppHeader2 = (props) => {
  return (
    <>
      <Row className="pt-2 my-2">
        <Col className="col-12 col-md-6 text-center text-md-start">
          <h1>{props.title}</h1>
        </Col>
      </Row>
    </>
  );
};

export default AppHeader2;

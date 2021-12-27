import React, { useRef } from "react";
import { Col, Row, Form, Modal, Button, Alert } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

const MyForm = (props) => {
  const innerRef = useRef(); //to handle autofocus

  const triggerClose = () => {
    props.resetForm();
  };

  return (
    <>
      <Modal
        show={props.showForm}
        onHide={() => triggerClose()}
        onShow={() => {
          innerRef.current.focus();
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Show Success / Error Messages */}
          {props.showMessage.show ? (
            //if set then
            <Alert variant={props.showMessage.variant}>
              {" "}
              {props.showMessage.message}{" "}
            </Alert>
          ) : //else
          null}

          <Form id="frmMyForm" onSubmit={(e) => props.triggerSave(e)}>
            <Row>
              <Col className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="text-start ">
                    Name <i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    value={props.form.name}
                    onChange={props.triggerInputChange}
                    ref={innerRef}
                    required
                  />
                </Form.Group>
              </Col>
              <Col className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="text-start ">Value</Form.Label>
                  <Form.Control
                    name="value"
                    type="text"
                    value={props.form.value}
                    onChange={props.triggerInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" form="frmMyForm" variant="primary">
            <FaCheck /> Save
          </Button>
          <Button variant="danger" onClick={() => triggerClose()}>
            <FaTimes /> Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyForm;

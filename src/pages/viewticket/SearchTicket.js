import React, { useRef } from "react";
import { Col, Row, Form, Modal, Button, Alert } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

const SearchTicket = (props) => {
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
        size="sm"
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

          <Form
            id="frmSearchTicket"
            onSubmit={(e) => props.triggerSearchTicket(e)}
          >
            <Row>
              <Col className="col-12">
                <Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-start ">
                      Ticket No. <i className="text-danger">*</i>
                    </Form.Label>
                    <Form.Control
                      name="ticketNo"
                      type="text"
                      value={props.form.ticketNo}
                      onChange={props.triggerSearchInputChange}
                      ref={innerRef}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-start ">
                      Email <i className="text-danger">*</i>
                    </Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      value={props.form.email}
                      onChange={props.triggerSearchInputChange}
                      required
                    />
                  </Form.Group>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" form="frmSearchTicket" variant="primary">
            <FaCheck /> Search
          </Button>
          <Button variant="danger" onClick={() => triggerClose()}>
            <FaTimes /> Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SearchTicket;

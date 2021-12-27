import React, { useRef } from "react";
import { Col, Row, Form, Modal, Button, Alert } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const MyForm = (props) => {
  const innerRef = useRef(); //to handle autofocus
  const roles = useSelector((state) => state.data.roles);
  const statuses = useSelector((state) => state.data.statuses);
  const isEdit = useSelector((state) => state.isEdit);

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
                  <Form.Label className="text-start ">
                    Email <i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    value={props.form.email}
                    onChange={props.triggerInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {isEdit ? null : ( //if for is for edit
              //else then show passwords fields
              <Row>
                <Col className="col-12 col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label className="text-start ">
                      Password <i className="text-danger">*</i>
                    </Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      value={props.form.password}
                      onChange={props.triggerInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col className="col-12 col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label className="text-start ">
                      Retype Password <i className="text-danger">*</i>
                    </Form.Label>
                    <Form.Control
                      name="repassword"
                      type="password"
                      value={props.form.repassword}
                      onChange={props.triggerInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              <Col className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="text-start ">
                    Role <i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={props.form.role}
                    onChange={props.triggerInputChange}
                    required
                  >
                    <option value=""> -- Select -- </option>
                    {roles //check if exist
                      ? roles.map((role) => {
                          return (
                            <option value={role._id} key={role._id}>
                              {role.name}
                            </option>
                          );
                        })
                      : //if not
                        null}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="col-12 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="text-start ">
                    Status <i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={props.form.status}
                    onChange={props.triggerInputChange}
                    required
                  >
                    <option value=""> -- Select -- </option>
                    {statuses //check if exist
                      ? statuses.map((status) => {
                          return (
                            <option value={status._id} key={status._id}>
                              {status.name}
                            </option>
                          );
                        })
                      : //if not
                        null}
                  </Form.Select>
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

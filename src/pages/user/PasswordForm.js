import React,{useRef} from 'react';
import {Col, Row, Form, Modal, Button, Alert } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PasswordForm = props => {
    const innerRef = useRef(); //to handle autofocus   

    const triggerClose = () => {
        props.resetForm();
    }

    return (
        <>
            <Modal
                show={props.showPasswordForm}
                onHide={() => triggerClose()}
                onShow={() => {innerRef.current.focus()}}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className="bg-primary text-white" >
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {/* Show Success / Error Messages */}
                    {props.showMessage.show
                        ? //if set then  
                        (<Alert variant={props.showMessage.variant} > {props.showMessage.message} </Alert>)
                        : //else
                        null
                    }
                    
                    <Form id="frmPassword" onSubmit={(e)=>props.triggerSavePassword(e)}>
                        <Row>
                            <Col className="col-12 col-md-6">
                                <Form.Group className="mb-3" >
                                    <Form.Label className="text-start ">Password <i className="text-danger">*</i></Form.Label>
                                    <Form.Control name="password" type="password" value={props.form.password} onChange={props.triggerInputChange} ref={innerRef} required />
                                </Form.Group>
                            </Col>
                            <Col className="col-12 col-md-6">
                                <Form.Group className="mb-3" >
                                    <Form.Label className="text-start ">Retype Password <i className="text-danger">*</i></Form.Label>
                                    <Form.Control name="repassword" type="password" value={props.form.repassword} onChange={props.triggerInputChange}  required />
                                </Form.Group>
                            </Col>
                        </Row>                   
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {/* <Button variant="primary" onClick={()=>props.triggerSavePassword()}> */}
                    <Button type="submit" form="frmPassword" variant="primary">
                        <FaCheck /> Save 
                    </Button> 
                    <Button variant="danger" onClick={() => triggerClose()} >
                        <FaTimes /> Close
                    </Button>                    
                </Modal.Footer>
            </Modal>
        </>
  );
}

export default PasswordForm

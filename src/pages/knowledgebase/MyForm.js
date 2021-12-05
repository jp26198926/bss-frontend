import React,{useRef} from 'react';
import {Col, Row, Form, Modal, Button, Alert } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useSelector} from 'react-redux';

const MyForm = props => {
    const innerRef = useRef(); //to handle autofocus
    
    const triggerClose = () => {
        props.resetForm();
    }

    return (
        <>
            <Modal
                show={props.showForm}
                onHide={() => triggerClose()}
                onShow={() => {innerRef.current.focus()}}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header className="bg-primary text-white" >
                    <Modal.Title>{props.title} { props.form.ticketNo }</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {/* Show Success / Error Messages */}
                    {props.showMessage.show
                        ? //if set then  
                        (<Alert variant={props.showMessage.variant} > {props.showMessage.message} </Alert>)
                        : //else
                        null
                    }
                    
                    <Form id="frmMyForm" onSubmit={(e)=>props.triggerSave(e)}>
                        <Row>                            
                            <Col className="col-12">
                                <Row>
                                    <Form.Group className="mb-3" >
                                        <Form.Label className="text-start ">Subject <i className="text-danger">*</i></Form.Label>
                                        <Form.Control name="subject" type="text" value={props.form.subject} onChange={props.triggerInputChange} ref={innerRef}  required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label className="text-start ">Message <i className="text-danger">*</i></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="message"
                                            value={props.form.message}
                                            onChange={props.triggerInputChange}
                                            style={{ height: '125px' }}
                                            required
                                        />                                       
                                    </Form.Group>
                                </Row>
                            </Col>
                        </Row>
                        
                    </Form>
                </Modal.Body>

                <Modal.Footer>                    
                    <Button type="submit" form="frmMyForm" variant="primary" >
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

export default MyForm

import React,{useRef} from 'react';
import {Col, Row, Form, Modal, Button, Alert } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
            >
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {/* Show Success / Error Messages */}
                    {props.showMessage.show
                        ? //if set then  
                        (<Alert variant={props.showMessage.variant} > {props.showMessage.message} </Alert>)
                        : //else
                        null
                    }
                    
                    <Form>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm="2" className="text-start text-md-end">
                                Name
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    name="name"
                                    type="text"
                                    value={props.form.name}
                                    onChange={props.triggerInputChange}
                                    ref={innerRef}
                                    autoFocus
                                />
                            </Col>
                        </Form.Group>                        
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={()=>props.triggerSave()}>
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

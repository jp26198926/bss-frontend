import React, { useRef } from 'react';
import axios from 'axios';
import {Col, Row, Form, Modal, Button, Alert } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AssignedTech = props => {
    const navigate = useNavigate();
    const innerRef = useRef(); //to handle autofocus
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const users = useSelector(state => state.data?.users);
    const setAssignedTech = useSelector(state => state.forms?.setAssignedTech);
    const selectedData = useSelector(state => state.selectedData);
    const showMessage = useSelector(state => state.showMessage);

    const triggerInputChange = e => {
        e.preventDefault();
        dispatch( //hide set status
            {
                type: 'FORM_ASSIGNED_TECH',
                payload: {
                    ...setAssignedTech,
                    value: e.target.value
                }
            }
        );        
    }
    
    //save
    const triggerSave = async (e) => {
        e.preventDefault();
        
        //check if required field is not empty        
        if (setAssignedTech?.value) {
            
            let response = {};
            let selectedTicketId = setAssignedTech?.ticketId
            let selectedTech = setAssignedTech?.value;

            await axios.put(settings?.API_URL + '/Ticket/AssignedTech/' + selectedTicketId, {assignedTech: selectedTech }).then(result => {
                if (!result.data.error) {
                    response = { success: "Successfully updated!", data: result.data.result };
                } else {
                    response = { error: result.data.error };
                }
            });
             
            
            if (!response?.error) {
                dispatch({
                    type: 'SHOW_TOAST_MESSAGE',
                    payload: {
                        show: true,
                        title: settings?.appName,
                        message: response.success,
                        variant: 'primary'
                    }
                });
                triggerClose(); //reset form
                dispatch({ type: 'SET_DATA_SELECTED', payload: response?.data });    
                //navigate('/ViewTicket/' + response?.data?._id);
                //getAllOpenTicket(); //re populate the open ticket  
            } else {
                //show Error
                dispatch( 
                    { 
                        type: 'SHOW_MESSAGE',
                        payload: {                    
                            show: true,
                            variant: "danger",
                            message: response?.error
                        }
                    }
                );                
            }  
        } else {
            //show Error
            dispatch( 
                { 
                    type: 'SHOW_MESSAGE',
                    payload: {                    
                        show: true,
                        variant: "danger",
                        message: "Required field cannot be empty!"
                    }
                }
            );
        }        
    }

    const triggerClose = () => {
        dispatch( //hide set status
            {
                type: 'FORM_ASSIGNED_TECH',
                payload: {
                    ticketId: "",
                    show: false,
                    value: ""
                }
            }
        );

        dispatch( //hide show message
            { 
                type: 'SHOW_MESSAGE',
                payload: {                    
                    show: false,
                    variant: "danger",
                    message: ""
                }
            }
        );
    }

    return (
        <>
            <Modal
                show={setAssignedTech.show}
                onHide={() => triggerClose()}
                onShow={() => {innerRef.current.focus()}}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                size="sm"
            >
                <Modal.Header className="bg-primary text-white" >
                    <Modal.Title>Status</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {/* Show Success / Error Messages */}
                    {showMessage.show
                        ? //if set then  
                        (<Alert variant={showMessage.variant} > {showMessage.message} </Alert>)
                        : //else
                        null
                    }
                    
                    <Form id="frmSetStatus" onSubmit={(e)=>triggerSave(e)}>
                        <Row>
                            <Col className="col-12">
                                <Row>                                    
                                    <Form.Group className="mb-3" >
                                        <Form.Label className="text-start ">Assign Tech <i className="text-danger">*</i></Form.Label>
                                        <Form.Select
                                            name="assignedTech" 
                                            value={setAssignedTech.value}
                                            onChange={triggerInputChange}
                                            required
                                            ref={innerRef}
                                        >
                                            <option value=""> -- Select -- </option>
                                            {                                                
                                                users ? //check if exist
                                                    users.map(user => {
                                                        return(<option value={user._id} key={user._id}>{user.name}</option>)
                                                    })
                                                    : //if not
                                                    null
                                            }                                
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>                    
                    <Button type="submit" form="frmSetStatus" variant="primary" >
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

export default AssignedTech

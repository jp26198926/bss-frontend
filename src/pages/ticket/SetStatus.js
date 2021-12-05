import React, { useRef } from 'react';
import axios from 'axios';
import {Col, Row, Form, Modal, Button, Alert } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SetStatus = props => {
    const navigate = useNavigate();
    const innerRef = useRef(); //to handle autofocus
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const ticketStatuses = useSelector(state => state.data?.ticketStatuses);
    const setTicketStatus = useSelector(state => state.forms?.setTicketStatus);
    const selectedData = useSelector(state => state.selectedData);
    const showMessage = useSelector(state => state.showMessage);

    const triggerInputChange = e => {
        e.preventDefault();
        dispatch( //hide set status
            {
                type: 'FORM_TICKET_STATUS',
                payload: {
                    ...setTicketStatus,
                    value: e.target.value
                }
            }
        );        
    }
    
    //save
    const triggerSave = async (e) => {
        e.preventDefault();
        
        //check if required field is not empty        
        if (setTicketStatus?.value) {
            
            let response = {};
            let selectedTicketId = setTicketStatus?.ticketId
            let selectedStatus = setTicketStatus?.value;

            await axios.put(settings?.API_URL + '/Ticket/SetStatus/' + selectedTicketId, {status: selectedStatus }).then(result => {
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
                type: 'FORM_TICKET_STATUS',
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
                show={setTicketStatus.show}
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
                                        <Form.Label className="text-start ">Set Status <i className="text-danger">*</i></Form.Label>
                                        <Form.Select
                                            name="category" 
                                            value={setTicketStatus.value}
                                            onChange={triggerInputChange}
                                            required
                                            ref={innerRef}
                                        >
                                            <option value=""> -- Select -- </option>
                                            {                                                
                                                ticketStatuses ? //check if exist
                                                    ticketStatuses.map(status => {
                                                        return(<option value={status._id} key={status._id}>{status.name}</option>)
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

export default SetStatus

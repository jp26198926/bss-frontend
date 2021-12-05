import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import axios from 'axios';
import { Table, Button, Col, Row, Card, ListGroup, Form } from 'react-bootstrap';
import {  FaCheck, FaTimes, FaExchangeAlt } from 'react-icons/fa';

//components
import MyForm from './MyForm';
import AppHeader2 from '../../components/AppHeader2';
import AppConfirm from '../../components/AppConfirm';
import AppModal from '../../components/AppModal';

const ViewTicket = props => {
    const { id } = useParams();
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);    
    const [form, setForm] = useState(
        {
            name: "",
            email: "",            
            category: "",
            subject: "",
            message: "",
            status: ""
        }
    );
    const [showMessage, setShowMessage] = useState({ show: false, variant: "danger", message: "" });
    
    const dispatch = useDispatch();
    const API_URL = useSelector(state => state.settings.API_URL);
    const datas = useSelector(state => state.datas);
    const showConfirm = useSelector(state => state.showConfirm);
    const isEdit = useSelector(state => state.isEdit);

    const { name, email, category, subject, message, status } = form;

    const resetForm = () => {
        setForm({
            ticketNo: "",
            name: "",
            email: "",            
            category: "",
            subject: "",
            message: "",
            status: ""
        }); //cleared out form field
        setShowForm(false); //hide form        
        setShowMessage({ ...showMessage, show: false }); //hide message
    }

    //copy db data to redux upon load
    useEffect(() => {
        //get main data for this page
        axios.get(API_URL + '/Ticket/openTicket').then(result => {            
            dispatch({ type: 'SET_DATA', payload: result.data.result });
        });

        //get other data
        axios.get(API_URL + '/TicketCategory').then(result => {            
            dispatch({ type: 'SET_TICKET_CATEGORY', payload: result.data.result });
        });

        axios.get(API_URL + '/TicketStatus').then(result => {
            dispatch({ type: 'SET_TICKET_STATUS', payload: result.data.result });
        });
    }, []);

    const getAllOpenTicket = () => {
        axios.get(API_URL + '/Ticket/openTicket').then(result => {           
            dispatch({ type: 'SET_DATA', payload: result.data.result });
        }); 
    }

    const triggerSearch = () => {        
        axios.post(API_URL + '/Ticket/search', { search: search }).then(result => {           
            dispatch({ type: 'SET_DATA', payload: result.data.result });
        });        
    }

    const triggerInputChange = e => {
        setForm({...form, [e.target.name]: e.target.value });
    }

    //save
    const triggerSave = async (e) => {
        e.preventDefault();
        
        //check if required field is not empty        
        if (name && email && category && subject && message) {
            
            let response = {};
            
            if (isEdit) { //update

                await axios.put(API_URL + '/Ticket/' + isEdit, form).then(result => {
                    if (!result.data.error) {
                        response = { success: "Successfully modified!" };
                    } else {
                        response = { error: result.data.error };
                    }  
                });                
                
            } else { //add

                await axios.post(API_URL + '/Ticket/', form).then(result => {
                    if (!result.data.error) {
                        response = { success: "Successfully added!" };
                    } else {
                        response = { error: result.data.error };
                    }                            
                });                
            }  
            
            if (!response?.error) {
                dispatch({
                    type: 'SHOW_TOAST_MESSAGE',
                    payload: {
                        show: true,
                        title: props.title,
                        message: response.success,
                        variant: 'primary'
                    }
                });
                resetForm(); //reset form
                getAllOpenTicket(); //re populate the open ticket  
            } else {
                //show Error
                setShowMessage({ ...showMessage, show: true, variant: "danger", message: response?.error });
            }  
        } else {
            //show Error
            setShowMessage({ ...showMessage, show: true, variant: "danger", message: "Required field cannot be empty!" });
        }        
    }

    //edit
    const triggerEdit = async (record) => {
        await dispatch({ type: 'SET_IS_EDIT', payload: record._id});
        setForm({
            ticketNo: record.ticketNo,
            name: record.name,
            email: record.email,
            category: record.category._id,
            subject: record.subject,
            message: record.message,
            status: record.status.name
        });
        setShowForm(true);
    }

    //confirm delete
    const triggerConfirm = record => {        
        const customMsg = `Are you sure want to delete this record?`;
        dispatch({ type: 'SHOW_CONFIRM', payload: { show: true, data: record, message: customMsg } });
    }

    //delete record
    const triggerConfirmedYes = () => {
        
        const recordId = showConfirm.data._id;
        
        axios.delete(API_URL + '/Ticket/' + recordId).then(result => {
            
            //hide Confirm window
            dispatch({ type: 'SHOW_CONFIRM', payload: { show: false, data: {}, message: "" } });
            
            if (!result.data.error) {
                //show success message
                dispatch({
                    type: 'SHOW_TOAST_MESSAGE',
                    payload: {
                        show: true,
                        title: props.title,
                        message: 'Successfully deleted!',
                        variant: 'primary'
                    }
                });
                getAllOpenTicket(); //re populate the open ticket  
            } else {
                //show Error
                dispatch({type: 'SHOW_MODAL', payload: {show:true, message: "Deletion failed, Please try again!"}})
            }   
        });
    }

    return (        
        <> 
            <AppHeader2
                title={props.title}
                search={search}
                setSearch={setSearch}
                triggerSearch={triggerSearch}
                setShowForm={setShowForm}
            />
            
            <Row>
                <Col className="col-12 col-md-4">
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white py-3">Details</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item><b>Ticket #:</b> 1637143751599</ListGroup.Item>
                            <ListGroup.Item><b>Created:</b> 2021-11-17 11:11:11 </ListGroup.Item>
                            <ListGroup.Item><b>Tech:</b> Jaypee Hindang</ListGroup.Item>
                            <ListGroup.Item><b>Status:</b> Open</ListGroup.Item>
                            <ListGroup.Item className="text-center">
                                <Card.Link href="#">Assign</Card.Link>
                                <Card.Link href="#">Edit</Card.Link>
                                <Card.Link href="#">Delete</Card.Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
                <Col className="col-12 col-md-8">
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>Subject</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Date: 2021-11-17 08:08</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Name at name@email.com</Card.Subtitle>
                            <Card.Text className="pt-3">
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                            </Card.Text>                            
                        </Card.Body>
                    </Card>
                    <Card className="mt-2 shadow">
                        <Card.Body>                            
                            <Card.Subtitle className="mb-2 text-muted">Date: 2021-11-17 08:08</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Name at name@email.com</Card.Subtitle>
                            <Card.Text className="pt-3">
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                            </Card.Text>                            
                        </Card.Body>
                    </Card>
                    <Card className="mt-2 shadow">
                        <Card.Header>Post Reply</Card.Header>
                        <Card.Body>                                                   
                            <Card.Text>
                                <Form.Group >
                                    <Form.Control
                                        as="textarea"
                                        name="reply"
                                        //value={props.form.message}
                                        //onChange={props.triggerInputChange}
                                        style={{ height: '80px' }}
                                        required
                                    />                                       
                                </Form.Group>
                            </Card.Text>                            
                        </Card.Body>
                        <Card.Footer className="text-center"> 
                            <Button type="submit" size="sm" form="frmMyForm" variant="primary"  >
                                <FaCheck /> Save 
                            </Button> 
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/*components */}
            <MyForm
                title={props.title}
                form={form}
                showForm={showForm} 
                triggerInputChange={triggerInputChange}
                showMessage={showMessage}
                triggerSave={triggerSave}
                resetForm={resetForm}
            />            

            <AppConfirm title={props.title} triggerConfirmedYes={triggerConfirmedYes} />
            
            <AppModal title={props.title} />
        </>
    )
}

export default ViewTicket;

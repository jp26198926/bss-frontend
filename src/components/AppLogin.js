import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Row, Col, Alert} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AppLogin = props => {
    const navigate = useNavigate();
    const innerRef = useRef(); //to handle autofocus
    const dispatch = useDispatch();
    const showLogin = useSelector(state => state.showLogin);
    const showMessage = useSelector(state => state.showMessage);
    const settings = useSelector(state => state.settings);

    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const { email, password } = loginForm;

    const triggerChange = e => {
        setLoginForm({...loginForm, [e.target.name]: e.target.value });
    }

    const triggerLogin = (e) => {
        e.preventDefault();

        if (email && password) {
            // We will have the POST request here
            axios.post(settings.API_URL + '/User/login ', { email: email, password: password }).then( res => {
                if (!res.data.error) {
                    //clear fields
                    setLoginForm({...loginForm, email: "", password: "" });
                    //save user details to reduces
                    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.result });
                    //show toast message
                    dispatch({
                        type: 'SHOW_TOAST_MESSAGE',
                        payload: {
                            show: true,
                            title: settings.appName,
                            message: "Successfully logged-in!",
                            variant: 'primary'
                        }
                    });

                    //clear error                    
                    dispatch(
                        {
                            type: 'SHOW_MESSAGE',
                            payload: {
                                ...showMessage,
                                show: false,
                                variant: "danger",
                                message: ""
                            }
                        }
                    )
                    
                    //navigate to ticket page
                    navigate('/Ticket');
                }else{ 
                    //showError
                    dispatch(
                        {
                            type: 'SHOW_MESSAGE',
                            payload: {
                                ...showMessage,
                                show: true,
                                variant: "danger",
                                message: res.data.error
                            }
                        }
                    )  
                }
            });
            
        } else {
            dispatch(
                {
                    type: 'SHOW_MESSAGE',
                    payload: {
                        ...showMessage,
                        show: true,
                        variant: "danger",
                        message: "Login Failed!"
                    }
                }
            )    
        }        
    }

    const triggerClose = () => {
        setLoginForm({ ...loginForm, email: "", password: "" }); //clear field
        dispatch({ type: 'SHOW_LOGIN', payload: false }); //hide login window
    }

    return (
        <>            
            <Modal
                show={showLogin}
                onHide={triggerClose}
                onShow={() => {innerRef.current.focus()}}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="bg-primary text-white" >
                    <Modal.Title>Login</Modal.Title>                    
                </Modal.Header>
                
                <Modal.Body>
                    {showMessage.show
                        ? //if true 
                        (<Alert variant={showMessage.variant} > {showMessage.message} </Alert>)
                        : //else
                        null
                    }
                    
                    <Form id="frmLogin" onSubmit={triggerLogin}>
                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm="2">
                                Email
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={triggerChange}
                                    required
                                    ref={innerRef} 
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" >
                            <Form.Label column sm="2">
                                Password
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={triggerChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {/* <Button type="submit" form="frmLogin" variant="dark"  onClick={triggerLogin}> */}
                    <Button type="submit" form="frmLogin" variant="primary" >
                        <FaCheck /> Login
                    </Button>
                    <Button variant="danger" onClick={triggerClose}>
                        <FaTimes /> Close
                    </Button>                    
                </Modal.Footer>
            </Modal>
        </>
  );
}

export default AppLogin

import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { FaSearch, FaPlus } from 'react-icons/fa';

const AppHeader2 = (props) => {
    const dispatch = useDispatch();

    const triggerShowForm = async () => {
        await dispatch({ type: 'SET_IS_EDIT', payload: "" });
        props.setShowForm(true);
    }

    return (
        <>
            <Row className="pt-2 my-2">
                <Col className="col-12 col-md-6 text-center text-md-start">
                    <h1>{props.title}</h1>
                </Col>
                <Col className="col-12 col-md-6">
                    <InputGroup className="m-2 text-end">
                        <Button variant="primary" title="Search Ticket" onClick={() => triggerShowForm()} className="mx-auto me-md-1" >
                            <FaSearch /> Search Ticket
                        </Button>
                    </InputGroup>
                </Col>
            </Row> 
        </>
    )
}

export default AppHeader2

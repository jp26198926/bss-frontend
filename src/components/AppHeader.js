import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { FaSearch, FaPlus } from 'react-icons/fa';

const AppHeader = (props) => {
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
                    <InputGroup className="mt-2">
                        <FormControl
                            placeholder="Search"
                            aria-label="Search"
                            value={props.search}
                            onChange={(e) => props.setSearch(e.target.value)}
                        />
                        <Button variant="outline-primary" title="Search" onClick={props.triggerSearch}  >
                            <FaSearch /> <span className="d-none d-sm-inline-block">Search</span>
                        </Button>
                        <Button variant="primary" title="New Entry" onClick={() => triggerShowForm()} >
                            <FaPlus /> <span className="d-none d-sm-inline-block">New Entry</span>
                        </Button>
                    </InputGroup>
                </Col>
            </Row> 
        </>
    )
}

export default AppHeader

import React,{useState} from 'react';
import { Container, FormControl, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaRegEdit, FaRegClipboard } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.currentUser);

    useState(() => {        
        if (parseInt(Object.entries(currentUser)).length > 0) {
            console.log(Object.entries(currentUser).length);
            navigate('/Ticket');
        }
    }, []);

    return (
        <>
            <Container >
                <div className="mt-5 pt-5 text-center d-flex flex-column justify-content-center ">
                    <h1 className="text-center text-sm-start">
                        Hi,
                        <span className="d-block d-sm-none"></span>
                        how can we help 
                        <span className="d-none ms-2 d-sm-inline-block" > you</span>?
                    </h1>
                    <InputGroup className="mb-3 mt-1 shadow">
                        <FormControl
                            placeholder="Search in Knowledgebase"
                            aria-label="Search in Knowledgebase"
                            aria-describedby=""
                            className="p-3"
                        />
                        <Button variant="primary" className="px-3" >
                            <FaSearch className="me-1" />                 
                            {/* <span className="d-none d-md-inline-block">Search in Knowledgebase</span> */}
                        </Button>
                    </InputGroup>
                </div>

                <div className="text-center">
                    <Button variant="primary" className="py-3 m-1 m-md-2 my-1 col-5 col-sm-3" >
                        <FaRegEdit size={40} className="m-1" />                 
                        <span className="d-block">Submit Ticket</span>
                    </Button>
                    <Button variant="primary" className="py-3 m-1 m-md-2 my-1 col-5 col-sm-3" >
                        <FaRegClipboard size={40} className="m-1" />               
                        <span className="d-block">View Ticket</span>
                    </Button>
                </div>
            </Container>
        </>
    )
}

export default Landing

import React from 'react';
import { Card} from 'react-bootstrap';

const AppCard = (props) => {
    return (
        <>
            <Card className="mt-2 shadow">
                <Card.Header>
                    <Card.Title>{props.subject}</Card.Title>
                    {/* <Card.Link onClick={()=>props.triggerEdit(props.record)}>Edit</Card.Link>
                    <Card.Link onClick={()=>props.triggerConfirm(props.record)}>Delete</Card.Link> */}
                </Card.Header>
                <Card.Body>                                      
                    <Card.Text style={{whiteSpace: "pre-wrap"}} >
                        {props.message}...                    
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}

export default AppCard;

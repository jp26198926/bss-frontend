import React from 'react';
import { Card} from 'react-bootstrap';

const Replies = (props) => {
    return (
        <>
            <Card className="mt-2 shadow">
                <Card.Body>
                    <Card.Text className="mb-0 text-primary">{props.name} <i className="text-muted">- {props.email}</i></Card.Text>
                    <Card.Text className="mb-0 text-muted">Date: {props.createdAt}</Card.Text>
                    <Card.Text className="pt-3" style={{whiteSpace: "pre-wrap"}}>
                        {props.message}                        
                    </Card.Text>                            
                </Card.Body>
            </Card>
        </>
    )
}

export default Replies;

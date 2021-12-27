import React from "react";
import { Card } from "react-bootstrap";

const Replies = (props) => {
  return (
    <>
      <Card className="mt-2 shadow">
        <Card.Header>
          <Card.Text className="mb-0 text-primary">
            <span style={{ textTransform: "capitalize" }}>{props.name}</span>{" "}
            <i className="text-muted">- {props.email}</i>
          </Card.Text>
          <Card.Text className="mb-0 text-muted">
            Date: {props.createdAt}
          </Card.Text>
        </Card.Header>

        <Card.Body>
          <Card.Text className="pt-2" style={{ whiteSpace: "pre-wrap" }}>
            {props.message}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Replies;

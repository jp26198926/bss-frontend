import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import axios from "axios";
import { Button, Col, Row, Card, ListGroup, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";

//components
import Replies from "./Replies";
import AppHeader2 from "../../components/AppHeader2";
import AppModal from "../../components/AppModal";

const ViewTicket = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const API_URL = useSelector((state) => state.settings.API_URL);
  const currentUser = useSelector((state) => state.currentUser);
  const selectedData = useSelector((state) => state.selectedData);
  const [form, setForm] = useState({
    ticketId: id,
    name: currentUser?.name,
    email: currentUser?.email,
    message: "",
  });

  const { ticketId, name, email, message } = form;

  //fetch replies
  const getAllReplies = (ticket) => {
    axios.get(API_URL + "/TicketReply/Ticket/" + ticket).then((result) => {
      dispatch({ type: "SET_TICKET_REPLIES", payload: result.data.result });
    });
  };

  //copy db data to redux upon load
  useEffect(() => {
    //get main data for this page
    axios.get(API_URL + "/Ticket/" + id).then((result) => {
      // setForm({
      //   ...form,
      //   name: result.data.result?.name,
      //   email: result.data.result?.email,
      // });

      dispatch({ type: "SET_DATA_SELECTED", payload: result.data.result });
    });

    getAllReplies(id); //fetch replies

    //get other data
    axios.get(API_URL + "/User").then((result) => {
      dispatch({ type: "SET_DATA_USER", payload: result.data.result });
    });

    axios.get(API_URL + "/TicketCategory").then((result) => {
      dispatch({ type: "SET_TICKET_CATEGORY", payload: result.data.result });
    });

    axios.get(API_URL + "/TicketStatus").then((result) => {
      dispatch({ type: "SET_TICKET_STATUS", payload: result.data.result });
    });
  }, []);

  const triggerInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //save
  const triggerSubmitReply = async (e) => {
    e.preventDefault();

    //check if required field is not empty
    if (ticketId && name && email && message) {
      let response = {};
      console.log(form);
      await axios.post(API_URL + "/TicketReply/", form).then((result) => {
        if (!result.data.error) {
          response = { success: "Successfully added!" };
        } else {
          response = { error: result.data.error };
        }
      });

      if (!response?.error) {
        dispatch({
          type: "SHOW_TOAST_MESSAGE",
          payload: {
            show: true,
            title: props.title,
            message: response.success,
            variant: "primary",
          },
        });
        setForm({ ...form, message: "" }); //reset form
        getAllReplies(id); //fetch all replies
      } else {
        //show Error
        dispatch({
          type: "SHOW_MODAL",
          payload: { show: true, message: response?.error },
        });
      }
    } else {
      //show Error
      dispatch({
        type: "SHOW_MODAL",
        payload: { show: true, message: "Required field cannot be empty!" },
      });
    }
  };

  const showChangeStatus = () => {
    dispatch({
      type: "FORM_TICKET_STATUS",
      payload: {
        ticketId: selectedData?.data?._id,
        show: true,
        value: selectedData?.data?.status?._id,
      },
    });
  };

  const showAssignedTech = () => {
    dispatch({
      type: "FORM_ASSIGNED_TECH",
      payload: {
        ticketId: selectedData?.data?._id,
        show: true,
        value: selectedData?.data?.assignedTech?._id,
      },
    });
  };

  return (
    <>
      <AppHeader2
        title={props.title}
        // search={search}
        // setSearch={setSearch}
        // triggerSearch={triggerSearch}
        // setShowForm={setShowForm}
      />

      <Row>
        <Col className="col-12 col-md-4">
          <Card className="shadow sticky-top">
            <Card.Header className="bg-primary text-white py-3">
              Details
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <b>Ticket #:</b> {selectedData?.data?.ticketNo}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Created:</b> {selectedData?.data?.createdAt}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Category:</b> {selectedData?.data?.category?.name}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Tech:</b> {selectedData?.data?.assignedTech?.name}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Status:</b> {selectedData?.data?.status?.name}{" "}
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                <Card.Link href="#" onClick={showAssignedTech}>
                  Assign
                </Card.Link>
                <Card.Link href="#" onClick={showChangeStatus}>
                  Status
                </Card.Link>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col className="col-12 col-md-8">
          <Card className="shadow">
            <Card.Header>
              <Card.Title> {selectedData?.data?.subject} </Card.Title>
              <Card.Text className="mb-0 text-primary">
                <span style={{ textTransform: "capitalize" }}>
                  {selectedData?.data?.name}
                </span>
                <i className="text-muted">- {selectedData?.data?.email} </i>{" "}
              </Card.Text>
              <Card.Text className="mb-0 text-muted ">
                {new Date(selectedData?.data?.createdAt).toString()}{" "}
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Card.Text className="pt-2" style={{ whiteSpace: "pre-wrap" }}>
                {selectedData?.data?.message}
              </Card.Text>
            </Card.Body>
          </Card>

          {selectedData?.replies &&
            selectedData?.replies.map((reply) => {
              return (
                <Replies
                  createdAt={new Date(reply?.createdAt).toString()}
                  name={reply?.name}
                  email={reply?.email}
                  message={reply?.message}
                  key={reply?._id}
                />
              );
            })}

          {selectedData?.data?.status?.name?.toLowerCase() === "open" ? (
            //if status is open
            <Card className="mt-2 shadow">
              <Card.Header>Post Reply</Card.Header>
              <Card.Body>
                <Form id="frmReply" onSubmit={(e) => triggerSubmitReply(e)}>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={message}
                      onChange={triggerInputChange}
                      style={{ height: "80px" }}
                      required
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button
                  type="submit"
                  size="sm"
                  form="frmReply"
                  variant="primary"
                >
                  <FaCheck /> Submit Reply
                </Button>
              </Card.Footer>
            </Card>
          ) : //else
          null}
        </Col>
      </Row>

      {/*components */}
      {/* <MyForm
                title={props.title}
                //form={form}
                // showForm={showForm} 
                // triggerInputChange={triggerInputChange}
                // showMessage={showMessage}
                // triggerSave={triggerSave}
                // resetForm={resetForm}
            />             */}

      {/* <AppConfirm title={props.title} triggerConfirmedYes={triggerConfirmedYes} /> */}

      <AppModal title={props.title} />
    </>
  );
};

export default ViewTicket;

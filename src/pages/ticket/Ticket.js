import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Row } from "react-bootstrap";
import { FaPen, FaTimes } from "react-icons/fa";

//components
import MyForm from "./MyForm";
import AppHeader from "../../components/AppHeader";
import AppConfirm from "../../components/AppConfirm";
import AppModal from "../../components/AppModal";

const Ticket = (props) => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    status: "",
  });
  const [showMessage, setShowMessage] = useState({
    show: false,
    variant: "danger",
    message: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = useSelector((state) => state.settings.API_URL);
  const currentUser = useSelector((state) => state.currentUser);
  const datas = useSelector((state) => state.datas);
  const showConfirm = useSelector((state) => state.showConfirm);
  const isEdit = useSelector((state) => state.isEdit);

  const { name, email, category, subject, message } = form;

  const resetForm = () => {
    setForm({
      ticketNo: "",
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
      status: "",
    }); //cleared out form field
    setShowForm(false); //hide form
    setShowMessage({ ...showMessage, show: false }); //hide message
  };

  //copy db data to redux upon load
  useEffect(() => {
    //check if there is a login user
    if (Object.keys(currentUser).length === 0){ //if none, goto landing page and show login screen
      navigate('/');
      dispatch({ type: 'SHOW_LOGIN', payload: true });
    }else{
      //get main data for this page
      axios.get(API_URL + "/Ticket/openTicket").then((result) => {
        dispatch({ type: "SET_DATA", payload: result.data.result });
      });

      setForm({
        ...form,
        name: currentUser?.name,
        email: currentUser?.email,
      });
    }

    
  }, []);

  const getAllOpenTicket = () => {
    axios.get(API_URL + "/Ticket/openTicket").then((result) => {
      dispatch({ type: "SET_DATA", payload: result.data.result });
    });
  };

  const triggerSearch = () => {
    axios
      .post(API_URL + "/Ticket/search", { search: search })
      .then((result) => {
        dispatch({ type: "SET_DATA", payload: result.data.result });
      });
  };

  const triggerInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //save
  const triggerSave = async (e) => {
    e.preventDefault();

    //check if required field is not empty
    if (name && email && category && subject && message) {
      let response = {};

      if (isEdit) {
        //update

        await axios.put(API_URL + "/Ticket/" + isEdit, form).then((result) => {
          if (!result.data.error) {
            response = { success: "Successfully modified!" };
          } else {
            response = { error: result.data.error };
          }
        });
      } else {
        //add

        await axios.post(API_URL + "/Ticket/", form).then((result) => {
          if (!result.data.error) {
            response = {
              success: "Successfully added!",
              data: result.data.result,
            };
          } else {
            response = { error: result.data.error };
          }
        });
      }

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
        resetForm(); //reset form
        navigate("/ViewTicket/" + response?.data?._id);
        //getAllOpenTicket(); //re populate the open ticket
      } else {
        //show Error
        setShowMessage({
          ...showMessage,
          show: true,
          variant: "danger",
          message: response?.error,
        });
      }
    } else {
      //show Error
      setShowMessage({
        ...showMessage,
        show: true,
        variant: "danger",
        message: "Required field cannot be empty!",
      });
    }
  };

  //edit
  const triggerEdit = async (record) => {
    await dispatch({ type: "SET_IS_EDIT", payload: record._id });
    setForm({
      ticketNo: record.ticketNo,
      name: record.name,
      email: record.email,
      category: record.category._id,
      subject: record.subject,
      message: record.message,
      status: record.status.name,
    });
    setShowForm(true);
  };

  //confirm delete
  const triggerConfirm = (record) => {
    const customMsg = `Are you sure want to delete this record?`;
    dispatch({
      type: "SHOW_CONFIRM",
      payload: { show: true, data: record, message: customMsg },
    });
  };

  //delete record
  const triggerConfirmedYes = () => {
    const recordId = showConfirm.data._id;

    axios.delete(API_URL + "/Ticket/" + recordId).then((result) => {
      //hide Confirm window
      dispatch({
        type: "SHOW_CONFIRM",
        payload: { show: false, data: {}, message: "" },
      });

      if (!result.data.error) {
        //show success message
        dispatch({
          type: "SHOW_TOAST_MESSAGE",
          payload: {
            show: true,
            title: props.title,
            message: "Successfully deleted!",
            variant: "primary",
          },
        });
        getAllOpenTicket(); //re populate the open ticket
      } else {
        //show Error
        dispatch({
          type: "SHOW_MODAL",
          payload: {
            show: true,
            message: "Deletion failed, Please try again!",
          },
        });
      }
    });
  };

  return (
    <>
      <AppHeader
        title={props.title}
        search={search}
        setSearch={setSearch}
        triggerSearch={triggerSearch}
        setShowForm={setShowForm}
      />

      <Row>
        <Table striped bordered hover responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Ticket No.</th>
              <th>Date</th>
              <th>Name</th>
              <th>Category</th>
              <th>Subject</th>
              <th>Assigned Tech</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {datas && datas.length > 0 ? ( //check if it has a record
              //if true
              datas.map((record, idx) => {
                return (
                  <tr key={record?._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <Link to={`/ViewTicket/${record?._id}`}>
                        {record?.ticketNo}
                      </Link>
                    </td>
                    <td>
                      {record?.createdAt
                        ? record?.createdAt.substring(0, 10)
                        : null}
                    </td>
                    <td>{record?.name}</td>
                    <td>{record?.category?.name}</td>
                    <td>{record?.subject}</td>
                    <td>{record?.assignedTech?.name}</td>
                    <td>{record?.status?.name}</td>
                    <td align="center">
                      <Button
                        size="sm"
                        variant="primary"
                        className="mx-1"
                        onClick={() => triggerEdit(record)}
                      >
                        {" "}
                        <FaPen />{" "}
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        className="mx-1"
                        onClick={() => triggerConfirm(record)}
                      >
                        {" "}
                        <FaTimes />{" "}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              //if false
              <tr>
                <td colSpan="9">No Record</td>
              </tr>
            )}
          </tbody>
        </Table>
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

      <AppConfirm
        title={props.title}
        triggerConfirmedYes={triggerConfirmedYes}
      />

      <AppModal title={props.title} />
    </>
  );
};

export default Ticket;

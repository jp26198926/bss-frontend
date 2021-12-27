import React, { useState } from "react";
import { Container, FormControl, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaRegEdit, FaRegClipboard } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//components
import MyForm from "./ticket/MyForm";
import SearchTicket from "./viewticket/SearchTicket";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const API_URL = useSelector((state) => state.settings.API_URL);
  const isEdit = useSelector((state) => state.isEdit);

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

  const [showSearchTicket, setShowSearchTicket] = useState(false);
  const [searchTicket, setSearchTicket] = useState({
    ticketNo: "",
    email: "",
  });

  const [showMessage, setShowMessage] = useState({
    show: false,
    variant: "danger",
    message: "",
  });

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

    setSearchTicket({
      ticketNo: "",
      email: "",
    }); //cleared out form field
    setShowSearchTicket(false); //hide form
    setShowMessage({ ...showMessage, show: false }); //hide message
  };

  const triggerInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const triggerSearchInputChange = (e) => {
    setSearchTicket({ ...searchTicket, [e.target.name]: e.target.value });
  };

  //search ticket
  const triggerSearchTicket = async (e) => {
    e.preventDefault();

    if (searchTicket.email && searchTicket.ticketNo) {
      axios
        .post(API_URL + "/ticket/viewTicket", searchTicket)
        .then((result) => {
          const ticketId = result?.data?.result[0]?._id;
          if (ticketId) {
            resetForm(); //reset form
            navigate("/ViewTicket/" + ticketId);
          } else {
            setShowMessage({
              ...showMessage,
              show: true,
              variant: "danger",
              message: "Ticket Not Found!",
            });
          }
        });
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
            title: "Basic Support System",
            message: response.success,
            variant: "primary",
          },
        });
        resetForm(); //reset form
        navigate("/ViewTicket/" + response?.data?._id);
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

  const triggerShowForm = async () => {
    await dispatch({ type: "SET_IS_EDIT", payload: "" });
    setShowForm(true);
  };

  const triggerShowSearch = async () => {
    setShowSearchTicket(true);
  };

  const triggerSearch = () => {
    navigate(`/Knowledgebase/${search}`);
  };

  useState(() => {
    //if user is logged in then naviate to Ticket route
    setForm({
      ...form,
      name: currentUser?.name,
      email: currentUser?.email,
    });

    if (parseInt(Object.entries(currentUser)).length > 0) {
      navigate("/Ticket");
    }
  }, []);

  return (
    <>
      <Container>
        <div className="mt-5 pt-5 text-center d-flex flex-column justify-content-center ">
          <h1 className="text-center text-sm-start">
            Hi,
            <span className="d-block d-sm-none"></span>
            how can we help
            <span className="d-none ms-2 d-sm-inline-block"> you</span>?
          </h1>
          <InputGroup className="mb-3 mt-1 shadow">
            <FormControl
              placeholder="Search in Knowledgebase"
              aria-label="Search in Knowledgebase"
              aria-describedby=""
              className="p-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => (e.which === 13 ? triggerSearch() : true)}
            />
            <Button variant="primary" className="px-3" onClick={triggerSearch}>
              <FaSearch className="me-1" />
            </Button>
          </InputGroup>
        </div>

        <div className="text-center">
          <Button
            variant="primary"
            className="py-3 m-1 m-md-2 my-1 col-5 col-sm-3"
            onClick={() => triggerShowForm()}
          >
            <FaRegEdit size={40} className="m-1" />
            <span className="d-block">Submit Ticket</span>
          </Button>
          <Button
            variant="primary"
            className="py-3 m-1 m-md-2 my-1 col-5 col-sm-3"
            onClick={() => triggerShowSearch()}
          >
            <FaRegClipboard size={40} className="m-1" />
            <span className="d-block">View Ticket</span>
          </Button>
        </div>
      </Container>

      {/*components */}
      <MyForm
        title="Create New Ticket"
        form={form}
        showForm={showForm}
        triggerInputChange={triggerInputChange}
        showMessage={showMessage}
        triggerSave={triggerSave}
        resetForm={resetForm}
      />

      <SearchTicket
        title="Search Ticket"
        form={searchTicket}
        showForm={showSearchTicket}
        triggerSearchInputChange={triggerSearchInputChange}
        showMessage={showMessage}
        triggerSearchTicket={triggerSearchTicket}
        resetForm={resetForm}
      />
    </>
  );
};

export default Landing;

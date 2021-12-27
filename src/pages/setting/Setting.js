import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Table, Button, Row } from "react-bootstrap";
import { FaPen, FaTimes } from "react-icons/fa";

//components
import MyForm from "./MyForm";
import AppHeader from "../../components/AppHeader";
import AppConfirm from "../../components/AppConfirm";
import AppModal from "../../components/AppModal";

const Setting = (props) => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    value: "",
  });
  const [showMessage, setShowMessage] = useState({
    show: false,
    variant: "danger",
    message: "",
  });

  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  //const settings.API_URL = useSelector(state => state.settings.settings.API_URL);
  const datas = useSelector((state) => state.datas);
  const showConfirm = useSelector((state) => state.showConfirm);
  const isEdit = useSelector((state) => state.isEdit);

  const { name } = form;

  const resetForm = () => {
    setForm({
      name: "",
      value: "",
    }); //cleared out form field
    setShowForm(false); //hide form
    setShowMessage({ ...showMessage, show: false }); //hide message
  };

  const setSettings = (data) => {
    let currentSettings = {};
    data &&
      data.map((record) => {
        return (currentSettings = {
          ...currentSettings,
          [record.name]: record.value,
        });
      });
    return currentSettings;
  };

  const getAllSettings = async () => {
    await axios.get(settings.API_URL + "/Setting").then((response) => {
      //save data to reducer
      dispatch({
        type: "SET_SETTINGS",
        payload: setSettings(response.data.result),
      });
    });
  };

  //copy db data to redux upon load
  useEffect(() => {
    //get main data for this page
    axios.get(settings.API_URL + "/Setting").then((response) => {
      //save data to reducer
      dispatch({
        type: "SET_SETTINGS",
        payload: setSettings(response.data.result),
      });
      dispatch({ type: "SET_DATA", payload: response.data.result });
    });
  }, []);

  const triggerSearch = () => {
    axios
      .post(settings.API_URL + "/Setting/search", { name: search })
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
    if (name) {
      let response = {};

      if (isEdit) {
        //update

        await axios
          .put(settings.API_URL + "/Setting/" + isEdit, form)
          .then((result) => {
            if (!result.data.error) {
              response = { success: "Successfully modified!" };
            } else {
              response = { error: result.data.error };
            }
          });
      } else {
        //add

        await axios
          .post(settings.API_URL + "/Setting/", form)
          .then((result) => {
            if (!result.data.error) {
              response = { success: "Successfully added!" };
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
        getAllSettings(); //update settings in reduces
        triggerSearch(); //re populate the data
        resetForm(); //reset form
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
      name: record.name,
      value: record.value,
    });
    setShowForm(true);
  };

  //confirm delete
  const triggerConfirm = (record) => {
    const customMsg = `Are you sure want to delete this record: ${record?.name}?`;
    dispatch({
      type: "SHOW_CONFIRM",
      payload: { show: true, data: record, message: customMsg },
    });
  };

  //delete record
  const triggerConfirmedYes = () => {
    const recordId = showConfirm.data._id;

    axios.delete(settings.API_URL + "/Setting/" + recordId).then((result) => {
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
        getAllSettings(); //update settings in reducer
        triggerSearch(); //re populate the data
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
              <th>Name</th>
              <th>Value</th>
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
                    <td>{record?.name}</td>
                    <td>{record?.value}</td>
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
                <td colSpan="4">No Record</td>
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

export default Setting;

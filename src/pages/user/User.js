import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Table, Button, Row } from 'react-bootstrap';
import {  FaPen, FaTimes, FaExchangeAlt } from 'react-icons/fa';

//components
import MyForm from './MyForm';
import PasswordForm from './PasswordForm';
import AppHeader from '../../components/AppHeader';
import AppConfirm from '../../components/AppConfirm';
import AppModal from '../../components/AppModal';

const User = props => {
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [form, setForm] = useState(
        {
            name: "",
            email: "",
            password: "",
            repassword: "",
            role: "",
            status: ""
        }
    );
    const [showMessage, setShowMessage] = useState({ show: false, variant: "danger", message: "" });
    
    const dispatch = useDispatch();
    const API_URL = useSelector(state => state.settings.API_URL);
    const datas = useSelector(state => state.datas);
    const showConfirm = useSelector(state => state.showConfirm);
    const isEdit = useSelector(state => state.isEdit);

    const { name, email, password, repassword, role, status } = form;

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            password: "",
            repassword: "",
            role: "",
            status: ""
        }); //cleared out form field
        setShowForm(false); //hide form
        setShowPasswordForm(false); //hide password form
        setShowMessage({ ...showMessage, show: false }); //hide message
    }

    //copy db data to redux upon load
    useEffect(() => {
        //get main data for this page
        axios.get(API_URL + '/User').then(result => {            
            dispatch({ type: 'SET_DATA', payload: result.data.result });
        });

        //get other data
        axios.get(API_URL + '/Role').then(result => {            
            dispatch({ type: 'SET_DATA_ROLE', payload: result.data.result });
        });

        axios.get(API_URL + '/Status').then(result => {
            dispatch({ type: 'SET_DATA_STATUS', payload: result.data.result });
        });
    }, []);

    const triggerSearch = () => {        
        axios.post(API_URL + '/User/search', { name: search }).then(result => {           
            dispatch({ type: 'SET_DATA', payload: result.data.result });
        });        
    }

    const triggerInputChange = e => {
        setForm({...form, [e.target.name]: e.target.value });
    }

    //save
    const triggerSave = async (e) => {
        e.preventDefault();
        
        //check if required field is not empty        
        if (name && email && role && status) {
            
            let response = {};
            
            if (isEdit) { //update

                await axios.put(API_URL + '/User/' + isEdit, form).then(result => {
                    if (!result.data.error) {
                        response = { success: "Successfully modified!" };
                    } else {
                        response = { error: result.data.error };
                    }  
                });                
                
            } else { //add

                //check password & repassword if not empty
                if (password && repassword) {
                    if (password === repassword) { //compare, if both  are equal
                        await axios.post(API_URL + '/User/', form).then(result => {
                            if (!result.data.error) {
                                response = { success: "Successfully added!" };
                            } else {
                                response = { error: result.data.error };
                            }                            
                        });                        
                    } else {
                        response = { error: "Password doesn't match!" };                       
                    }
                } else {
                    response = { error: "Required field cannot be empty!" };  
                }                
            }  
            
            if (!response?.error) {
                dispatch({
                    type: 'SHOW_TOAST_MESSAGE',
                    payload: {
                        show: true,
                        title: props.title,
                        message: response.success,
                        variant: 'primary'
                    }
                });
                triggerSearch(); //re populate the data        
                resetForm(); //reset form
            } else {
                //show Error
                setShowMessage({ ...showMessage, show: true, variant: "danger", message: response?.error });
            }  
        } else {
            //show Error
            setShowMessage({ ...showMessage, show: true, variant: "danger", message: "Required field cannot be empty!" });
        }        
    }

    //edit
    const triggerEdit = async (record) => {
        await dispatch({ type: 'SET_IS_EDIT', payload: record._id});
        setForm({
            name: record.name,
            email: record.email,
            role: record.role._id,
            status: record.status._id
        });
        setShowForm(true);
    }

    //confirm delete
    const triggerConfirm = record => {        
        const customMsg = `Are you sure want to delete this record?`;
        dispatch({ type: 'SHOW_CONFIRM', payload: { show: true, data: record, message: customMsg } });
    }

    //delete record
    const triggerConfirmedYes = () => {
        
        const recordId = showConfirm.data._id;
        
        axios.delete(API_URL + '/User/' + recordId).then(result => {
            
            //hide Confirm window
            dispatch({ type: 'SHOW_CONFIRM', payload: { show: false, data: {}, message: "" } });
            
            if (!result.data.error) {
                //show success message
                dispatch({
                    type: 'SHOW_TOAST_MESSAGE',
                    payload: {
                        show: true,
                        title: props.title,
                        message: 'Successfully deleted!',
                        variant: 'primary'
                    }
                });
                triggerSearch(); //re populate the data  
            } else {
                //show Error
                dispatch({type: 'SHOW_MODAL', payload: {show:true, message: "Deletion failed, Please try again!"}})
            }   
        });
    }

    //changepass
    const triggerChangePassword = async (record) => {        
        await dispatch({ type: 'SET_IS_EDIT', payload: record._id});
        setForm({
            password: "",
            repassword: "",
        });
        setShowPasswordForm(true);
    }

    //save password
    const triggerSavePassword = async (e) => {
        e.preventDefault();

        //check if required field is not empty        
        if (password && repassword) {            
            let response = {};
            
            if (isEdit) { //update
                //compare pass and repass
                if (password === repassword) {
                    await axios.put(API_URL + '/User/changepass/' + isEdit, form).then(result => {
                        if (!result.data.error) {
                            response = { success: "Password successfully changed!" };
                        } else {
                            response = { error: result.data.error };
                        }  
                    }); 
                } else {
                    response = { error: "Password does not match!" };
                }                
            } else {
                response = { error: "Critical Error Encountered!"};
            }
            
            if (!response?.error) {
                dispatch({
                    type: 'SHOW_TOAST_MESSAGE',
                    payload: {
                        show: true,
                        title: props.title,
                        message: response.success,
                        variant: 'primary'
                    }
                });                      
                resetForm(); //reset form
            } else {
                //show Error
                setShowMessage({ ...showMessage, show: true, variant: "danger", message: response?.error });
            }  
        } else {
            //show Error
            setShowMessage({ ...showMessage, show: true, variant: "danger", message: "Required field cannot be empty!" });
        }        
    }


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
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {   
                            datas && datas.length > 0 //check if it has a record
                                ? //if true
                                (
                                    datas.map((record,idx) => {                                        
                                        return (
                                            <tr key={record?._id}>
                                                <td>{idx + 1}</td>
                                                <td>{record?.name}</td>
                                                <td>{record?.email}</td>
                                                <td>{record?.role?.name}</td>
                                                <td>{record?.status?.name}</td>
                                                <td align="center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        className="mx-1"
                                                        onClick={()=>triggerChangePassword(record)}
                                                    > <FaExchangeAlt /> </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="mx-1"
                                                        onClick={()=>triggerEdit(record)}
                                                    > <FaPen /> </Button>
                                                    
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="mx-1"
                                                        onClick={()=>triggerConfirm(record)}
                                                    > <FaTimes /> </Button>

                                                </td>  
                                            </tr>
                                        )
                                    })
                                )
                                : //if false
                                (
                                    <tr><td colSpan="6">No Record</td></tr>
                                )                           
                        }                                                                   
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

            <PasswordForm                
                form={form}
                showPasswordForm={showPasswordForm} 
                triggerInputChange={triggerInputChange}
                showMessage={showMessage}
                triggerSavePassword={triggerSavePassword}
                resetForm={resetForm}
            />

            <AppConfirm title={props.title} triggerConfirmedYes={triggerConfirmedYes} />
            
            <AppModal title={props.title} />
        </>
    )
}

export default User;

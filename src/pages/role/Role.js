import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Row } from 'react-bootstrap';
import {  FaPen, FaTimes } from 'react-icons/fa';

//components
import MyForm from './MyForm';
import AppHeader from '../../components/AppHeader';
import AppConfirm from '../../components/AppConfirm';
import AppModal from '../../components/AppModal';

const Role = props => {
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({name: ""})
    const [showMessage, setShowMessage] = useState({ show: false, variant: "danger", message: "" });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.currentUser);
    const API_URL = useSelector(state => state.settings.API_URL);
    const datas = useSelector(state => state.datas);
    const showConfirm = useSelector(state => state.showConfirm);
    const isEdit = useSelector(state => state.isEdit);

    const { name } = form;

    const resetForm = () => {
        setForm({ name: "" }); //cleared out form field
        setShowForm(false); //hide form
        setShowMessage({ ...showMessage, show: false }); //hide message
    }

    //copy db data to redux upon load
    useEffect(() => {    
        //check if there is a login user
        if (Object.keys(currentUser).length === 0){ //if none, goto landing page and show login screen
            navigate('/');
            dispatch({ type: 'SHOW_LOGIN', payload: true });
        }else{
            axios.get(API_URL + '/Role').then(result => {
                dispatch({ type: 'SET_DATA', payload: result.data.result });
            });
        }
       
    }, []);

    const triggerSearch = () => {        
        axios.post(API_URL + '/Role/search', { name: search }).then(result => {           
            dispatch({ type: 'SET_DATA', payload: result.data.result });
        });
    }

    const triggerInputChange = e => {
        setForm({ [e.target.name]: e.target.value });
    }

    //save
    const triggerSave = async () => {
        //check if required field is not empty
        if (name) {
            let response = {};
            let msg = "";        

            if (isEdit) { //modify
                await axios.put(API_URL + '/Role/' + isEdit, form).then(result => response = result);
                msg = "Successfully modified!";
            } else { //new Entry
                await axios.post(API_URL + '/Role/', form).then(result => response = result);
                msg = "Successfully added";
            }
            
            if (!response?.data.error) {
                dispatch({ type: 'SHOW_TOAST_MESSAGE', payload: { show: true, title: props.title, message: msg, variant: 'primary' } });
                triggerSearch(); //re populate the data        
                resetForm(); //reset form
            } else {
                //show Error
                setShowMessage({ ...showMessage, show: true, variant: "danger", message: response?.data.error });
            }  
        } else {
            //show Error
            setShowMessage({ ...showMessage, show: true, variant: "danger", message: "Required field cannot be empty!" });
        }        
    }

    //edit
    const triggerEdit = async (record) => {
        await dispatch({ type: 'SET_IS_EDIT', payload: record._id});
        setForm(record);
        setShowForm(true);
    }

    //confirm delete
    const triggerConfirm = record => {        
        const customMsg = `Are you sure want to delete this record: ${record.name}?`;
        dispatch({ type: 'SHOW_CONFIRM', payload: { show: true, data: record, message: customMsg } });
    }

    //delete record
    const triggerConfirmedYes = () => {
        
        const recordId = showConfirm.data._id;
        
        axios.delete(API_URL + '/Role/' + recordId).then(result => {
            
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {   
                            datas.length > 0 //check if it has a record
                                ? //if true
                                (
                                    datas.map((record,idx) => {                                        
                                        return (
                                            <tr key={record._id}>
                                                <td>{idx+1}</td>
                                                <td>{record.name}</td>
                                                <td align="center">
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
                                    <tr><td colSpan="3">No Record</td></tr>
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

            <AppConfirm title={props.title} triggerConfirmedYes={triggerConfirmedYes} />
            
            <AppModal title={props.title} />
        </>
    )
}

export default Role

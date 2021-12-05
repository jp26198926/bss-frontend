import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Row } from 'react-bootstrap';
import {  FaPen, FaTimes} from 'react-icons/fa';

//components
import MyForm from './MyForm';
import AppCard from './AppCard';
import AppHeader from '../../components/AppHeader';
import AppConfirm from '../../components/AppConfirm';
import AppModal from '../../components/AppModal';

const Knowledgebase = props => {
    const currentUser = useSelector(state => state.currentUser);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);    
    const [form, setForm] = useState(
        {           
            subject: "",
            message: "",
            createdBy: currentUser?._id
        }
    );
    const [showMessage, setShowMessage] = useState({ show: false, variant: "danger", message: "" });
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const API_URL = useSelector(state => state.settings.API_URL);
    const datas = useSelector(state => state.datas);
    const showConfirm = useSelector(state => state.showConfirm);
    const isEdit = useSelector(state => state.isEdit);

    const { subject, message, createdBy } = form;

    const resetForm = () => {
        setForm({            
            subject: "",
            message: "",
            createdBy: currentUser?._id
        }); //cleared out form field
        setShowForm(false); //hide form        
        setShowMessage({ ...showMessage, show: false }); //hide message
    }

    //copy db data to redux upon load
    useEffect(() => {        
        //clear forms
        resetForm();

        //get main data for this page
        getAllRecord();
        
    }, []);

    const getAllRecord = () => {
        axios.get(API_URL + '/Knowledgebase').then(result => {           
            dispatch({ type: 'SET_DATA', payload: result.data.result });
        }); 
    }

    const triggerSearch = () => {        
        axios.get(API_URL + '/Knowledgebase/search/'+ search).then(result => {           
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
        if (subject && message) {
            
            let response = {};
            
            if (isEdit) { //update

                await axios.put(API_URL + '/Knowledgebase/' + isEdit, form).then(result => {
                    if (!result.data.error) {
                        response = { success: "Successfully modified!" };
                    } else {
                        response = { error: result.data.error };
                    }  
                });                
                
            } else { //add                
                await axios.post(API_URL + '/Knowledgebase/', form).then(result => {
                    if (!result.data.error) {
                        response = { success: "Successfully added!", data: result.data.result };
                    } else {
                        response = { error: result.data.error };
                    }                            
                });                
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
                //navigate('/Knowledgebase/' + response?.data?._id);
                getAllRecord(); //re populate all record
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
            subject: record.subject,
            message: record.message,
            createdBy: record.createdBy.name
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
        
        axios.delete(API_URL + '/Knowledgebase/' + recordId).then(result => {
            
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
                getAllRecord(); //re populate the open ticket  
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

                {
                    datas && datas.length > 0 //check if it has a record
                        ? //if true
                        (
                            datas.map((record) => {                                        
                                return (
                                    <AppCard
                                        subject={record?.subject}
                                        message={record?.message}
                                        key={record?._id}
                                        record={record}
                                        triggerEdit={triggerEdit}
                                        triggerDelete={triggerConfirmedYes}
                                    />
                                )
                            })
                        )
                        : //if false
                        (
                            "No Record Found"
                        ) 
                }
                
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

export default Knowledgebase;

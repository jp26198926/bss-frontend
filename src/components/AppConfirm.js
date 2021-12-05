import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';


const AppConfirm = props => {
    const dispatch = useDispatch();
    const showConfirm = useSelector(state => state.showConfirm);

    const triggerClose = () => {
        dispatch({ type: 'SHOW_CONFIRM', payload: { ...showConfirm, show: false, data: {}, message: ""} });
    }

    return (
        <>
            <Modal
                show={showConfirm?.show}
                onHide={() => triggerClose()}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="bg-primary text-white" >
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center">
                    {showConfirm?.message}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={()=>props.triggerConfirmedYes()}>
                        <FaCheck /> Yes
                    </Button> 
                    <Button variant="danger" onClick={() => triggerClose()} >
                        <FaTimes /> Cancel
                    </Button>                   
                </Modal.Footer>
            </Modal>
        </>
  );
}

export default AppConfirm

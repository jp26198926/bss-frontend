import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

const AppModal = props => {
    const dispatch = useDispatch();
    const showModal = useSelector(state => state.showModal);

    const triggerClose = () => {
        dispatch({ type: 'SHOW_MODAL', payload: { ...showModal, show: false, message: ""} });
    }

    return (
        <>
            <Modal
                show={showModal?.show}
                onHide={() => triggerClose()}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="bg-primary text-white" >
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showModal?.message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={()=> triggerClose()}>
                        <FaTimes /> Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
  );
}

export default AppModal

import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, Toast} from 'react-bootstrap';

const AppToast = props => {
    const dispatch = useDispatch();
    const showToast = useSelector(state => state.showToast);
    
    const triggerHide = () => {
        dispatch(
            {
                type: 'SHOW_TOAST_MESSAGE',
                payload: {...showToast, show: false}
            }
        )        
    }

    return (
        <>
            <ToastContainer position="bottom-start" className="p-3 position-fixed">
                <Toast
                    bg={showToast?.variant}
                    show={showToast?.show}
                    onClose={triggerHide}
                    delay={10000}
                    autohide
                >
                    <Toast.Header>                   
                        <strong className="me-auto">{showToast?.title}</strong>
                    </Toast.Header>
                    <Toast.Body className={showToast?.variant?.toLowerCase() === 'primary' && 'text-white'}>
                        {showToast?.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}

export default AppToast

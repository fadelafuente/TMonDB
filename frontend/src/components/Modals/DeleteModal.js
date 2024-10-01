import { Modal, InputGroup, Alert } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsExclamationCircle, BsEyeFill, BsEyeSlash } from "react-icons/bs";
import { useFormData, usePassword, useTimedAlert } from "../../hooks/hooks";
import { deleteUser, logout } from "../../actions/auth";
import { connect } from "react-redux";
import { useState } from "react";

import "../../assets/styling/Modal.css";

function DeleteModal({show, setShow}) {
    const initialForm = {
        current_password: ''
    };

    const [formData, setFormData] = useFormData(initialForm);
    const [showPass, setShowPass] = usePassword(false);
    const [showAlert, setShowAlert] = useTimedAlert(false);
    const [message, setMessage] = useState("");
    
    const { current_password } = formData;

    function handleClick(e) {
        e.preventDefault();

        deleteUser(current_password).then((response) => {
            if(response && response.status === 204) {
                logout();
                setShow(false);
                window.location.reload();
            } else {
                if(response && response.data && "current_password" in response.data) {
                    setMessage(`Error: ${response.data["current_password"]}`);
                }
                setShow(false);
                setShowAlert(true);
            }
        });
    }

    return (
        <>
            <Alert show={ showAlert } 
                severity="error" 
                onClose={ () => { setShowAlert(false); setMessage(""); }}
                className="delete-alert"
            >
                <div className="row-gap-container">
                    <div className="interaction-icon error-icon">
                        <BsExclamationCircle />
                    </div>
                    <div>
                        { message ? message : "Failed to delete user." }
                    </div>
                </div>
            </Alert>
            <Modal className="reset-modal" backdrop="static" backdropClassName="modal-backdrop" show={show} centered>
                <Modal.Header>
                    Delete your account?
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={ e => handleClick(e) }>
                        <Form.Group controlId="current-password-input">
                            <InputGroup>
                                <Form.Control
                                    type="password" 
                                    placeholder="password*" 
                                    name="current_password"
                                    value={ current_password }
                                    onChange={ e => setFormData(e) }
                                    required
                                    maxLength={20}
                                />
                                <InputGroup.Text 
                                    onClick={ () => setShowPass("current-password-input") }
                                    id="password-toggle"
                                >
                                    { showPass ? <BsEyeFill /> : <BsEyeSlash /> }
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <div className="top-barrier align-right row-gap-container">
                            <Button className="base-btn" onClick={ e => {setShow(false); setFormData(e, true); } }>Nevermind</Button>
                            <Button 
                                className="base-btn delete-btn" 
                                variant="primary" type="submit"
                            >
                                Delete
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(DeleteModal);
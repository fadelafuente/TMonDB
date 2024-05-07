import { updateDetails } from "../actions/auth";
import React, { useState } from "react";
import { Alert, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { useFormData, useNavigateNotAuth } from "../hooks/hooks";

import "../assets/styling/Modal.css";
import "../assets/styling/forms.css";

function SetUsername({ isAuthenticated, handleEditUsername, handleUsername }) {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useFormData({
        username: ''    
    });
    useNavigateNotAuth(isAuthenticated);

    const { username } = formData;

    function onSubmit(e) {
        e.preventDefault();
        if(username.length < 5) {
            setMessage("The username needs to be atleast 5 characters.");
            setShow(true);
        } else {
            updateDetails({username}).then((response) => {
                let message = "";
                if(response && response.status === 200) {
                    message = "Username successfully updated";
                    setShow(true);
                    handleUsername(response.data["username"]);
                    handleEditUsername(false);
                } else {
                    message = "Username is either invalid or already taken.";
                }

                setMessage(message);
                setShow(true);
            })
        }
    }

    return (
        <>
            <Alert show={ show } variant="warning" dismissible onClose={ () => setShow(false) }>
                { message ? message : "The username is not valid." }
            </Alert>
            <div className="">
                <Form className="form set-username-no-redirect" onSubmit={ e=> { onSubmit(e) } }>
                    <Form.Group controlId="username-input" className="form-group">
                        <Form.Text>Your username can contain uppercase letters, 
                            lowercase letters, numbers, and must be atleast 5 characters.<br/></Form.Text>
                        <InputGroup>
                            <Form.Control
                                type="text" 
                                placeholder="New username" 
                                name="username"
                                value={ username }
                                onChange={ e => setFormData(e) }
                                pattern="[a-zA-Z0-9]*"
                                required
                                maxLength={20}
                            />
                        </InputGroup>
                    </Form.Group>
                    <div className="align-row align-right">
                        <Button className="rounded-btn close-btn modal-btn" onClick={ () => { handleEditUsername(false) } }>
                            Cancel
                        </Button>
                        <Button className="rounded-btn modal-btn" variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(SetUsername);
import { updateDetails } from "../actions/auth";
import React, { useState } from "react";
import { Alert, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { useFormData, useNavigateNotAuth } from "../hooks/hooks";
import { useNavigate } from "react-router-dom";

function SetUsername({ isAuthenticated }) {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useFormData({
        username: ''    
    });
    useNavigateNotAuth(isAuthenticated);
    const navigate = useNavigate();

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
                    navigate("/username/reset/confirm", {state: {username: username}});

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
            <div className="form-container">
                <h2 className="form-title">Create a new Username</h2>
                <Form className="form" onSubmit={ e=> { onSubmit(e) } }>
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
                    <Button variant="primary" type="submit">
                        Change username
                    </Button>
                </Form>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(SetUsername);
import React, { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password_confirm } from "../actions/auth";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ResetPasswordConfirm({ reset_password_confirm }) {
    const { uid, token } = useParams();
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function onSubmit(e) {
        e.preventDefault();

        reset_password_confirm(uid, token, new_password, re_new_password);
        setRequestSent(true);
    }

    if(requestSent) {
        return <Navigate replace to="/login" />
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Enter New Password</h2>
            <Form className="form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Text>
                        Your password must be: <br/>
                        8-20 characters long <br/>
                        have at least 1 uppercase letter <br/>
                        have at least 1 lowercase letter <br/>
                        have at least one special character <br/>
                        <br/>
                    </Form.Text>
                    <Form.Control
                        type="password" 
                        placeholder="New Password"
                        name="new_password"
                        value={ new_password }
                        onChange={ e => handleChange(e) }
                        minLength="8"
                        maxLength="20"
                        required 
                    />
                </Form.Group>
                <br />
                <Form.Group className="mb-3" controlId="formBasicPassword2">
                    <Form.Control
                        type="password" 
                        placeholder="Confirm New Password"
                        name="re_new_password"
                        value={ re_new_password }
                        onChange={ e => handleChange(e) }
                        minLength="8"
                        maxLength="20"
                        required 
                    />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Reset Password
                </Button>
            </Form>
        </div>
    )
}

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);
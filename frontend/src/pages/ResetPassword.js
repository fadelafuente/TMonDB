import { resetPassword } from "../actions/auth";
import { handleChange } from '../functions/handlers';
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { useRequestSent } from "../hooks/hooks";

function ResetPassword({ resetPassword }) {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });
    useRequestSent(requestSent);

    const { email } = formData;

    function onSubmit(e) {
        e.preventDefault();

        resetPassword(email);
        setRequestSent(true);
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Request Password Reset</h2>
            <Form className="form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group controlId="formEmail" className="form-group">
                    <Form.Control
                        type="email" 
                        placeholder="Email" 
                        name="email"
                        value={ email }
                        onChange={ e => handleChange(e, setFormData, formData) }
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Request Reset
                </Button>
            </Form>
        </div>
    )
}

export default connect(null, { resetPassword })(ResetPassword);
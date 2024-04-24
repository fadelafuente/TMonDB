import { setLoginByEmail } from "../actions/auth";
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { useFormData, useRequestSent } from "../hooks/hooks";

function LoginChange({ setLoginByEmail, reset_type="password" }) {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useFormData({
        email: ''
    });
    useRequestSent(requestSent);

    const { email } = formData;

    function onSubmit(e) {
        e.preventDefault();

        setLoginByEmail(email, reset_type);
        setRequestSent(true);
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Request {reset_type} change</h2>
            <Form className="form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group controlId="formEmail" className="form-group">
                    <Form.Control
                        type="email" 
                        placeholder="Email" 
                        name="email"
                        value={ email }
                        onChange={ e => setFormData(e) }
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Request change
                </Button>
            </Form>
        </div>
    )
}

export default connect(null, { setLoginByEmail })(LoginChange);
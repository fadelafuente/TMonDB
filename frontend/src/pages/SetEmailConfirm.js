import { resetLoginConfirm } from "../actions/auth";
import React, { useState } from "react";
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useFormData, useRequestSent } from "../hooks/hooks";

function SetEmailConfirm({ resetLoginConfirm }) {
    const { uid, token } = useParams();
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useFormData({
        new_email: '',
        re_new_email: ''
    });
    useRequestSent(requestSent);

    const { new_email, re_new_email } = formData;

    function onSubmit(e) {
        e.preventDefault();

        resetLoginConfirm(uid, token, formData, "email");
        setRequestSent(true);
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Enter New Email</h2>
            <Form className="form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group controlId="email-input" className="form-group">
                    <InputGroup>
                        <Form.Control
                            type="email" 
                            placeholder="New Email" 
                            name="new_email"
                            value={ new_email }
                            onChange={ e => setFormData(e) }
                            required
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="re-email-input" className="form-group">
                    <InputGroup>
                        <Form.Control 
                            type="email" 
                            placeholder="Confirm New Email" 
                            name="re_new_email"
                            value={ re_new_email }
                            onChange={ e => setFormData(e) }
                            required
                        />
                    </InputGroup>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Set Email
                </Button>
            </Form>
        </div>
    )
}

export default connect(null, { resetLoginConfirm })(SetEmailConfirm);
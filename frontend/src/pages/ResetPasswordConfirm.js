import { resetLoginConfirm } from "../actions/auth";
import React, { useState } from "react";
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEyeSlash, BsEyeFill } from 'react-icons/bs';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useFormData, usePassword, useRequestSent } from "../hooks/hooks";

function ResetPasswordConfirm({ resetLoginConfirm }) {
    const { uid, token } = useParams();
    const [requestSent, setRequestSent] = useState(false);
    const [showPass, setShowPass] = usePassword(false);
    const [showPassRe, setShowPassRe] = usePassword(false);
    const [formData, setFormData] = useFormData({
        new_password: '',
        re_new_password: ''
    });
    useRequestSent(requestSent);

    const { new_password, re_new_password } = formData;

    function onSubmit(e) {
        e.preventDefault();

        resetLoginConfirm(uid, token, formData);
        setRequestSent(true);
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Enter New Password</h2>
            <Form className="form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group controlId="password-input" className="form-group">
                    <Form.Text>Your password must have: <br/></Form.Text>
                    <Form.Text id="lowercase" className="invalid">at least 1 lowercase letter <br/></Form.Text>
                    <Form.Text id="uppercase" className="invalid">at least 1 uppercase letter <br/></Form.Text>
                    <Form.Text id="number" className="invalid">at least 1 number <br/></Form.Text>
                    <Form.Text id="special" className="invalid">at least one special character <br/></Form.Text>
                    <Form.Text id="length" className="invalid">between 8-20 characters <br/></Form.Text>
                    <InputGroup>
                        <Form.Control
                            type="password" 
                            placeholder="New Password" 
                            name="new_password"
                            value={ new_password }
                            onChange={ e => setFormData(e) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => setShowPass("password-input") }
                            id="password-toggle"
                        >
                            { showPass ? <BsEyeFill /> : <BsEyeSlash /> }
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="re-password-input" className="form-group">
                    <InputGroup>
                        <Form.Control 
                            type="password" 
                            placeholder="Confirm New Password" 
                            name="re_new_password"
                            value={ re_new_password }
                            onChange={ e => setFormData(e) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => setShowPassRe("re-password-input") }
                            id="password-toggle"
                        >
                            { showPassRe ? <BsEyeFill /> : <BsEyeSlash /> }
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Reset Password
                </Button>
            </Form>
        </div>
    )
}

export default connect(null, { resetLoginConfirm })(ResetPasswordConfirm);
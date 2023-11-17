import { reset_password_confirm } from "../actions/auth";
import { handleValidation } from "../functions/helpers";
import React, { useState } from "react";
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEye, BsEyeSlashFill } from 'react-icons/bs';
import { connect } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

function ResetPasswordConfirm({ reset_password_confirm }) {
    const { uid, token } = useParams();
    const [requestSent, setRequestSent] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showPassRe, setShowPassRe] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    function handleShowPass(id) {
        const password_input = document.querySelector(id);
        let type = "";
        if(id === "#password-input") {
            setShowPass((prev) => !prev);
            type = showPass ? "password" : "text";
        } else {
            setShowPassRe((prev) => !prev);
            type = showPassRe ? "password" : "text";
        }
        password_input.setAttribute("type", type);
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if(e.target.name === "new_password") 
            handleValidation(e.target.value);
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
                            onChange={ e => handleChange(e) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => handleShowPass("#password-input") }
                            id="password-toggle"
                        >
                            { showPass ? <BsEyeSlashFill /> : <BsEye /> }
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="password-input-re" className="form-group">
                    <InputGroup>
                        <Form.Control 
                            type="password" 
                            placeholder="Confirm New Password" 
                            name="re_new_password"
                            value={ re_new_password }
                            onChange={ e => handleChange(e) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => handleShowPass("#password-input-re") }
                            id="password-toggle"
                        >
                            { showPassRe ? <BsEyeSlashFill /> : <BsEye /> }
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

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);
import { register } from '../actions/auth';
import { React, useState } from "react";
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEye, BsEyeSlashFill } from 'react-icons/bs';
import { connect } from 'react-redux';
import { Navigate, Link } from "react-router-dom";

import '../assets/styling/forms.css';

function Register({ register, isAuthenticated }) {
    const [accountCreated, setAccountCreated] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showPassRe, setShowPassRe] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: ''
    });

    const { first_name, last_name, email, password, re_password } = formData;

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
    }

    function onSubmit(e) {
        e.preventDefault();

        if(password === re_password) {
            register(first_name, last_name, email, password, re_password);
            setAccountCreated(true);
        }
    }

    if(isAuthenticated) {
        return <Navigate replace to="/trending" />
    }
    if(accountCreated) {
        return <Navigate replace to="/login" />
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Create a New Account</h2>
            <Form className="Form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group className="form-group">
                    <Form.Control 
                        type="text" 
                        placeholder="First Name*" 
                        name="first_name"
                        value={ first_name }
                        onChange={ e => handleChange(e) }
                    />
                </Form.Group>
                <Form.Group className="form-group">
                    <Form.Control 
                        type="text" 
                        placeholder="Last Name*" 
                        name="last_name"
                        value={ last_name }
                        onChange={ e => handleChange(e) }
                    />
                </Form.Group>
                <Form.Group controlId="formBasicEmail" className="form-group">
                    <Form.Control 
                        type="email" 
                        placeholder="Email*" 
                        name="email"
                        value={ email }
                        onChange={ e => handleChange(e) }
                        required
                    />
                    <Form.Text>
                        We will never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="password-input" className="form-group">
                    <Form.Text>
                        Your password must be: <br/>
                        8-20 characters long <br/>
                        have at least 1 uppercase letter <br/>
                        have at least 1 lowercase letter <br/>
                        have at least one special character <br/>
                    </Form.Text>
                    <InputGroup>
                        <Form.Control
                            type="password" 
                            placeholder="Password*" 
                            name="password"
                            value={ password }
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
                            placeholder="Repeat Password*" 
                            name="re_password"
                            value={ re_password }
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
                    Submit
                </Button>
                <Form.Text>
                    Already have an account? <Link to="/login">Login here</Link>
                </Form.Text>
            </Form>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(Register);
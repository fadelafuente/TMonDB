import { register, register_attempt } from '../actions/auth';
import { handleShowPass, handleChange, handleChangeAndValidation, handleClose } from '../functions/handlers';
import { React, useEffect, useState, useCallback } from "react";
import { InputGroup, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEyeSlash, BsEyeFill } from 'react-icons/bs';
import { connect } from 'react-redux';
import { Navigate, Link, useNavigate } from "react-router-dom";

import '../assets/styling/forms.css';

function Register({ register, isAuthenticated, errMessage, register_attempt, accountCreated }) {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showPassRe, setShowPassRe] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: ''
    });

    const { first_name, last_name, email, password, re_password } = formData;

    const errorMessageCallback = useCallback(() => {
        if(errMessage && 'email' in errMessage) {
            const err_message = errMessage['email'][0];
            setMessage(err_message);
        } else {
            setMessage('');   
        }
    }, [errMessage]);

    useEffect(() => {
        if(errMessage && !isAuthenticated) {
            setShow(true);
            errorMessageCallback();
        }
    }, [errMessage, isAuthenticated, errorMessageCallback]);

    useEffect(() => {
        // if register is successful, reset accountCreated in redux store before redirecting
        if(accountCreated && !errMessage) {
            register_attempt();
            navigate("/verify", { state: { email: email } });
        }
        // eslint-disable-next-line
    }, [accountCreated, errMessage, email, register_attempt]);

    function onSubmit(e) {
        e.preventDefault();

        if(password === re_password) {
            register(first_name, last_name, email, password, re_password);
        }  
    }

    if(isAuthenticated) {
        return <Navigate replace to="/trending" />
    }

    return (
        <div className="form-container">
            <Modal
                backdrop="static"
                keyboard={ false }
                show={ show }
                onHide={ () => handleClose(register_attempt, setShow) }
                id="error-modal"
            >
                <Modal.Header closeButton closeVariant="white">
                <Modal.Title>Invalid Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { message ? <p>{ message }</p> : <p>Either the email or password is incorrect.</p> }
                </Modal.Body>
            </Modal>
            <h2 className="form-title">Create a New Account</h2>
            <Form className="Form" onSubmit={ e => onSubmit(e) }>
                <Form.Group className="form-group">
                    <Form.Control 
                        type="text" 
                        placeholder="First Name*" 
                        name="first_name"
                        value={ first_name }
                        onChange={ e => handleChange(e, setFormData, formData) }
                    />
                </Form.Group>
                <Form.Group className="form-group">
                    <Form.Control 
                        type="text" 
                        placeholder="Last Name*" 
                        name="last_name"
                        value={ last_name }
                        onChange={ e => handleChange(e, setFormData, formData) }
                    />
                </Form.Group>
                <Form.Group controlId="formBasicEmail" className="form-group">
                    <Form.Control 
                        type="email" 
                        placeholder="Email*" 
                        name="email"
                        value={ email }
                        onChange={ e => handleChange(e, setFormData, formData) }
                        required
                    />
                    <Form.Text>
                        We will never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
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
                            placeholder="Password*" 
                            name="password"
                            value={ password }
                            onChange={ e => handleChangeAndValidation(e, setFormData, formData) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => handleShowPass("#password-input", setShowPass, showPass) }
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
                            placeholder="Repeat Password*" 
                            name="re_password"
                            value={ re_password }
                            onChange={ e => handleChange(e, setFormData, formData) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => handleShowPass("#re-password-input", setShowPassRe, showPassRe) }
                            id="password-toggle"
                        >
                            { showPassRe ? <BsEyeFill /> : <BsEyeSlash /> }
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
    isAuthenticated: state.auth.isAuthenticated,
    errMessage: state.auth.errMessage,
    accountCreated: state.auth.accountCreated
});

export default connect(mapStateToProps, { register, register_attempt })(Register);
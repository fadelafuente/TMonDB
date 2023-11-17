import { login, attempt_login_again } from '../actions/auth';
import axios from "axios";
import { React, useEffect, useState } from "react";
import { InputGroup, Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEye, BsEyeSlashFill } from 'react-icons/bs';
import { connect } from 'react-redux';
import { Link, Navigate } from "react-router-dom";

import "../assets/styling/App.css";
import '../assets/styling/forms.css';

axios.defaults.withCredentials = true;

function Login({ login, isAuthenticated, loginFailed, attempt_login_again }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [show, setShow] = useState(false);
    const { email, password } = formData;
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        handleShow();
    }, [handleShow]);

    function onSubmit(e) {
        e.preventDefault();

        login(email, password);
    }

    async function handleGoogleAuth(e) {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=http://localhost:3000/google-oauth`);

            window.location.replace(res.data.authorization_url)
        } catch(err) {

        }
    }

    async function handleFacebookAuth(e) {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=http://localhost:3000/facebook-oauth`);

            window.location.replace(res.data.authorization_url)
        } catch(err) {

        }
    }

    function handleShow() {
        if(loginFailed && !isAuthenticated) {
            setShow(true);
        }
    }

    function handleClose() {
        attempt_login_again();
        setShow(false);
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleShowPass() {
        setShowPass((prev) => !prev);
        const password_input = document.querySelector("#login-password");
        const type = showPass ? "password" : "text";
        password_input.setAttribute("type", type);
    }

    if(isAuthenticated) {
        return <Navigate replace to="/trending" />
    }

    return (
        <div className="form-container">
            <Modal
                backdrop="static"
                keyboard={false}
                show={ show }
                onHide={ handleClose }
                id="error-modal"
            >
                <Modal.Header closeButton closeVariant="white">
                <Modal.Title>Invalid Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Either the email or password is incorrect.
                </Modal.Body>
            </Modal>
            <h2 className="form-title">Login</h2>
            <Form className="form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group controlId="formEmail" className="form-group">
                    <Form.Control
                        type="email" 
                        placeholder="Email" 
                        name="email"
                        value={ email }
                        onChange={ e => handleChange(e) }
                        required
                    />
                </Form.Group>
                <Form.Group controlId="login-password" className="form-group">
                    <InputGroup>
                        <Form.Control
                            type="password" 
                            placeholder="Password"
                            name="password"
                            value={ password }
                            onChange={ e => handleChange(e) }
                            minLength="8"
                            required 
                        />
                        <InputGroup.Text 
                            onClick={ () => handleShowPass() }
                            id="password-toggle"
                        >
                        { showPass ? <BsEyeSlashFill /> : <BsEye /> }
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                <Form.Text>
                    Don't have an account? <Link to="/register">register here</Link>
                </Form.Text>
                <Form.Text>
                    Forgot password? <Link to="/reset_password">reset password here</Link>
                </Form.Text>
                <hr className="break-line" />
                <Form.Text className="or-social-auth">
                    OR
                </Form.Text>
            </Form>
            <div className="google-oauth-container">
                <Button 
                    className="google-button social-button"
                    type="submit"
                    onClick={ e => handleGoogleAuth(e) }
                >
                    Login with Google
                </Button>
                <Button 
                    className="facebook-button social-button"
                    type="submit"
                    onClick={ e => handleFacebookAuth(e) }
                >
                    Login with Facebook
                </Button>
            </div>
        </div>
    )
}

    const mapStateToProps = state => ({
        isAuthenticated: state.auth.isAuthenticated,
        loginFailed: state.auth.loginFailed
    });

export default connect(mapStateToProps, { login, attempt_login_again })(Login);
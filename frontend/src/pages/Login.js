import { login, loginAttempt } from '../actions/auth';
import { handleShowPass, handleChange, handleSocialAuth, handleClose } from '../functions/handlers';
import { React, useState } from "react";
import { InputGroup, Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEyeSlash, BsEyeFill } from 'react-icons/bs';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { useNavigateOnAuth, useLoginFailed } from '../hooks/hooks';

import "../assets/styling/App.css";
import '../assets/styling/forms.css';

function Login({ login, isAuthenticated, loginFailed, loginAttempt }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [show, setShow] = useState(false);
    const { email, password } = formData;
    const [showPass, setShowPass] = useState(false);
    useNavigateOnAuth(isAuthenticated);
    useLoginFailed(loginFailed, isAuthenticated, setShow);

    function onSubmit(e) {
        e.preventDefault();

        login(email, password);
    }

    return (
        <div className="form-container">
            <Modal
                backdrop="static"
                keyboard={ false }
                show={ show }
                onHide={ () => handleClose(loginAttempt, setShow) }
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
                        onChange={ e => handleChange(e, setFormData, formData) }
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
                            onChange={ e => handleChange(e, setFormData, formData) }
                            minLength="8"
                            required 
                        />
                        <InputGroup.Text 
                            onClick={ () => handleShowPass("#login-password", setShowPass, showPass) }
                            id="password-toggle"
                        >
                        { showPass ? <BsEyeFill /> : <BsEyeSlash /> }
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
            <div className="social-oauth-container">
                <Button 
                    className="google-button social-button"
                    type="submit"
                    onClick={ e => handleSocialAuth(e, "google-oauth2", `${process.env.REACT_APP_WEB_URL}/google-oauth`) }
                >
                    Login with Google
                </Button>
                <Button 
                    className="facebook-button social-button"
                    type="submit"
                    onClick={ e => handleSocialAuth(e, "facebook", `${process.env.REACT_APP_WEB_URL}/facebook-oauth`) }
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

export default connect(mapStateToProps, { login, loginAttempt })(Login);
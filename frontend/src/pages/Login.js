import { login, loginAttempt } from '../actions/auth';
import { handleSocialAuth } from '../functions/handlers';
import { React } from "react";
import { InputGroup, Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEyeSlash, BsEyeFill } from 'react-icons/bs';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { useNavigateOnAuth, useLoginAttempt, useFormData, usePassword } from '../hooks/hooks';

import "../assets/styling/App.css";
import '../assets/styling/forms.css';

function Login({ login, isAuthenticated, loginFailed, loginAttempt }) {
    const [formData, setFormData] = useFormData({
        email: '',
        password: ''
    });
    const [show, setShow] = useLoginAttempt(loginFailed, isAuthenticated, loginAttempt);
    const { email, password } = formData;
    const [showPass, setShowPass] = usePassword(false);
    useNavigateOnAuth(isAuthenticated);

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
                onHide={ () => setShow() }
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
                        onChange={ e => setFormData(e) }
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
                            onChange={ e => setFormData(e) }
                            minLength="8"
                            required 
                        />
                        <InputGroup.Text 
                            onClick={ () => setShowPass("login-password") }
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
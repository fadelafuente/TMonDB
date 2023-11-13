import { React, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { login } from '../actions/auth';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../assets/styling/forms.css';
import axios from "axios";

axios.defaults.withCredentials = true;

export async function action() {
    return null
}

function Login({ login, isAuthenticated }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function onSubmit(e) {
        e.preventDefault();

        login(email, password);
    }

    async function handleGoogleAuth(e) {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=http://localhost:3000/trending`);

            window.location.replace(res.data.authorization_url)
        } catch(err) {

        }
    }

    if(isAuthenticated) {
        return <Navigate replace to="/trending" />
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Login</h2>
            <Form className="form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group controlId="formEmail">
                    <Form.Control
                        type="email" 
                        placeholder="Email" 
                        name="email"
                        value={ email }
                        onChange={ e => handleChange(e) }
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Control
                        type="password" 
                        placeholder="Password"
                        name="password"
                        value={ password }
                        onChange={ e => handleChange(e) }
                        minLength="8"
                        required 
                    />
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
                    className="google-button"
                    type="submit"
                    onClick={ e => handleGoogleAuth(e) }
                >
                    Login with Google
                </Button>
            </div>
        </div>
    )
}

    const mapStateToProps = state => ({
        isAuthenticated: state.auth.isAuthenticated
    });

export default connect(mapStateToProps, { login })(Login);
import '../assets/styling/forms.css';
import { React, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export async function action() {
    console.log("THIS FUCKING WORKS!!!")
    return null
}

function Login() {
//const Login = () => {
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

        // login(email, password);
    }

    // Is user authenticated?
    // redirect them to the home page

    return (
        <div className="form-container">
            <h2 className="form-title">Login</h2>
            <Form className="Form" onSubmit={ e=> onSubmit(e) }>
                <Form.Group controlId="formEmail">
                    <Form.Control
                        type="email" 
                        placeholder="Email" 
                        name="email"
                        value={ email }
                        onChange={ e => handleChange(e) }
                        required
                    />
                    <br />
                </Form.Group>
                <br />

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
                <br />
                <Form.Text>
                    Don't have an account? <Link to="/register">register here</Link>
                </Form.Text>
                <Form.Text>
                    Forgot password? <Link to="/reset_password">reset password here</Link>
                </Form.Text>
                <br />
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    )
}

// function mapStateToProps(state) {
//     // is authenticated?
// }

export default connect(null, {  })(Login);
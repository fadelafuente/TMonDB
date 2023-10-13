import '../assets/styling/forms.css';
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export async function action() {
    console.log("THIS FUCKING WORKS!!!")
    return null
}

export default function Register() {
    return (
        <div className="form-container">
            <h2 className="form-title">Create a New Account</h2>
            <Form className="Form">
                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Email" />
                    <br />
                    <Form.Text>
                        We will never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicUsername">
                    <Form.Control type="username" placeholder="Username" />
                    <br />
                </Form.Group>
                <br />
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Text>
                        Your password must be: <br/>
                        8-20 characters long <br/>
                        have at least 1 uppercase letter <br/>
                        have at least 1 lowercase letter <br/>
                        have at least one special character <br/>
                        <br/>
                    </Form.Text>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <br />
                <Form.Group className="mb-3" controlId="formBasicPassword2">
                    <Form.Control type="password" placeholder="Repeat Password" />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}
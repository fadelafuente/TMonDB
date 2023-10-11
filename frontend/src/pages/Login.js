import '../assets/styling/forms.css';
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export async function action() {
    console.log("THIS FUCKING WORKS!!!")
    return null
}

export default function Login() {
    return (
        <div className="form-container">
            <h2 className="form-title">Log In</h2>
            <Form className="Form">
                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Email" />
                    <br />
                </Form.Group>
                <br />

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" className="form-control" />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Log In
                </Button>
            </Form>
        </div>
    )
}

import '../assets/styling/forms.css';
import React from "react";
import { useNavigate, Form } from "react-router-dom";

export async function action() {
    console.log("THIS FUCKING WORKS!!!")
    return null
}

export default function Login() {
    return (
        <div className="form-container">
            <h2 className="form-title">Log In</h2>
            <Form method="post" className="default-form">
                <input 
                    type="email"
                    name="email"
                    placeholder="Email address"
                />
                <br />
                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                />
                <br />
                <button>Log in</button>
            </Form>
        </div>
    )
}

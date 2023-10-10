import '../assets/styling/forms.css';
import React from "react";
import { useNavigate, Form } from "react-router-dom";

export async function action() {
    console.log("THIS FUCKING WORKS!!!")
    return null
}

export default function Register() {
    return (
        <div className="form-container">
            <h2 className="form-title">Create Your Account</h2>
            <Form method="post" className="default-form">
                <input 
                    type="email"
                    name="email"
                    placeholder="Email address"
                />
                <br />
                <input 
                    type="username"
                    name="username"
                    placeholder="username"
                />
                <br />
                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                />
                <br />
                <input 
                    type="password"
                    name="password2"
                    placeholder="Retype Password"
                />
                <br />
                <button>Log in</button>
            </Form>
        </div>
    )
}
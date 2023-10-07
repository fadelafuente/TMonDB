import React from "react";
import { useNavigate, Form } from "react-router-dom";

export async function action() {
    console.log("THIS FUCKING WORKS!!!")
    return null
}

export default function Login() {
    return (
        <Form method="post">
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
    )
}

import { React, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { verify } from '../actions/auth';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../assets/styling/forms.css';

export async function action() {
    return null
}

function Activate({ verify }) {
    const { uid, token } = useParams();
    const [verified, setVerified] = useState(false);

    function verify_account(e) {
        e.preventDefault();

        verify(uid, token);
        setVerified(true);
    }

    if(verified) {
        return <Navigate replace to="/trending" />
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Verify Your Account</h2>
            <Form className="form" onSubmit={ e=> verify_account(e) }>
                <Button variant="primary" type="submit">
                    Verify
                </Button>
            </Form>
        </div>
    )
}

export default connect(null, { verify })(Activate);
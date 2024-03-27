import { verify } from '../actions/auth';
import { React, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { useNavigateOnVerify } from '../hooks/hooks';

import '../assets/styling/forms.css';

export async function action() {
    return null
}

function Activate({ verify }) {
    const { uid, token } = useParams();
    const [verified, setVerified] = useState(false);
    useNavigateOnVerify(verified);

    function verify_account(e) {
        e.preventDefault();

        verify(uid, token);
        setVerified(true);
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
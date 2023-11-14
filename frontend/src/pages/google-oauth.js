import React, { useEffect } from 'react';
import { Form, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { google_authenticate } from '../actions/auth';
import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function GoogleOauth({ google_authenticate }) {
    let location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const values = new URLSearchParams(location.search);
        const state = values.has("state") ? values.get("state") : null;
        const code = values.has("code") ? values.get("code") : null;

        if (state && code) {
            google_authenticate(state, code);
            navigate("/trending");
        }
    }, [google_authenticate, location]);

    function redirectBackToLogin(e) {
        e.preventDefault();

        navigate("/login");
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Logging in with Google</h2>
            <Form className="form">
                <FormText>
                    If you do not get redirected, go back to the login page.
                </FormText>
                <Button 
                    variant="primary" 
                    type="submit"
                    onClick={ e => redirectBackToLogin(e) }
                >
                    Login
                </Button>
            </Form>
        </div>
    );
};

export default connect(null, { google_authenticate })(GoogleOauth);
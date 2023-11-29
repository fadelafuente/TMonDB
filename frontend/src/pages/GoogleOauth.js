import { social_authenticate } from '../actions/auth';
import React, { useEffect } from 'react';
import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Form, useLocation, useNavigate, Navigate } from 'react-router-dom';

function GoogleOauth({ social_authenticate, isAuthenticated }) {
    let location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const values = new URLSearchParams(location.search);
        const state = values.has("state") ? values.get("state") : null;
        const code = values.has("code") ? values.get("code") : null;

        if (state && code) {
            social_authenticate(state, code, "google-oauth2");
        }
    }, [social_authenticate, location]);

    function redirectBackToLogin(e) {
        e.preventDefault();

        navigate("/login");
    }

    if(isAuthenticated) {
        return <Navigate replace to="/trending" />
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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { social_authenticate })(GoogleOauth);
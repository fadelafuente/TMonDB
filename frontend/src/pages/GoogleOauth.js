import { socialAuthenticate } from '../actions/auth';
import React, { useEffect } from 'react';
import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Form, useNavigate } from 'react-router-dom';
import useSocialAuth from '../hooks/useSocialAuth';

function GoogleOauth({ socialAuthenticate, isAuthenticated }) {
    const navigate = useNavigate();
    useSocialAuth("google-oauth2", socialAuthenticate);

    useEffect(() => {
        if(isAuthenticated) {
            return navigate("/trending");
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);

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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { socialAuthenticate })(GoogleOauth);
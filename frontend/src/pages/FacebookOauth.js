import { socialAuthenticate } from '../actions/auth';
import React from 'react';
import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Form, useNavigate } from 'react-router-dom';
import { useNavigateOnAuth, useSocialAuth }from '../hooks/hooks';
import { handleLoginRedirect } from '../functions/handlers';

function FacebookOauth({ socialAuthenticate, isAuthenticated }) {
    const navigate = useNavigate();
    useSocialAuth("facebook", socialAuthenticate);
    useNavigateOnAuth(isAuthenticated);

    return (
        <div className="form-container">
            <h2 className="form-title">Logging in with Facebook</h2>
            <Form className="form">
                <FormText>
                    If you do not get redirected, go back to the login page.
                </FormText>
                <Button 
                    variant="primary" 
                    type="submit"
                    onClick={ e => handleLoginRedirect(e, navigate) }
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

export default connect(mapStateToProps, { socialAuthenticate })(FacebookOauth);
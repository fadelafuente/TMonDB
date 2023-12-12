import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Form, Navigate, useLocation } from 'react-router-dom';
import { resend_activation } from '../actions/auth';
import { useEffect, useState } from 'react';

function VerifyEmail({ isAuthenticated, resend_activation }) {
    const location = useLocation();
    const [email, setEmail] = useState('');

    useEffect (() => {
        if(location.state) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    if(isAuthenticated) {
        return <Navigate replace to="/trending" />
    }

    if(!location.state && !email) {
        return <Navigate replace to="/login" />
    }

    return (
        <div className="form-container verify-container">
            <h2 className="form-title">Please verify your email</h2>
            <Form className="form">
                <FormText id="centered-text">
                    An email was sent to 
                    <p>
                        <strong>
                            { email }
                        </strong>
                    </p>
                    Click on the link to verify your email and activate your account.
                </FormText>
                <Button 
                    type="submit"
                    onClick={ () => resend_activation(email) }
                >
                    Resend Activation Email
                </Button>
            </Form>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { resend_activation })(VerifyEmail);
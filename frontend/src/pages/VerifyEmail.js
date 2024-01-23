import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Form } from 'react-router-dom';
import { resendActivation } from '../actions/auth';
import { useState } from 'react';
import { useNavigateOnAuth, useFailedSocialAuth, useSetEmail } from '../hooks/hooks';

function VerifyEmail({ isAuthenticated, resendActivation }) {
    const [email, setEmail] = useState('');
    useNavigateOnAuth(isAuthenticated);
    useFailedSocialAuth(email);
    useSetEmail(setEmail);

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
                    onClick={ () => resendActivation(email) }
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

export default connect(mapStateToProps, { resendActivation })(VerifyEmail);
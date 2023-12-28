import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Form, useLocation, useNavigate } from 'react-router-dom';
import { resendActivation } from '../actions/auth';
import { useEffect, useState } from 'react';

function VerifyEmail({ isAuthenticated, resendActivation }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');

    useEffect (() => {
        if(location.state) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    useEffect(() => {
        if(isAuthenticated) {
            return navigate("/trending");
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);

    useEffect(() => {
        if(!location.state && !email) {
            return navigate("/login");
        }
        // eslint-disable-next-line
    }, [location.state, email]);

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
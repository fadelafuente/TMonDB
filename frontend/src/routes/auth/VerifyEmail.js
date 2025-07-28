import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Form } from 'react-router-dom';
import { resendActivation } from '../../actions/auth';
import { useEmailFromLocation } from '../../hooks/auth/helpers/use-email-from-location';
import { useNavigateOnAuth }from '../../hooks/auth/helpers/use-navigate-on-auth';
import { useFailedSocialAuth } from '../../hooks/auth/helpers/use-failed-social-auth';

function VerifyEmail({ resendActivation }) {
    const email = useEmailFromLocation();
    useNavigateOnAuth();
    useFailedSocialAuth(email);

    return (
        <div className='form-container verify-container'>
            <h2 className='form-title'>Please verify your email</h2>
            <Form className='form'>
                <FormText id='centered-text'>
                    An email was sent to 
                    <p>
                        <strong>
                            { email }
                        </strong>
                    </p>
                    Click on the link to verify your email and activate your account.
                </FormText>
                <Button 
                    type='submit'
                    onClick={ () => resendActivation(email) }
                >
                    Resend Activation Email
                </Button>
            </Form>
        </div>
    );
};

export default connect(null, { resendActivation })(VerifyEmail);
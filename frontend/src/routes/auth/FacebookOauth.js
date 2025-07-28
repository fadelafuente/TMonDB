import { socialAuthenticate } from '../../actions/auth';
import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Form, useNavigate } from 'react-router-dom';
import { useNavigateOnAuth }from '../../hooks/auth/helpers/use-navigate-on-auth';
import { useSocialAuth } from '../../hooks/auth/use-social-auth';

function FacebookOauth({ socialAuthenticate }) {
    const navigate = useNavigate();
    useSocialAuth('facebook', socialAuthenticate);
    useNavigateOnAuth();

    return (
        <div className='form-container'>
            <h2 className='form-title'>Logging in with Facebook</h2>
            <Form className='form'>
                <FormText>
                    If you do not get redirected, go back to the login page.
                </FormText>
                <Button 
                    variant='primary' 
                    type='submit'
                    onClick={ e => navigate('/login') }
                >
                    Login
                </Button>
            </Form>
        </div>
    );
};

export default connect(null, { socialAuthenticate })(FacebookOauth);
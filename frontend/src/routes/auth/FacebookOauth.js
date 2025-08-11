import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Form, useNavigate } from 'react-router-dom';
import { useNavigateOnAuth } from '../../hooks/auth/helpers/use-navigate-on-auth';
import { useSocialAuth } from '../../hooks/auth/use-social-auth';

export default function FacebookOauth() {
  const navigate = useNavigate();
  useSocialAuth('facebook');
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
          onClick={ () => navigate('/login') }
        >
          Login
        </Button>
      </Form>
    </div>
  );
}
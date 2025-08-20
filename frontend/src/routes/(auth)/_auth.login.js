import { useState } from 'react';
import { handleSocialAuth } from '../../functions/handlers';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEyeSlash, BsEyeFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import Toaster from '../../components/Toaster';
import { useFormData } from '../../hooks/form/use-form-data';
import { usePassword } from '../../hooks/auth/helpers/use-password';
import { useLogin } from '../../hooks/features/user/auth/use-login';

import '../../assets/styling/App.css';
import '../../assets/styling/forms.css';

export default function LoginComponent() {
  const [formData, setFormData] = useFormData({
    email: '',
    password: '',
  });
  const [ show, setShow ] = useState(false);
  const { email, password } = formData;
  const [showPass, setShowPass] = usePassword(false);
  const { mutate: login } = useLogin();

  function onSubmit(e) {
    e.preventDefault();

    login({ email, password }, {
      onError: () => {
        setShow(true);
      }
    });
  }

  return (
    <div className='form-container'>
      <Toaster 
        show={ show } 
        onClose={ () => setShow(false) } 
        message='Either the email or password is incorrect.' 
        bg='danger'
        title='Failed to log in'
      />
      <h2 className='form-title'>Login</h2>
      <Form className='form' onSubmit={ (e) => onSubmit(e) }>
        <Form.Group controlId='formEmail' className='form-group'>
          <Form.Control
            type='email'
            placeholder='Email'
            name='email'
            value={email}
            onChange={ (e) => setFormData(e) }
            required
          />
        </Form.Group>
        <Form.Group controlId='login-password' className='form-group'>
          <InputGroup>
            <Form.Control
              type='password'
              placeholder='Password'
              name='password'
              value={ password }
              onChange={ (e) => setFormData(e) }
              minLength='8'
              required
            />
            <InputGroup.Text
              onClick={ () => setShowPass('login-password') }
              id='password-toggle'
            >
              { showPass ? <BsEyeFill /> : <BsEyeSlash /> }
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Login
        </Button>
        <Form.Text>
          Don't have an account? <Link to='/register'>register here</Link>
        </Form.Text>
        <Form.Text>
          Forgot password? <Link to='/reset-password'>reset password here</Link>
        </Form.Text>
        <hr className='break-line' />
        <Form.Text className='or-social-auth'>OR</Form.Text>
      </Form>
      <div className='social-oauth-container'>
        <Button
          className='google-button social-btn'
          type='submit'
          onClick={(e) =>
            handleSocialAuth(
              e,
              'google-oauth2',
              `${process.env.REACT_APP_WEB_URL}/google-oauth`
            )
          }
        >
          Login with Google
        </Button>
        <Button
          className='facebook-button social-btn'
          type='submit'
          onClick={(e) =>
            handleSocialAuth(
              e,
              'facebook',
              `${process.env.REACT_APP_WEB_URL}/facebook-oauth`
            )
          }
        >
          Login with Facebook
        </Button>
      </div>
    </div>
  );
}
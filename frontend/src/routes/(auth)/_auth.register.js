import { useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEyeSlash, BsEyeFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';

import Toaster from '../../components/Toaster';
import { useFormData } from '../../hooks/form/use-form-data';
import SpinningLoader from '../../components/Loader/SpinningLoader';
import { usePassword } from '../../hooks/auth/helpers/use-password';
import { useRegister } from '../../hooks/features/user/auth/use-register';

import '../../assets/styling/forms.css';

export default function RegisterComponent() {
  const { mutate: register, isPending } = useRegister();
  const [showPass, setShowPass] = usePassword(false);
  const [showPassRe, setShowPassRe] = usePassword(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useFormData({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    re_password: '',
  });

  const { first_name, last_name, username, email, password, re_password } =
    formData;

  function handleErrorMessage(response) {
    if (typeof response == 'string') {
      const element = new DOMParser()
        .parseFromString(response, 'text/html')
        .getElementsByClassName('exception_value');
      const err_message = element[0].innerHTML.replace(/['']+/g, '');
      setMessage(err_message);
    } else if (typeof response == 'object') {
      const responseValues = Object.values(response);
      const err_message = responseValues[0];
      setMessage(err_message);
    } else {
      setMessage('');
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    if(password === re_password) {
      register({
        first_name,
        last_name,
        username,
        email,
        password,
        re_password,
      }, {
        onSuccess: () => {
          navigate('/verify', { state: { email } });
        },
        onError: (error) => {
          handleErrorMessage(error?.response?.data || 'Failed to register.');
          setShow(true);
        }
      });
    }
  }

  return (
    <div className='form-container'>
      <Toaster 
        show={ show } 
        onClose={ () => setShow(false) } 
        message={ message }
        bg='danger'
        title='Failed to register'
      />
      <h2 className='form-title'>Create a New Account</h2>
      <Form className='Form' onSubmit={ (e) => onSubmit(e) }>
        <Form.Group className='form-group'>
          <Form.Control
            type='text'
            placeholder='First Name*'
            name='first_name'
            value={first_name}
            onChange={ (e) => setFormData(e) }
            required
          />
        </Form.Group>
        <Form.Group className='form-group'>
          <Form.Control
            type='text'
            placeholder='Last Name*'
            name='last_name'
            value={last_name}
            onChange={ (e) => setFormData(e) }
            required
          />
        </Form.Group>
        <Form.Group className='form-group' controlId='username-input'>
          <Form.Control
            type='text'
            placeholder='Username*'
            name='username'
            value={ username }
            onChange={ (e) => setFormData(e) }
            pattern='[a-zA-Z0-9]*'
            required
            maxLength={ 20 }
          />
        </Form.Group>
        <Form.Group controlId='formBasicEmail' className='form-group'>
          <Form.Control
            type='email'
            placeholder='Email*'
            name='email'
            value={email}
            onChange={ (e) => setFormData(e) }
            required
          />
          <Form.Text>
            We will never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='password-input' className='form-group'>
          <Form.Text>
            Your password must have: <br />
          </Form.Text>
          <Form.Text id='lowercase' className='invalid'>
            at least 1 lowercase letter <br />
          </Form.Text>
          <Form.Text id='uppercase' className='invalid'>
            at least 1 uppercase letter <br />
          </Form.Text>
          <Form.Text id='number' className='invalid'>
            at least 1 number <br />
          </Form.Text>
          <Form.Text id='special' className='invalid'>
            at least one special character <br />
          </Form.Text>
          <Form.Text id='length' className='invalid'>
            between 8-20 characters <br />
          </Form.Text>
          <InputGroup>
            <Form.Control
              type='password'
              placeholder='Password*'
              name='password'
              value={password}
              onChange={ (e) => setFormData(e) }
              required
              maxLength={ 20 }
            />
            <InputGroup.Text
              onClick={ () => setShowPass('password-input') }
              id='password-toggle'
            >
              { showPass ? <BsEyeFill /> : <BsEyeSlash /> }
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='re-password-input' className='form-group'>
          <InputGroup>
            <Form.Control
              type='password'
              placeholder='Repeat Password*'
              name='re_password'
              value={ re_password }
              onChange={ (e) => setFormData(e) }
              required
              maxLength={20}
            />
            <InputGroup.Text
              onClick={ () => setShowPassRe('re-password-input') }
              id='password-toggle'
            >
              { showPassRe ? <BsEyeFill /> : <BsEyeSlash /> }
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Button variant='primary' type='submit'>
          { isPending ? <SpinningLoader size='1.25em' /> : 'Submit' }
        </Button>
        <Form.Text>
          Already have an account? <Link to='/login'>Login here</Link>
        </Form.Text>
      </Form>
    </div>
  );
}